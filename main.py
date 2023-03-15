from typing import Union
import uuid
from pydantic import BaseModel, Field
from fastapi import FastAPI
import crawler
import json

app = FastAPI()


@app.get("/")
async def read_root():
    with open('data.json', 'r') as f:
        data = json.load(f)
    return data


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}