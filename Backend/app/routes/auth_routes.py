import token
import requests

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from fastapi import HTTPException

GOOGLE_CLIENT_ID = "335846643539-am8i2gne8ajsu3sbgfomb61pp26dr6ir.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
from app.core.config import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


from app.db.session import get_db
from app.models.user import User
from app.schemas.schema import UserCreate, UserLogin
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user

    



@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(db_user.id)})


    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.post("/google")
def google_auth(payload: dict, db: Session = Depends(get_db)):
    code = payload.get("code")

    if not code:
        raise HTTPException(status_code=400, detail="Missing Google code")

    token_res = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uri": "postmessage",
            "grant_type": "authorization_code",
        },
    )

    print("GOOGLE STATUS:", token_res.status_code)   # ⭐ ADD
    print("GOOGLE BODY:", token_res.text)            # ⭐ ADD

    if token_res.status_code != 200:
        raise HTTPException(status_code=400, detail="Google token exchange failed")

    tokens = token_res.json()

    if "id_token" not in tokens:
        raise HTTPException(status_code=400, detail="No id_token returned by Google")

    idinfo = id_token.verify_oauth2_token(
        tokens["id_token"],
        grequests.Request(),
        GOOGLE_CLIENT_ID,
        clock_skew_in_seconds=10,
    )

    email = idinfo["email"]
    name = idinfo.get("name", "Google User")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(name=name, email=email, password="")
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/health")
def auth_health():
    return {"status": "Auth service OK"}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name
    }

