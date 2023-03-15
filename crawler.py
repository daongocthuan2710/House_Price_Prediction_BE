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

logging.basicConfig(filename='example.log', level=logging.DEBUG)

class Crawler(object):
    def __init__(self, urls=[]):
        'constructor'
        self.visited_urls = []
        self.urls_to_visit = urls

    def reset(self):
        'reset the visited links'
        self.visited_urls = []
        self.urls_to_visit = []
    
    def get_linked_urls(self, url, html):
        soup = BeautifulSoup(html, 'html.parser')
        for link in soup.find_all('a'):
            path = link.get('href')
            if path and path.startswith('/'):
                path = urljoin(url, path)
            yield path
            
    def crawl(self, pageSource):
        totalPage = 0
        if pageSource['baseUrlTPHCM'] == 'https://nhadatvui.vn/cho-thue-nha-dat-tp-ho-chi-minh':
            totalPage = self.get_total_pages(pageSource)
        # itemUrlList = self.get_hrefs_each_page(pageSource,totalPage)     
        itemUrlList = ['https://nhadatvui.vn/cho-thue-can-ho-chung-cu-phuong-phu-thuan-quan-7/cho-thue-can-ho-quan-7-2pn-nha-trong-chi-7tr-thang-co-ho-boi-sieu-thi-gym-1678372075']
        items = [] 
        for itemUrl in itemUrlList:
            items.append(self.parse_item(itemUrl, pageSource))
        self.export_to_json(items)
        self.export_to_excel(items)
    
    def export_to_json(self, data):
        with open('data.json', 'w') as f:
            json.dump(data, f)
            
    def export_to_excel(self, data):
        # create a DataFrame
        df = pd.DataFrame({'name': ['Alice', 'Bob', 'Charlie'], 'age': [25, 30, 35]})

        # export to Excel file
        df.to_excel('data.xlsx', index=False)
        # data1 = {
        #     "name": ["Alice", "Bob", "Charlie"],
        #     "age": [25, 30, 35],
        #     "gender": ["female", "male", "male"]
        # }
        # df = pd.DataFrame(data1)
        # print(df)
        # df.to_excel('data.xlsx', index=False)
        # try:
        #     df = pd.DataFrame(data1)
        #     print(df)
        #     df.to_excel('data.xlsx', index=False)
        # except Exception as e:
        #     print("Đã xảy ra lỗi:", e)
        # else:
        #     print("Export Successful")
        # finally:
        #     print("Đã kết thúc hàm export_to_excel")

         
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
    
    def get_hrefs_each_page(self, pageSource,totalPage):
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
            'price': price,
            'district': soup.select(pageSource['baseClass'] + pageSource['district'])[0].text,
            'ward': soup.select(pageSource['baseClass'] + pageSource['ward'])[0].text,
            'submitDate': soup.select(pageSource['baseClass'] + pageSource['submitDate'])[0].text.split()[0],
            'area': soup.select(pageSource['baseClass'] + pageSource['area'])[0].text.split()[0],
            'length': soup.select(pageSource['baseClass'] + pageSource['length'])[0].text.split()[0],
            'width': soup.select(pageSource['baseClass'] + pageSource['width'])[0].text.split()[0], 
            'direction': soup.select(pageSource['baseClass'] + pageSource['direction'])[0].text.split()[0], 
            'bedroom': soup.select(pageSource['baseClass'] + pageSource['bedroom'])[0].text.split()[0], 
            'bathroom': soup.select(pageSource['baseClass'] + pageSource['bathroom'])[0].text.split()[0], 
            'id': int(re.findall('\d+',itemUrl)[-1])
        }
        json_string = json.dumps(tempObject)
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
    
    def run_demo(self):
        while self.urls_to_visit:
            url = self.urls_to_visit.pop(0)
            logging.info('Crawling:' + url['baseUrlTPHCM'])
            try:
                self.crawl(url)
            except Exception:
                logging.exception('Failed to crawl:' + url['baseUrlTPHCM'])
            finally:
                self.visited_urls.append(url)
    
    # async def fetch_url(self,session, url):
    #     async with session.get(url) as response:
    #         return await response.text()
                    
    # async def crawl_demo(self, urls):
    #     async with aiohttp.ClientSession() as session:
    #         tasks = []
    #         for url in urls:
    #             tasks.append(asyncio.ensure_future(self.fetch_url(session, url)))
    #         results = await asyncio.gather(*tasks)
    #         return results
    
    # def run(self, urls):
    #     loop = asyncio.get_event_loop()
    #     return loop.run_until_complete(self.crawl_demo(urls))
    
    def main(self):
        self.run_demo()
        # data = self.run(self.urls_to_visit)
        
if __name__ == "__main__":
    pageSourceList = [
        # {
        #     'baseUrl': 'https://dothi.net/',
        #     'address':'#mogi-page-content .props .link-overlay'
        # },
        # {
        #     'baseUrl': 'https://bdschannel.vn/nha-dat-cho-thue/',
        #     'address':'#mogi-page-content .props .link-overlay',
        #     'itemUrls': '#content #main .module-content .has_rightsidebar .mh-property .mh-estate a',
        #     'baseClass': '#main > div.row > div > section.border.mb-4'
        # },
        # {
        #     'baseUrl': 'https://batdongsanonline.vn/',
        #     'address':'#mogi-page-content .props .link-overlay',
        #     'itemUrls': '#content #main .module-content .has_rightsidebar .mh-property .mh-estate a',
        #     'baseClass': '#main > div.row > div > section.border.mb-4'
        # },
        {
            'baseUrl': 'https://nhadatvui.vn/',
            'baseUrlTPHCM': 'https://nhadatvui.vn/cho-thue-nha-dat-tp-ho-chi-minh',
            'address':'#mogi-page-content .props .link-overlay',
            'itemUrls': '#wrapper > div:nth-child(1) > div > div > div.main-search-product > div.left-search-product.box-show-container > div:nth-child(3) > div > div > div > div > div > a',
            'baseClass': '#wrapper > div.mt-3.mb-6 > div > div > div.product-show-left',
            'totalPagesAddress': '#wrapper > div:nth-child(1) > div > div > div.main-search-product > div.left-search-product.box-show-container > div.mt-4.display-flex.flex-center > div.flex-first > span',
            'perPage': 18,
            'priceText': ' > div.mt-3.product-title-price > div > div.mt-4.display-flex.flex-justify-between.text-medium-s > div.price-box > span',
            'district': ' > div.flex.justify-between.items-center > ul > li:nth-child(4) > a > span',
            'ward': ' > div.flex.justify-between.items-center > ul > li:nth-child(5) > a > span',
            'submitDate': ' > div.flex.justify-between.items-center > div',
            'area': ' > div:nth-child(3) > div > ul > li:nth-child(1)',
            'length': ' > div:nth-child(3) > div > ul > li:nth-child(2)',
            'width': ' > div:nth-child(3) > div > ul > li:nth-child(3)',
            'direction': ' > div:nth-child(3) > div > ul > li:nth-child(4)',
            'bedroom': ' > div:nth-child(3) > div > ul > li:nth-child(5)',
            'bathroom': ' > div:nth-child(3) > div > ul > li:nth-child(6)',
        }
    ]
    c = Crawler(pageSourceList)
    c.main()
            