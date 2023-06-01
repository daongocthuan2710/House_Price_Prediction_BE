import logging
from operator import concat
from urllib.parse import urljoin
import pandas as pd
import logging
import numpy as np
# XGB
import joblib

# LSTM
from keras.models import load_model
from sklearn.preprocessing import MinMaxScaler



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


class Model(object):    
    # def __init__(self, urls=[]):

    def xgboostModel(self):
        try:                 
            x_test_rs = np.array([
                [
                    35,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
                    0,  0,  0,  0,  0,  1,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,
                    0,  0,  0,  0,  0,  0,  0
                ]
            ])
            # Chuẩn hóa dữ liệu
            mean = 2.8994780170195344
            std = 1641.2708956700708
            x_test_rs = (x_test_rs - mean) / std
            
            model_load = joblib.load('xgb_model.pkl')
            predict = model_load.predict(x_test_rs) 
            print(predict)
        except Exception:
            logging.exception('Failed to training data:')
    
    def series_to_supervised(self, data, n_in=1, n_out=1, dropnan=True):
        n_vars = 1 if type(data) is list else data.shape[1]
        df = pd.DataFrame(data)
        cols, names = list(), list()
        
        for i in range(n_in, 0, -1):
            cols.append(df.shift(i))
            names += [('var%d(t-%d)' % (j+1, i)) for j in range(n_vars)]
        
        for i in range(0, n_out):
            cols.append(df.shift(-i))
            if i == 0:
                names += [('var%d(t)' % (j+1)) for j in range(n_vars)]
            else:
                names += [('var%d(t+%d)' % (j+1, i)) for j in range(n_vars)]

        agg = pd.concat(cols, axis=1)
        agg.columns = names
        
        if dropnan:
            agg.dropna(inplace=True)
        return agg


    def LSTMModel(self):  
        try:
            # Load csv
            dataset_2023 = pd.read_csv('LSTM-2023.csv')
            
            # Remove price column
            dataset_2023 = dataset_2023.drop(columns=['price'], axis=1)
            dataset_2023 = dataset_2023.drop(columns=['submittedDate'], axis=1)
            
            # Convert Datetime to Date in Python
            # dataset_2023['submittedDate'] = pd.to_datetime(dataset_2023['submittedDate'])
            # dataset_2023.set_index('submittedDate', inplace=True)
            
            # Handle convert dataframe to array
            values_2023 = dataset_2023.values
            values_2023 = values_2023.astype('float32')

            #  Chuẩn hóa dữ liệu
            scaler = MinMaxScaler(feature_range=(0, 1))
            scaled_2023 = scaler.fit_transform(values_2023)

            #  Convert data to supervised dataset
            reframed_2023 = self.series_to_supervised(scaled_2023, 1, 1, False)

            # Xóa cột không cần thiết
            reframed_2023.drop(reframed_2023.columns[[6, 7, 8, 9]], axis=1, inplace=True)
            
            # Điều chỉnh shape dữ liệu cho phù hợp với input
            values_2023 = reframed_2023.values
            # Bỏ cột cần predict
            X = values_2023[:, :-1]
            X = X.reshape((X.shape[0], 1, X.shape[1]))
            

            #  Predict 
            model_load = load_model('model.h5')
            predict = model_load.predict(X) 
            
            # Final
            X = X.reshape((X.shape[0], X.shape[2]))
            ainv_predict = np.concatenate((predict, X[:, 1:]), axis=1)
            inv_predict = scaler.inverse_transform(ainv_predict)
            inv_predict = inv_predict[:,0]
            print(inv_predict)
            
        except Exception:
            logging.exception('Failed to training data:')
            
    def main(self):    
        self.xgboostModel()    
        # self.LSTMModel()    
        
if __name__ == "__main__":
    t = Model()
    t.main()