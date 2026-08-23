# RTPI Table OCR service

This is the structured OCR backend for the Admin page. It uses PaddleOCR PP-StructureV3 with the Thai PP-OCRv5 model and returns table cells as JSON.

## Run locally

```bash
cd ocr-service
python -m pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 7860
```

Set `OCR_URL` in `js/config.js` to the service URL, for example `http://localhost:7860`.

For a hosted deployment, use a private/authorized deployment where possible. Set `OCR_ALLOWED_ORIGINS` to the GitHub Pages origin instead of `*`.
