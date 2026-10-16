"""create members table with seed data

Revision ID: 0001
Revises:
"""

import sqlalchemy as sa

from alembic import op

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    members = op.create_table(
        "members",
        sa.Column("id", sa.Integer, primary_key=True, autoincrement=True),
        sa.Column("name", sa.String, nullable=False, unique=True),
        sa.Column("max_budget", sa.Integer, nullable=False),
        sa.Column("rent_weight", sa.Integer, nullable=False),
    )
    op.bulk_insert(
        members,
        [
            {"name": "ruby", "max_budget": 12000, "rent_weight": 12},
            {"name": "joyce", "max_budget": 10000, "rent_weight": 10},
            {"name": "cya", "max_budget": 11000, "rent_weight": 11},
        ],
    )


def downgrade() -> None:
    op.drop_table("members")
