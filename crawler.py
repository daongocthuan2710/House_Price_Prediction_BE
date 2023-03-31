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
        itemUrlList = ['https://nhadatvui.vn/cho-thue-can-ho-chung-cu-xa-phong-phu-huyen-binh-chanh/cho-thue-can-ho-conic-dinh-khiem-74m2-2pn-2wc-5-5tr-thang-1679111422']
        items = [] 
        for itemUrl in itemUrlList:
            items.append(self.parse_item(itemUrl, pageSource))
        self.export_to_json(items)
        self.export_to_excel(items)
    
    def export_to_json(self, data):
        try:
            with open('data.json', 'w') as f:
                json.dump(data, f)
        except Exception as e:
            print("Đã xảy ra lỗi:", e)
        else:
            print("Export Successful")
        finally:
            print("Đã kết thúc hàm export_to_json")
        
            
    def export_to_excel(self, data):
        try:
            df = pd.DataFrame(data)
            df.to_excel('data.xlsx', index=False)
        except Exception as e:
            print("Đã xảy ra lỗi:", e)
        else:
            print("Export Successful")
        finally:
            print("Đã kết thúc hàm export_to_excel")

         
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
        
# if __name__ == "__main__":
#     c = Crawler(pageSourceList)
#     c.main()
            