from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

_session_factory: sessionmaker[Session] | None = None


def set_session_factory(factory: sessionmaker[Session]) -> None:
    """測試環境注入（Testcontainers）；正式執行時由 _get_session_factory 依設定建立。"""
    global _session_factory
    _session_factory = factory


def _get_session_factory() -> sessionmaker[Session]:
    global _session_factory
    if _session_factory is None:
        # Supabase pooler 會關閉閒置連線：pre_ping 檢查、recycle 定期汰換
        _session_factory = sessionmaker(
            bind=create_engine(settings.DATABASE_URL, pool_pre_ping=True, pool_recycle=300)
        )
    return _session_factory


def get_db() -> Iterator[Session]:
    session: Session = _get_session_factory()()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
