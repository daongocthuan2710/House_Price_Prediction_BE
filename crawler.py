import requests
from bs4 import BeautifulSoup
import logging
from urllib.parse import urljoin
import re
import math
import pandas as pd
import json
import logging
import asyncio
import aiohttp
import json

# Tạo đối tượng logger
logger = logging.getLogger(__name__)

# Thiết lập level của logger
logger.setLevel(logging.DEBUG)

# Tạo một handler để xử lý log
handler = logging.StreamHandler()

# Thiết lập level của handler
handler.setLevel(logging.DEBUG)

# Tạo formatter cho handler
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

# Thêm handler vào logger
logger.addHandler(handler)

# logger.debug("BeautifulSoup object:\n{}".format(tmp2.prettify()))

class Crawler(object):
    def __init__(self, urls=[]):
        'constructor'
        self.visited_urls = []
        self.urls_to_visit = urls

    def reset(self):
        'reset the visited links'
        self.visited_urls = []
        self.urls_to_visit = []
          
    def crawl(self, pageSource):
        totalPages = 0
        totalPages = self.get_total_pages(pageSource)
        # pageSource['pages']
        itemUrlList = self.get_hrefs_each_page(pageSource, pageSource['pages'])     
        items = [] 
        for itemUrl in itemUrlList:
            items.append(self.parse_item(itemUrl, pageSource))           
        return items
        
    def crawl_demo(self, pageSource): 
        try:
            itemUrlList = []
            totalPages = 0
            totalPages = self.get_total_pages(pageSource)
            itemUrlList = self.get_hrefs_each_page(pageSource, totalPages)     
            items = [] 
            for itemUrl in itemUrlList:
                items.append(self.parse_item(itemUrl, pageSource))           
            self.export_to_json(items)        
            self.export_to_excel(items)
            
        except Exception:
            print("Error: crawl_demo failed, cannot crawl data")
        else:
            print("crawl_demo successful")
    
    def export_to_json(self, data):
        print("Start Exporting Json file...")
        try:
            with open('data.json', 'w') as f:
                json.dump(data, f)
        except Exception as e:
            print("Đã xảy ra lỗi:", e)
        else:
            print("Export Json File Successful")     
            
    def export_to_excel(self, data):
        print("Start Exporting Excel file...")
        try:
            df = pd.DataFrame(data)
            df.to_excel('data.xlsx', index=False)
            print("Finished Exporting...")
        except Exception as e:
            print("Đã xảy ra lỗi:", e)
        else:
            print("Export Excel File Successful")
         
    def get_total_pages(self, pageSource):
        resp = requests.get(pageSource['baseUrlTPHCM'])
        soup = BeautifulSoup(resp.content, "html.parser")  
        totalItemsText = soup.select(pageSource['totalPagesAddress'])[0].text
        numbers = re.findall('\d+', totalItemsText)
        totalItemsString = ''
        for number in numbers:
            totalItemsString += number
        totalItems = int(totalItemsString)
        totalPage = math.ceil(totalItems / pageSource['perPage']) 
        return totalPage
    
    def get_hrefs_each_page(self, pageSource, totalPage):
        itemUrlList = []
        while totalPage > 0:
            params = {'page': totalPage}
            resp = requests.get(pageSource['baseUrlTPHCM'], params=params)
            soup = BeautifulSoup(resp.content, "html.parser")    
            itemUrls = soup.select(pageSource['itemUrls'])               
            for itemUrl in itemUrls:
                itemUrlList.append(itemUrl['href'])
            totalPage -= 1
        return itemUrlList
    
    def parse_item(self, itemUrl, pageSource):
        resp = requests.get(itemUrl)
        soup = BeautifulSoup(resp.content, "html.parser")
        priceText = soup.select(pageSource['baseClass'] + pageSource['priceText'])[0].text.split()
        price = self.convert_price(priceText)
        tempObject = {
            'id': int(re.findall('\d+',itemUrl)[-1]),
            'price': int(price),
            'district': soup.select(pageSource['baseClass'] + pageSource['address'])[0].text.split(",")[2],
            'ward': soup.select(pageSource['baseClass'] + pageSource['address'])[0].text.split(",")[1],
            'street': soup.select(pageSource['baseClass'] + pageSource['address'])[0].text.split(",")[0],
            'submitDate': soup.select(pageSource['baseClass'] + pageSource['submitDate'])[0].text.split()[0],
            'area': soup.select(pageSource['baseClass'] + pageSource['area'])[0].text.split()[0] if soup.select(pageSource['baseClass'] + pageSource['area'])[0].text.split()[0] != '--' else 0,
            # 'length': soup.select(pageSource['baseClass'] + pageSource['length'])[0].text.split()[0] if soup.select(pageSource['baseClass'] + pageSource['length'])[0].text.split()[0] != '--' else 0,
            # 'width': soup.select(pageSource['baseClass'] + pageSource['width'])[0].text.split()[0] if soup.select(pageSource['baseClass'] + pageSource['width'])[0].text.split()[0] != '--' else 0, 
            'bedroom': soup.select(pageSource['baseClass'] + pageSource['bedroom'])[0].text.split()[0] if soup.select(pageSource['baseClass'] + pageSource['bedroom'])[0].text.split()[0] != '--' else 0, 
            'bathroom': soup.select(pageSource['baseClass'] + pageSource['bathroom'])[0].text.split()[0] if soup.select(pageSource['baseClass'] + pageSource['bathroom'])[0].text.split()[0] != '--' else 0,
            # 'direction': soup.select(pageSource['baseClass'] + pageSource['direction'])[0].text.split()[0]
        }
        return tempObject
    
    def convert_price(self, priceText):
        price = 0
        priceFormat = {
            'nghìn': 1000,
            'triệu': 1000000,
            'tỷ': 1000000000
        }
        if len(priceText) > 1:
            for item in priceFormat.keys():
                if priceText[1] == item:
                    priceText[1] = priceFormat[item]
            price = float(priceText[0]) * priceText[1]   
        else:
            price = float(priceText[0])      
        return price
    
    def run(self):             
        while self.urls_to_visit:
                url = self.urls_to_visit.pop(0)
                logging.info('Crawling:' + url['baseUrlTPHCM'])
                try:                 
                    self.crawl_demo(url)
                except Exception:
                    logging.exception('Failed to crawl:' + url['baseUrlTPHCM'])
                finally:
                    self.visited_urls.append(url)  
    
    def main(self):
        self.run()
            
if __name__ == "__main__":
    pageSourceList = [
        {
            'baseUrl': 'https://mogi.vn/',
            'baseUrlTPHCM': 'https://mogi.vn/ho-chi-minh/thue-nha-dat',
            'pages': 10000,
            # 'pages': 20028,
            'address':'#mogi-page-content .props .link-overlay',
            'itemUrls': '#property > div.property-listing > ul > li > div.prop-info > a',
            'baseClass': '#mogi-page-content',
            'totalPagesAddress': '#property > div.property-listing > div.property-list-result > span > b:nth-child(2)',
            'perPage': 15,
            'priceText': ' > div.property-detail.clearfix > div.property-detail-main > div.main-info > div.price',
            'address': ' > div.property-detail.clearfix > div.property-detail-main > div.main-info > div.address',
            'submitDate': ' > div.property-detail.clearfix > div.property-detail-main > div.main-info > div.info-attrs.clearfix > div:nth-child(5) > span:nth-child(2)',
            'area': ' > div.property-detail.clearfix > div.property-detail-main > div.main-info > div.info-attrs.clearfix > div:nth-child(1) > span:nth-child(2)',
            'length': ' > div:nth-child(3) > div > ul > li:nth-child(2)',
            'width': ' > div:nth-child(3) > div > ul > li:nth-child(3)',
            'bedroom': ' > div.property-detail.clearfix > div.property-detail-main > div.main-info > div.info-attrs.clearfix > div:nth-child(2) > span:nth-child(2)',
            'bathroom': ' > div.property-detail.clearfix > div.property-detail-main > div.main-info > div.info-attrs.clearfix > div:nth-child(3) > span:nth-child(2)',
            'direction': ' > div:nth-child(3) > div > ul > li:nth-child(6)',
        },
        # {
        #     'baseUrl': 'https://nhadatvui.vn/',
        #     'baseUrlTPHCM': 'https://nhadatvui.vn/cho-thue-nha-dat-tp-ho-chi-minh',
        #     'pages': 1,
        #     # 'pages': 104,
        #     'address':'#mogi-page-content .props .link-overlay',
        #     'itemUrls': '#wrapper > div:nth-child(1) > div > div > div.main-search-product > div.left-search-product.box-show-container > div:nth-child(3) > div > div > div > div > div > a',
        #     'baseClass': '#wrapper > div.mt-3.mb-6 > div > div > div.product-show-left',
        #     'totalPagesAddress': '#wrapper > div:nth-child(1) > div > div > div.main-search-product > div.left-search-product.box-show-container > div.mt-4.display-flex.flex-center > div.flex-first > span',
        #     'perPage': 18,
        #     'priceText': ' > div.mt-3.product-title-price > div > div.mt-4.display-flex.flex-justify-between.text-medium-s > div.price-box > span',
        #     'address': ' > div.mt-3.product-title-price > div > div.mt-4.text-100.display-flex.flex-justify-between.flex-center > div > span',
        #     'district': ' > div.flex.justify-between.items-center > ul > li:nth-child(4) > a > span',
        #     'ward': ' > div.flex.justify-between.items-center > ul > li:nth-child(5) > a > span',
        #     'submitDate': ' > div.flex.justify-between.items-center > div',
        #     'area': ' > div:nth-child(3) > div > ul > li:nth-child(1)',
        #     'length': ' > div:nth-child(3) > div > ul > li:nth-child(2)',
        #     'width': ' > div:nth-child(3) > div > ul > li:nth-child(3)',
        #     'bedroom': ' > div:nth-child(3) > div > ul > li:nth-child(4)',
        #     'bathroom': ' > div:nth-child(3) > div > ul > li:nth-child(5)',
        #     'direction': ' > div:nth-child(3) > div > ul > li:nth-child(6)',
        # }
    ]
    c = Crawler(pageSourceList)
    c.main()