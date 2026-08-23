# RTPI Table OCR service

This is the structured OCR backend for the Admin page. It uses PaddleOCR PP-StructureV3 with the Thai PP-OCRv5 model and returns table cells as JSON.

## Run locally on Windows (recommended)

1. ติดตั้ง Python 3.11 จาก https://www.python.org/downloads/ โดยเลือก `Add Python to PATH`
2. เปิดโฟลเดอร์ `ocr-service`
3. ดับเบิลคลิก `start-ocr.bat`
4. รอจนหน้าต่างขึ้นว่า `OCR พร้อมใช้งาน`
5. เปิดหน้าแอดมิน แล้วใช้แท็บ `รูป → ตาราง`
6. ห้ามปิดหน้าต่าง OCR ระหว่างใช้งาน

เปิดทดสอบได้ที่ http://127.0.0.1:7860/health ควรเห็น `"ok":true`

ครั้งแรกจะใช้เวลาติดตั้งไลบรารีและดาวน์โหลดโมเดลหลาย GB ครั้งต่อไปเปิดเร็วขึ้น

ถ้าไม่เปิด OCR service หน้าเว็บจะไม่พัง แต่แท็บ OCR จะใช้ตัวสำรองในเบราว์เซอร์แทน

For a hosted deployment, use a private/authorized deployment where possible. Set `OCR_ALLOWED_ORIGINS` to the GitHub Pages origin instead of `*`.
