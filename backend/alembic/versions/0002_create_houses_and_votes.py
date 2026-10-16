"""create houses and votes tables

Revision ID: 0002
Revises: 0001
"""

import sqlalchemy as sa

from alembic import op

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None

landlord_status = sa.Enum("待聯絡", "聯絡中", "已回覆", name="landlord_status")
viewing_status = sa.Enum("未開始", "待開始", "進行中", "已結束", name="viewing_status")
vote_choice = sa.Enum("是", "否", name="vote_choice")


def upgrade() -> None:
    op.create_table(
        "houses",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("url", sa.String, nullable=False, unique=True),
        sa.Column("total_rent", sa.Integer, nullable=False),
        sa.Column("note", sa.Text, nullable=False),
        sa.Column("landlord_status", landlord_status, nullable=False, server_default="待聯絡"),
        sa.Column("viewing_status", viewing_status, nullable=False, server_default="未開始"),
        sa.Column("created_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.CheckConstraint("total_rent > 0", name="ck_houses_total_rent_positive"),
    )
    op.create_table(
        "votes",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column(
            "house_id",
            sa.Integer,
            sa.ForeignKey("houses.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("member_id", sa.Integer, sa.ForeignKey("members.id"), nullable=False),
        sa.Column("choice", vote_choice, nullable=False),
        sa.UniqueConstraint("house_id", "member_id", name="uq_votes_house_member"),
    )


def downgrade() -> None:
    op.drop_table("votes")
    op.drop_table("houses")
    vote_choice.drop(op.get_bind(), checkfirst=True)
    viewing_status.drop(op.get_bind(), checkfirst=True)
    landlord_status.drop(op.get_bind(), checkfirst=True)
