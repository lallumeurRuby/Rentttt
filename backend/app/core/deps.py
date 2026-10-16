from collections.abc import Iterator

from sqlalchemy.orm import Session, sessionmaker

_session_factory: sessionmaker[Session] | None = None


def set_session_factory(factory: sessionmaker[Session]) -> None:
    global _session_factory
    _session_factory = factory


def get_db() -> Iterator[Session]:
    if _session_factory is None:
        raise RuntimeError("Session factory not initialized")
    session: Session = _session_factory()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
