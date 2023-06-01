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

# libs partern
import re
# libs traning AI
import numpy as np
from keras.models import load_model
# from sklearn.preprocessing import StandardScaler
import tensorflow

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
        try:
            print('Crawling...')
            # itemUrlList = ['https://mogi.vn/quan-binh-tan/thue-mat-bang-cua-hang-shop-nhieu-muc-dich/nha-mat-tien-8-x-12-tinh-lo-10-gt-cac-quan-thuan-tien-id21125018']
            # pageSource['start-page'] = self.get_total_pages(pageSource)
            itemUrlList = self.get_hrefs_each_page(pageSource, pageSource['start-page'], pageSource['end-page'])
            if len(itemUrlList) > 0:             
                items = [] 
                for itemUrl in itemUrlList:
                    item = self.parse_item(itemUrl, pageSource)
                    if item == 0:
                        pass
                    else:
                        items.append(item)                                   
                self.export_to_json(items)        
                self.export_to_excel(items) 
            else:
                print("List urls is empty")
        except Exception as e:
            print("Error: ", e)
            print("Error: crawl_demo failed")
        else:
            print("Finished crawling data!")
    
    def export_to_json(self, data):
        print("Start Exporting Json file...")
        try:
            with open('data.json', 'w') as f:
            # with open('{}-{}.json'.format(pageSource['start-page'], pageSource['end-page']), 'w') as f:
                json.dump(data, f)
        except Exception as e:
            print("Error:", e)
        else:
            print("Finished exporting Json file!")     
            
    def export_to_excel(self, data):
        print("Start Exporting Excel file...")
        try:
            df = pd.DataFrame(data)
            df.to_excel(('data.xlsx'), index=False)
            # df.to_excel('{}-{}.xlsx'.format(pageSource['start-page'], pageSource['end-page']), index=False)
            print("Finished Exporting...")
        except Exception as e:
            print("Error: ", e)
        else:
            print("Finished Exporting Excel file!")
         
    def get_total_pages(self, pageSource):
        try:
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
        except Exception as e:
            print("Error: ", e)
            return 0
    
    def get_hrefs_each_page(self, pageSource, startPage, endPage):
        try:
            itemUrlList = []
            while startPage <= endPage:
                params = {'cp': startPage}
                resp = requests.get(pageSource['baseUrlTPHCM'], params=params)
                soup = BeautifulSoup(resp.content, "html.parser")    
                itemUrls = soup.select(pageSource['itemUrls']) 
                # logger.debug("BeautifulSoup object:\n{}".format(itemUrls))
                for itemUrl in itemUrls:
                    itemUrlList.append(itemUrl['href'])
                startPage += 1
            return itemUrlList
        except Exception as e:
            print("Error: ", e)
            return []   
    
    def parse_item(self, itemUrl, pageSource):
        try:
            resp = requests.get(itemUrl)
            soup = BeautifulSoup(resp.content, "html.parser")
            priceText = soup.select(pageSource['baseClass'] + pageSource['priceText'])[0].text.split()
            patternSubmittedDate = r"^\d{2}/\d{2}/\d{4}$"
            # Keys
            id = int(re.findall('\d+',itemUrl)[-1]) or None
            price = int(self.convert_price(priceText)) or None
            type = itemUrl.split("/")[4] or None
            district = itemUrl.split("/")[3] or None
            submittedDate = soup.select(pageSource['baseClass'] + pageSource['submitDate5'])[0].text.split()[0] or None
            if re.match(patternSubmittedDate, submittedDate):
                pass
            else:
                submittedDate = soup.select(pageSource['baseClass'] + pageSource['submitDate4'])[0].text.split()[0] or None
                if re.match(patternSubmittedDate, submittedDate):
                    pass
                else:
                    submittedDate = soup.select(pageSource['baseClass'] + pageSource['submitDate3'])[0].text.split()[0] or None
                    if re.match(patternSubmittedDate, submittedDate):
                        pass
                    else:
                        return 0
            area = soup.select(pageSource['baseClass'] + pageSource['area'])[0].text.split()[0] or None
            if area.isdigit():
                area = int(area)
            else:
                area = 0
                
            bedroom = soup.select(pageSource['baseClass'] + pageSource['bedroom'])[0].text.split()[0] or None
            if bedroom.isdigit():
                bedroom = int(bedroom)
            else:
                bedroom = 0   
                    
            bathroom = soup.select(pageSource['baseClass'] + pageSource['bathroom'])[0].text.split()[0] or None
            if bathroom.isdigit():
                bathroom = int(bathroom)
            else:
                bathroom = 0
                
            if(
                id is not None and
                price is not None and
                submittedDate is not None and
                area is not None and
                bedroom is not None and
                bathroom is not None and
                district is not None and
                type is not None
            ):
                tempObject = {
                    # 'id': id,
                    'price': price,
                    'district': district,
                    'submittedDate': submittedDate,
                    'area': area,
                    'bedroom': bedroom, 
                    'bathroom': bathroom,
                    'type':type
                }
                print(tempObject)
                return tempObject
            else:  
                return 0
        except Exception as _:
            return 0   
    
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
                    self.crawl(url)
                except Exception:
                    logging.exception('Failed to crawl:' + url['baseUrlTPHCM'])
                finally:
                    self.visited_urls.append(url)  
    
    def testModel(self):
        try:                 
            X_test_rs = np.array([
                [
                    35,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
                    0,  0,  0,  0,  0,  1,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,
                    0,  0,  0,  0,  0,  0,  0
                ]
            ])
            
            # Chuẩn hóa dữ liệu
            mean = 2.8994780170195344
            std = 1641.2708956700708
            X_test_rs = (X_test_rs - mean) / std
            
            # print(X_test_rs)
            model_load = load_model('./model.h5')
            predict = model_load.predict(X_test_rs) 
            print(predict)
        except Exception:
            logging.exception('Failed to training data:')
            
    def main(self):     
        self.testModel()    
        # self.run()
            
if __name__ == "__main__":
    pageSourceList = [
        {
            'baseUrl': 'https://mogi.vn/',
            'baseUrlTPHCM': 'https://mogi.vn/ho-chi-minh/thue-nha-dat',
            'start-page': 1, #22937
            'end-page': 22937,
            'itemUrls': '#property > div.property-listing > ul > li > div.prop-info > a',
            'baseClass': '#mogi-page-content',
            'totalPagesAddress': '#property > div.property-listing > div.property-list-result > span > b:nth-child(2)',
            'perPage': 15,
            'priceText': ' > div.property-detail.clearfix > div.property-detail-main > div.main-info > div.price',
            'submitDate5': ' > div.property-detail.clearfix > div.property-detail-main > div.main-info > div.info-attrs.clearfix > div:nth-child(5) > span:nth-child(2)',
            'submitDate4': ' >div.property-detail.clearfix > div.property-detail-main > div.main-info > div.info-attrs.clearfix > div:nth-child(4) > span:nth-child(2)',
            'submitDate3': ' > div.property-detail.clearfix > div.property-detail-main > div.main-info > div.info-attrs.clearfix > div:nth-child(3) > span:nth-child(2)',
            'area': ' > div.property-detail.clearfix > div.property-detail-main > div.main-info > div.info-attrs.clearfix > div:nth-child(1) > span:nth-child(2)',
            'bedroom': ' > div.property-detail.clearfix > div.property-detail-main > div.main-info > div.info-attrs.clearfix > div:nth-child(2) > span:nth-child(2)',
            'bathroom': ' > div.property-detail.clearfix > div.property-detail-main > div.main-info > div.info-attrs.clearfix > div:nth-child(3) > span:nth-child(2)',
        },
    ]
    c = Crawler(pageSourceList)
    c.main()