#  Python AI Service

Flask microservice for SnapPass AI — handles all image processing.
Runs on **`http://localhost:8000`**

---

##  Prerequisites

- Python 3.9 or higher *(3.9 preferred)*

---

##  Quick Start

```bash
cd python-ai-service

# Create and activate virtual environment
python3.9 -m venv venv

# Mac/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Start the service
python main.py
```

---

## Folder Structure

```
python-ai-service/
├── app/
│   ├── routes/
│   │   └── process_routes.py   # All Flask endpoint definitions
│   └── services/
│       ├── bg_remove.py        # Background removal using rembg 
│       ├── face_center.py      # Face detection & centering 
│       ├── dpi_optimizer.py    # Resize to passport dimensions 
│       └── sheet_generator.py  # A4 sheet layout 
├── main.py                     # Flask entry point
├── config.py                   # Reads .env variables
├── requirements.txt            # Python dependencies
└── .env                        # Local environment variables (not committed)
```

---

## Environment Variables

Create a `.env` file in `python-ai-service/`:

```env
PORT=8000
FLASK_DEBUG=true
UPLOAD_DIR=uploads
MAX_FILE_MB=10
```

---

## API Routes

### `GET /health`

Check if the service is up.

```json
{ "status": "ok", "service": "python-ai-service" }
```

---

### `POST /remove-bg`

Full passport photo pipeline — background removal → face centering → DPI resize.

**Request — `multipart/form-data`:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | File | Yes | Portrait photo (JPEG, PNG, WEBP) |
| `background_colour` | Text |  No | Colour name or hex. Default: `white` |
| `preset` | Text |  No | Country preset. Default: `35x45` |

**Supported `background_colour` values:**

| Value | Description |
|-------|-------------|
| `white` | Pure white — most passport standards |
| `off-white` | Slightly warm white |
| `blue` | Passport blue |
| `grey` / `gray` | Light grey |
| `#ffffff` | Any custom hex colour code |

**Success Response — `200 OK`:**
Returns processed `image/png` bytes — 300 DPI, passport dimensions, face centred.

**Error Responses:**

| Status | Reason |
|--------|--------|
| `400` | No image file provided or empty filename |
| `422` | Unsupported background colour value |
| `500` | Internal processing error |

---

### `POST /generate-sheet`

Generate a print-ready A4 passport photo sheet.

```json
// Request Body
{
    "photo_path"  : "path/to/photo.jpg",
    "preset_id"   : "35x45",
    "quantity"    : 8,
    "bg_color"    : [255, 255, 255],
    "draw_guides" : true
}

// Success → returns JPEG image (200)
// Error   → { "error": "reason here" }
```

---

## Available Presets

| ID | Country | Size |
|----|---------|------|
| `35x45` | India / UK | 35 × 45 mm |
| `51x51` | USA Visa | 51 × 51 mm |
| `33x48` | Schengen | 33 × 48 mm |
| `40x60` | China | 40 × 60 mm |
| `2x2in` | US Passport | 2 × 2 in |

---

## Backend Integration Guide

### Complete pipeline flow

```
React Frontend
     ↓  POST /api/process  (filename, background_colour, preset)
Express Backend — image.controller.js (port 5000)
     ↓  POST /remove-bg  (multipart/form-data)
Python AI Service (port 8000)
     ↓  Step 1: bg_remove.py     — background removal
     ↓  Step 2: face_center.py   — face detect + centre
     ↓  Step 3: dpi_optimizer.py — resize to 300 DPI
     ↓  returns processed PNG bytes
Express Backend
     ↓  streams PNG back to frontend
React Frontend — displays passport photo
```

### Express controller code

In `backend/src/controllers/image.controller.js`:

```javascript
const axios    = require("axios");
const FormData = require("form-data");
const fs       = require("fs");

const form = new FormData();
form.append("image", fs.createReadStream(filePath));
form.append("background_colour", backgroundColour); // e.g. "white"
form.append("preset", preset);                      // e.g. "35x45"

const aiResponse = await axios.post(
  `${config.aiServiceUrl}/remove-bg`,
  form,
  {
    headers: { ...form.getHeaders() },
    responseType: "arraybuffer",
  }
);

res.set("Content-Type", "image/png");
res.send(Buffer.from(aiResponse.data));
```

### Environment variable

In `backend/.env`:
```env
AI_SERVICE_URL=http://localhost:8000
```

---

## Testing the Service

### Using Postman

1. Method: `POST`
2. URL: `http://localhost:8000/remove-bg`
3. Body → `form-data`
4. Add field: `image` → type `File` → select your photo
5. Add field: `background_colour` → type `Text` → `white`
6. Add field: `preset` → type `Text` → `35x45`
7. Click **Send**

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `flask` | Web framework |
| `flask-cors` | Cross-origin requests |
| `rembg` | AI background removal |
| `Pillow` | Image processing |
| `opencv-python-headless` | Face detection |
| `numpy` | Array operations |
| `python-dotenv` | Loads `.env` variables |
| `gunicorn` | Production server |

---

## Common Errors

**`rembg` first run is slow:**
First request downloads the U2Net model (~170MB). Subsequent requests are fast.

**`ECONNREFUSED` in Express:**
Python service is not running. Start it with `python main.py` first.

**`venv` not activating on Windows:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```