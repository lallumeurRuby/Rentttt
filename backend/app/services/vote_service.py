from typing import Any

from app.exceptions import BusinessError
from app.models.enums import VoteChoice
from app.models.member import Member
from app.models.vote import Vote
from app.repositories.house_repository import HouseRepository
from app.repositories.vote_repository import VoteRepository


class VoteService:
    def __init__(self, house_repository: HouseRepository, vote_repository: VoteRepository):
        self.house_repository = house_repository
        self.vote_repository = vote_repository

    def cast_vote(self, house_id: int, member: Member, choice: Any) -> Vote:
        """每位成員對同一房屋只有一票；再次投票以新選擇取代原選擇。"""
        if self.house_repository.find_by_id(house_id) is None:
            raise BusinessError("房屋不存在", 404)
        if choice is None or choice == "":
            raise BusinessError("必要參數未提供", 400)
        if choice not in {c.value for c in VoteChoice}:
            raise BusinessError("投票選項不合法", 400)

        vote = self.vote_repository.find_by_house_and_member(house_id, member.id)
        if vote is None:
            vote = Vote(house_id=house_id, member_id=member.id)
        vote.choice = VoteChoice(choice)
        return self.vote_repository.save(vote)
