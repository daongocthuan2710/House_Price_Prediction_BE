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
# from keras.models import load_model
# from sklearn.preprocessing import StandardScaler
app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def root(request: Request):
    X_test_rs = [
        [0,1,0],
        [1,0,1],
        [0,1,0]
        ]
    predict = 0
    # sc = StandardScaler()
    # model_load = load_model('model.h5')
    # predict = model_load.predict(X_test_rs, batch_size=64) 
    # print(predict)
    # predict = sc.inverse_transform(predict)
    with open('data.json', 'r') as f:
        data = json.load(f)
    return templates.TemplateResponse("index.html", {"request": request, "data": data, "predict": predict})

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
