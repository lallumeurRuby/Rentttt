"""enable row level security

Supabase 會自動把 public schema 的資料表開放給 Data API（PostgREST），
持有 anon key 的人可直接讀寫。開啟 RLS 且不建立任何 policy，即可擋下 anon / authenticated 角色；
後端以資料表 owner 身分連線，不受 RLS 限制。在一般 PostgreSQL（本機 / 測試）執行亦無副作用。

Revision ID: 0003
Revises: 0002
"""

from alembic import op

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None

TABLES = ("members", "houses", "votes")


def upgrade() -> None:
    for table in TABLES:
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    for table in TABLES:
        op.execute(f"ALTER TABLE {table} DISABLE ROW LEVEL SECURITY")
