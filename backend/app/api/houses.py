from typing import Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.auth import get_current_member
from app.core.deps import get_db
from app.models.house import House
from app.models.member import Member
from app.repositories.house_repository import HouseRepository
from app.repositories.member_repository import MemberRepository
from app.repositories.vote_repository import VoteRepository
from app.services.house_query_service import HouseQueryService, HouseView
from app.services.house_service import HouseService
from app.services.vote_service import VoteService

router = APIRouter()


class CreateHouseRequest(BaseModel):
    # 型別寬鬆接收，由 Service 驗證並回傳 api.yml 定義的 violation_type（而非 FastAPI 422）
    url: Any = None
    totalRent: Any = None
    note: Any = None


def _house_to_dict(house: House) -> dict[str, Any]:
    return {
        "id": house.id,
        "url": house.url,
        "totalRent": house.total_rent,
        "note": house.note,
        "landlordStatus": house.landlord_status.value,
        "viewingStatus": house.viewing_status.value,
        "createdAt": house.created_at.isoformat(),
    }


def _rent_splits_to_list(view: HouseView) -> list[dict[str, Any]]:
    return [
        {"memberName": s.member_name, "amount": s.amount, "overBudget": s.over_budget}
        for s in view.rent_splits
    ]


def _house_view_to_dict(view: HouseView) -> dict[str, Any]:
    return {
        **_house_to_dict(view.house),
        "rentSplits": _rent_splits_to_list(view),
        "voteResult": view.vote_result,
        "myVote": view.my_vote,
    }


@router.get("/houses")
def list_houses(
    db: Session = Depends(get_db),
    member: Member = Depends(get_current_member),
) -> dict[str, Any]:
    views = HouseQueryService(
        HouseRepository(db), MemberRepository(db), VoteRepository(db)
    ).list_houses(member)
    return {"success": True, "data": [_house_view_to_dict(view) for view in views]}


@router.get("/houses/considered")
def list_considered_houses(
    db: Session = Depends(get_db),
    member: Member = Depends(get_current_member),
) -> dict[str, Any]:
    views = HouseQueryService(
        HouseRepository(db), MemberRepository(db), VoteRepository(db)
    ).list_considered_houses(member)
    # 考慮列表不含投票欄位（api.yml ConsideredHouse）
    return {
        "success": True,
        "data": [
            {**_house_to_dict(view.house), "rentSplits": _rent_splits_to_list(view)}
            for view in views
        ],
    }


@router.post("/houses", status_code=201)
def create_house(
    request: CreateHouseRequest,
    db: Session = Depends(get_db),
    _member: Member = Depends(get_current_member),
) -> dict[str, Any]:
    house = HouseService(HouseRepository(db)).create_house(
        request.url, request.totalRent, request.note
    )
    return {"success": True, "data": _house_to_dict(house)}


@router.delete("/houses/{house_id}")
def delete_house(
    house_id: int,
    db: Session = Depends(get_db),
    _member: Member = Depends(get_current_member),
) -> dict[str, Any]:
    HouseService(HouseRepository(db)).delete_house(house_id)
    return {"success": True}


class CastVoteRequest(BaseModel):
    choice: Any = None


@router.put("/houses/{house_id}/my-vote")
def cast_my_vote(
    house_id: int,
    request: CastVoteRequest,
    db: Session = Depends(get_db),
    member: Member = Depends(get_current_member),
) -> dict[str, Any]:
    VoteService(HouseRepository(db), VoteRepository(db)).cast_vote(house_id, member, request.choice)
    return {"success": True}


class UpdateLandlordStatusRequest(BaseModel):
    landlordStatus: Any = None


@router.put("/houses/{house_id}/landlord-status")
def update_landlord_status(
    house_id: int,
    request: UpdateLandlordStatusRequest,
    db: Session = Depends(get_db),
    _member: Member = Depends(get_current_member),
) -> dict[str, Any]:
    HouseService(HouseRepository(db)).update_landlord_status(house_id, request.landlordStatus)
    return {"success": True}


class UpdateViewingStatusRequest(BaseModel):
    viewingStatus: Any = None


@router.put("/houses/{house_id}/viewing-status")
def update_viewing_status(
    house_id: int,
    request: UpdateViewingStatusRequest,
    db: Session = Depends(get_db),
    _member: Member = Depends(get_current_member),
) -> dict[str, Any]:
    HouseService(HouseRepository(db)).update_viewing_status(house_id, request.viewingStatus)
    return {"success": True}


class UpdateHouseRequest(BaseModel):
    totalRent: Any = None
    note: Any = None


@router.put("/houses/{house_id}")
def update_house(
    house_id: int,
    request: UpdateHouseRequest,
    db: Session = Depends(get_db),
    _member: Member = Depends(get_current_member),
) -> dict[str, Any]:
    HouseService(HouseRepository(db)).update_house(house_id, request.totalRent, request.note)
    return {"success": True}
