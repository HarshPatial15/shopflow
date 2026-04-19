from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db, engine
from redis_client import get_redis
import models, schemas
from auth import verify_token
import json, traceback

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ShopFlow Order Service", version="1.0.0")

@app.get("/health")
def health():
    return {"status": "ok", "service": "order-service"}

# --- cart endpoints (redis) ---

@app.post("/cart/add")
def add_to_cart(item: schemas.CartItem, user: dict = Depends(verify_token), r=Depends(get_redis)):
    cart_key = f"cart:{user['sub']}"
    cart = json.loads(r.get(cart_key) or "[]")
    for i in cart:
        if i["product_id"] == item.product_id:
            i["quantity"] += item.quantity
            r.set(cart_key, json.dumps(cart))
            return {"message": "Cart updated", "cart": cart}
    cart.append(item.model_dump())
    r.set(cart_key, json.dumps(cart))
    return {"message": "Item added to cart", "cart": cart}

@app.get("/cart")
def get_cart(user: dict = Depends(verify_token), r=Depends(get_redis)):
    cart_key = f"cart:{user['sub']}"
    cart = json.loads(r.get(cart_key) or "[]")
    return {"cart": cart}

@app.delete("/cart/remove/{product_id}")
def remove_from_cart(product_id: int, user: dict = Depends(verify_token), r=Depends(get_redis)):
    cart_key = f"cart:{user['sub']}"
    cart = json.loads(r.get(cart_key) or "[]")
    cart = [i for i in cart if i["product_id"] != product_id]
    r.set(cart_key, json.dumps(cart))
    return {"message": "Item removed", "cart": cart}

@app.delete("/cart/clear")
def clear_cart(user: dict = Depends(verify_token), r=Depends(get_redis)):
    r.delete(f"cart:{user['sub']}")
    return {"message": "Cart cleared"}

# --- order endpoints (postgres) ---

@app.post("/orders", response_model=schemas.OrderOut, status_code=201)
def place_order(user: dict = Depends(verify_token), db: Session = Depends(get_db), r=Depends(get_redis)):
    try:
        cart_key = f"cart:{user['sub']}"
        cart = json.loads(r.get(cart_key) or "[]")
        if not cart:
            raise HTTPException(status_code=400, detail="Cart is empty")
        total = sum(i["price"] * i["quantity"] for i in cart)
        order = models.Order(user_id=int(user["sub"]), total=total)
        db.add(order)
        db.flush()
        for i in cart:
            db.add(models.OrderItem(
                order_id=order.id,
                product_id=i["product_id"],
                quantity=i["quantity"],
                price=i["price"]
            ))
        db.commit()
        db.refresh(order)
        r.delete(cart_key)
        return order
    except HTTPException:
        raise
    except Exception as e:
        print("ORDER ERROR:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/orders", response_model=List[schemas.OrderOut])
def get_orders(user: dict = Depends(verify_token), db: Session = Depends(get_db)):
    return db.query(models.Order).filter(models.Order.user_id == int(user["sub"])).all()

@app.get("/orders/{order_id}", response_model=schemas.OrderOut)
def get_order(order_id: int, user: dict = Depends(verify_token), db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(
        models.Order.id == order_id,
        models.Order.user_id == int(user["sub"])
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
