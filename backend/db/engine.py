import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Optional: loads from a local .env if present in the *current working directory*.
# In containers, Compose/ECS provide env vars; this does nothing.
load_dotenv(override=False)

BASE_DIR = Path(__file__).resolve().parent.parent

def must_get(name: str) -> str:
    v = os.getenv(name)
    if not v:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return v

DB_USER = must_get("DB_USER")
DB_PASSWORD = must_get("DB_PASSWORD")
DB_NAME = must_get("DB_NAME")
DB_HOST = must_get("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT", "5432"))

DB_SSLMODE = os.getenv("DB_SSLMODE", "disable")  # "verify-full" for RDS, "disable" locally
connect_args = {}

if DB_SSLMODE != "disable":
    SSL_ROOT_CERT = BASE_DIR / "certs" / "global-bundle.pem"
    if not SSL_ROOT_CERT.exists():
        raise RuntimeError(
            f"RDS CA bundle not found at {SSL_ROOT_CERT}. "
            "Provide it in the image or mount it, or set DB_SSLMODE=disable for local dev."
        )
    connect_args = {
        "sslmode": DB_SSLMODE,
        "sslrootcert": str(SSL_ROOT_CERT),
    }

DATABASE_URL = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=True,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
