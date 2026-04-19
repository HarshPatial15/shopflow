from fastapi import HTTPException, Header
from jose import jwt, JWTError
import os

SECRET_KEY = os.getenv("SECRET_KEY", "shopflow-super-secret-key")
ALGORITHM  = "HS256"

def verify_token(authorization: str = Header(...)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Authorization header missing or malformed")
