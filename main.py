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

# @app.on_event("startup")
# @repeat_every(seconds=60,)
# async def crawl_data():
#     pageSourceList = [
#         # {
#         #     'baseUrl': 'https://dothi.net/',
#         #     'address':'#mogi-page-content .props .link-overlay'
#         # },
#         # {
#         #     'baseUrl': 'https://bdschannel.vn/nha-dat-cho-thue/',
#         #     'address':'#mogi-page-content .props .link-overlay',
#         #     'itemUrls': '#content #main .module-content .has_rightsidebar .mh-property .mh-estate a',
#         #     'baseClass': '#main > div.row > div > section.border.mb-4'
#         # },
#         # {
#         #     'baseUrl': 'https://batdongsanonline.vn/',
#         #     'address':'#mogi-page-content .props .link-overlay',
#         #     'itemUrls': '#content #main .module-content .has_rightsidebar .mh-property .mh-estate a',
#         #     'baseClass': '#main > div.row > div > section.border.mb-4'
#         # },
#         {
#             'baseUrl': 'https://nhadatvui.vn/',
#             'baseUrlTPHCM': 'https://nhadatvui.vn/cho-thue-nha-dat-tp-ho-chi-minh',
#             'address':'#mogi-page-content .props .link-overlay',
#             'itemUrls': '#wrapper > div:nth-child(1) > div > div > div.main-search-product > div.left-search-product.box-show-container > div:nth-child(3) > div > div > div > div > div > a',
#             'baseClass': '#wrapper > div.mt-3.mb-6 > div > div > div.product-show-left',
#             'totalPagesAddress': '#wrapper > div:nth-child(1) > div > div > div.main-search-product > div.left-search-product.box-show-container > div.mt-4.display-flex.flex-center > div.flex-first > span',
#             'perPage': 18,
#             'priceText': ' > div.mt-3.product-title-price > div > div.mt-4.display-flex.flex-justify-between.text-medium-s > div.price-box > span',
#             'district': ' > div.flex.justify-between.items-center > ul > li:nth-child(4) > a > span',
#             'ward': ' > div.flex.justify-between.items-center > ul > li:nth-child(5) > a > span',
#             'submitDate': ' > div.flex.justify-between.items-center > div',
#             'area': ' > div:nth-child(3) > div > ul > li:nth-child(1)',
#             'length': ' > div:nth-child(3) > div > ul > li:nth-child(2)',
#             'width': ' > div:nth-child(3) > div > ul > li:nth-child(3)',
#             'direction': ' > div:nth-child(3) > div > ul > li:nth-child(4)',
#             'bedroom': ' > div:nth-child(3) > div > ul > li:nth-child(5)',
#             'bathroom': ' > div:nth-child(3) > div > ul > li:nth-child(6)',
#         }
#     ]
#     c = crawler.Crawler(pageSourceList)
#     c.main()