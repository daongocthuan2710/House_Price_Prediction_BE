from typing import Union
import uuid
from pydantic import BaseModel, Field
from fastapi import FastAPI
import crawler

app = FastAPI()


@app.get("/")
def read_root():
    c = crawler.Crawler()
    return c.main()


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}