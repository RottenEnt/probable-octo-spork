from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.api import api_router

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def get_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

app.include_router(api_router, prefix="/api")

import os

print("PROJECT ROOT:", os.path.abspath("."))
print("STATIC DIR CONTENTS:")
for root, dirs, files in os.walk("static"):
    print("ROOT:", root)
    print("DIRS:", dirs)
    print("FILES:", files)
