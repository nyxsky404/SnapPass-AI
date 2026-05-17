FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Temporary placeholder service until the real Python AI service is implemented.
# Use Python's built-in HTTP server so the container starts reliably on port 8000.
CMD ["python", "-m", "http.server", "8000"]
