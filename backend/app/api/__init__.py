from fastapi import APIRouter

from app.api import auth, houses, members

router = APIRouter()
router.include_router(members.router)
router.include_router(auth.router)
router.include_router(houses.router)
