from dataclasses import dataclass

from app.models.enums import VoteChoice
from app.models.house import House
from app.models.member import Member
from app.models.vote import Vote
from app.repositories.house_repository import HouseRepository
from app.repositories.member_repository import MemberRepository
from app.repositories.vote_repository import VoteRepository

CONSIDER_THRESHOLD = 2
VOTE_RESULT_CONSIDERED = "列入考慮"
VOTE_RESULT_REJECTED = "不考慮"
VOTE_RESULT_PENDING = "投票中"


@dataclass(frozen=True)
class RentSplit:
    member_name: str
    amount: int
    over_budget: bool


@dataclass(frozen=True)
class HouseView:
    house: House
    rent_splits: list[RentSplit]
    vote_result: str
    my_vote: str | None


def split_rent(total_rent: int, members: list[Member]) -> list[RentSplit]:
    """依權重分攤並四捨五入至整數元；加總與總租金的差額由權重最高者吸收。"""
    total_weight = sum(member.rent_weight for member in members)
    # 整數運算的四捨五入：round(total × weight ÷ total_weight)
    amounts = {
        member.name: (2 * total_rent * member.rent_weight + total_weight) // (2 * total_weight)
        for member in members
    }
    heaviest = max(members, key=lambda member: member.rent_weight)
    amounts[heaviest.name] += total_rent - sum(amounts.values())
    return [
        RentSplit(member.name, amounts[member.name], amounts[member.name] > member.max_budget)
        for member in members
    ]


def vote_result(votes: list[Vote]) -> str:
    yes_count = sum(vote.choice == VoteChoice.YES for vote in votes)
    no_count = sum(vote.choice == VoteChoice.NO for vote in votes)
    if yes_count >= CONSIDER_THRESHOLD:
        return VOTE_RESULT_CONSIDERED
    if no_count >= CONSIDER_THRESHOLD:
        return VOTE_RESULT_REJECTED
    return VOTE_RESULT_PENDING


class HouseQueryService:
    def __init__(
        self,
        house_repository: HouseRepository,
        member_repository: MemberRepository,
        vote_repository: VoteRepository,
    ):
        self.house_repository = house_repository
        self.member_repository = member_repository
        self.vote_repository = vote_repository

    def list_considered_houses(self, viewer: Member) -> list[HouseView]:
        return [
            view for view in self.list_houses(viewer) if view.vote_result == VOTE_RESULT_CONSIDERED
        ]

    def list_houses(self, viewer: Member) -> list[HouseView]:
        members = self.member_repository.find_all()
        views = []
        for house in self.house_repository.find_all_by_rent_then_newest():
            votes = self.vote_repository.find_by_house(house.id)
            my_vote = next((v.choice.value for v in votes if v.member_id == viewer.id), None)
            views.append(
                HouseView(
                    house=house,
                    rent_splits=split_rent(house.total_rent, members),
                    vote_result=vote_result(votes),
                    my_vote=my_vote,
                )
            )
        return views
