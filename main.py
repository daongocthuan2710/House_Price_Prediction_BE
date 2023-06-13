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
import numpy as np
from dotenv import load_dotenv

from fastapi.middleware.cors import CORSMiddleware

from training import Model

# from keras.models import load_model
# from sklearn.preprocessing import StandardScaler
app = FastAPI()
origins = [
    "http://localhost:3000/",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="templates")

class Array(BaseModel):
    data: list

@app.get("/")
def root(request: Request):
    model = Model()
    data = model.LSTMModel()
    data = np.delete(data,0)
    list = data.tolist()
    return list
    # with open('data.json', 'r') as f:
    #     data = json.load(f)
    # return templates.TemplateResponse("index.html", {"request": request, "data": data, "predict": predict})

@app.post("/xgboost-model")
async def read_params(array : Array):
    model = Model()
    response = model.xgboostModel(array.data)
    priceList = response.tolist()     
    if priceList:
        return priceList
    return None
        

@app.get("/lstm-model")
async def getPriceLSTMModel():
    model = Model()
    response = model.LSTMModel()
    response = np.delete(response,0)
    if len(response) > 0:
        priceList = response.tolist()
        return priceList
    return None

if __name__ == "__main__":
    model = Model()
    data = model.LSTMModel()