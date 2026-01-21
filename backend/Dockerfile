# syntax=docker/dockerfile:1

ARG PYTHON_VERSION=3.12
FROM python:${PYTHON_VERSION}-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Create non-root user
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

# Install dependencies first (better caching)
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    python -m pip install --no-cache-dir -r requirements.txt

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . .

# Fix ownership
RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 3000

CMD ["uvicorn", "main:app", "--host=0.0.0.0", "--port=3000"]
