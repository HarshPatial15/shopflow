from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

AUTH_SERVICE    = os.getenv("AUTH_SERVICE_URL", "http://localhost:3001")
PRODUCT_SERVICE = os.getenv("PRODUCT_SERVICE_URL", "http://localhost:3002")
ORDER_SERVICE   = os.getenv("ORDER_SERVICE_URL", "http://localhost:3003")

app = FastAPI(title="ShopFlow API Gateway", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def proxy(request: Request, base_url: str, path: str):
    url = f"{base_url}{path}"
    headers = dict(request.headers)
    headers.pop("host", None)
    body = await request.body()
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=request.method,
                url=url,
                headers=headers,
                content=body,
                params=request.query_params,
                timeout=30.0
            )
            return response
        except httpx.ConnectError:
            raise HTTPException(status_code=503, detail=f"Service unavailable: {base_url}")

from fastapi.responses import Response

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "api-gateway",
        "routes": {
            "/auth/*":    AUTH_SERVICE,
            "/products/*": PRODUCT_SERVICE,
            "/orders/*":  ORDER_SERVICE,
            "/cart/*":    ORDER_SERVICE
        }
    }

@app.api_route("/auth/{path:path}", methods=["GET","POST","PUT","DELETE"])
async def auth_proxy(path: str, request: Request):
    r = await proxy(request, AUTH_SERVICE, f"/{path}")
    return Response(content=r.content, status_code=r.status_code, headers=dict(r.headers))

@app.api_route("/products/{path:path}", methods=["GET","POST","PUT","DELETE"])
async def product_proxy(path: str, request: Request):
    r = await proxy(request, PRODUCT_SERVICE, f"/products/{path}")
    return Response(content=r.content, status_code=r.status_code, headers=dict(r.headers))

@app.get("/products")
async def products_list(request: Request):
    r = await proxy(request, PRODUCT_SERVICE, "/products")
    return Response(content=r.content, status_code=r.status_code, headers=dict(r.headers))

@app.api_route("/orders/{path:path}", methods=["GET","POST","PUT","DELETE"])
async def order_proxy(path: str, request: Request):
    r = await proxy(request, ORDER_SERVICE, f"/orders/{path}")
    return Response(content=r.content, status_code=r.status_code, headers=dict(r.headers))

@app.api_route("/orders", methods=["GET","POST"])
async def orders(request: Request):
    r = await proxy(request, ORDER_SERVICE, "/orders")
    return Response(content=r.content, status_code=r.status_code, headers=dict(r.headers))

@app.api_route("/cart/{path:path}", methods=["GET","POST","PUT","DELETE"])
async def cart_proxy(path: str, request: Request):
    r = await proxy(request, ORDER_SERVICE, f"/cart/{path}")
    return Response(content=r.content, status_code=r.status_code, headers=dict(r.headers))

@app.api_route("/cart", methods=["GET","POST","DELETE"])
async def cart(request: Request):
    r = await proxy(request, ORDER_SERVICE, "/cart")
    return Response(content=r.content, status_code=r.status_code, headers=dict(r.headers))
