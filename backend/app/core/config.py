import os


class Settings:
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg://postgres:postgres@localhost:5432/rentttt_dev",
    )
    API_PREFIX: str = "/api"
    JWT_SECRET: str = os.getenv("JWT_SECRET", "rentttt-dev-secret")


settings = Settings()
