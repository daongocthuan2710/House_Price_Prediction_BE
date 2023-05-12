from typing import Union
import uuid
from pydantic import BaseModel, Field
from fastapi import FastAPI, Request
from fastapi_utils.tasks import repeat_every
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import uvicorn
import crawler
import json
import os
from dotenv import load_dotenv
 
app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def root(request: Request):
    with open('data.json', 'r') as f:
        data = json.load(f)
    return templates.TemplateResponse("index.html", {"request": request, "data": data})

@app.get("/price/")
async def read_params(district: str, area: int, address: str, dateSubmit: str):
    item = {
        "district": district, 
        "area": area, 
        "address": address, 
        "dateSubmit": dateSubmit
    }
    return item

# @app.post("/upload")
# async def upload_file(file: UploadFile = File(...)):
#     contents = await file.read()
#     # process the contents of the file here
#     return {"filename": file.filename}
