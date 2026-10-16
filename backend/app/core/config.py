import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://postgres:postgres@localhost:5434/rentttt_dev",
    )
    API_PREFIX: str = "/api"
    JWT_SECRET: str = os.getenv("JWT_SECRET", "rentttt-dev-secret-change-me-in-production")
    # 逗號分隔的允許來源；未設定時允許全部（本機開發）
    CORS_ORIGINS: list[str] = [
        origin.strip() for origin in os.getenv("CORS_ORIGINS", "*").split(",") if origin.strip()
    ]


settings = Settings()
