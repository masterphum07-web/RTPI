"""RTPI table OCR service.

Run with: uvicorn app:app --host 0.0.0.0 --port 7860
The service uses PaddleOCR PP-StructureV3 to preserve table cells.
"""
import io
import os
from html.parser import HTMLParser

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

try:
    from paddleocr import PPStructureV3
except ImportError as exc:  # clearer startup error in deployments
    raise RuntimeError("Install paddleocr and paddlepaddle before starting the OCR service") from exc


class TableParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows = []
        self.current = None
        self.cell = None

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.current = []
        elif tag in ("td", "th") and self.current is not None:
            self.cell = []

    def handle_data(self, data):
        if self.cell is not None:
            self.cell.append(data)

    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.cell is not None and self.current is not None:
            self.current.append(" ".join("".join(self.cell).split()))
            self.cell = None
        elif tag == "tr" and self.current is not None:
            if any(self.current):
                self.rows.append(self.current)
            self.current = None


app = FastAPI(title="RTPI Table OCR")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[x.strip() for x in os.getenv("OCR_ALLOWED_ORIGINS", "*").split(",") if x.strip()],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

pipeline = PPStructureV3(lang="th", use_table_recognition=True)


@app.get("/health")
def health():
    return {"ok": True, "engine": "PaddleOCR PP-StructureV3", "language": "th"}


@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="รองรับเฉพาะไฟล์รูปภาพ")
    raw = await file.read()
    if len(raw) > 15 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="ไฟล์ใหญ่เกิน 15 MB")
    try:
        image = Image.open(io.BytesIO(raw)).convert("RGB")
        result = pipeline.predict(input=image)
        rows = []
        for item in result:
            if isinstance(item, dict):
                tables = item.get("table_res_list", [])
            else:
                tables = getattr(item, "table_res_list", None) or getattr(item, "json", {}).get("table_res_list", [])
            for table in tables:
                html = table.get("pred_html", "") if isinstance(table, dict) else getattr(table, "pred_html", "")
                parser = TableParser()
                parser.feed(html or "")
                rows.extend(parser.rows)
        if not rows:
            raise HTTPException(status_code=422, detail="ไม่พบโครงสร้างตารางในรูป")
        return {"ok": True, "rows": rows, "rowCount": len(rows)}
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"ประมวลผลรูปไม่สำเร็จ: {exc}") from exc
