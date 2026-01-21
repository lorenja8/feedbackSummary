import time
from sqlalchemy.exc import OperationalError
from db.engine import engine
from db.base import Base
import db.tables  # Important: makes sure models are registered


def init_db():
    for i in range(10):
        try:
            Base.metadata.create_all(bind=engine)
            print("Database initialized")
            return
        except OperationalError:
            print("Database not ready, retrying...")
            time.sleep(2)
    raise RuntimeError("Database not available")


# if __name__ == "__main__":
#     init_db()
