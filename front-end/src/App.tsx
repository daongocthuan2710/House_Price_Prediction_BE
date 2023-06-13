// Libs
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

// Components
import InputForm from "./components/InputForm";
import UploadForm from "./components/FileUploadForm";
import LSTMCharts from "./components/LSTMChart";
import XGBoostChart from "./components/XGBoostChart";

// Constants
import { optionLSTM, optionXGBoostChart } from "./constants/chartOption";
import {
  CustomChartWrapper,
  CustomContainer,
  CustomDarkModeWrapper,
  CustomFormWrapper,
  CustomTitle,
} from "./styled";
import { SAMPLE_VALUE, marginDefault, rangeArea, rangeRoom } from "./constants";

// APIs
import modelTrainingApi from "./services/model_training";

// Types
import { LooseObject } from "./types";
import { Button, Space, Switch } from "antd";
import { Link } from "react-router-dom";

export default function App() {
  const [LSTMData, setLSTMData] = useState<number[]>([]);
  const [areaValues, setAreaValues] = useState<LooseObject>({});
  const [bathValues, setBathValues] = useState<LooseObject>({});
  const [bedValues, setBedValues] = useState<LooseObject>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const getLSTMModel = async () => {
    const response = await modelTrainingApi.getLSTMModel();
    if (response.data) {
      setLSTMData(response.data);
    }
  };

  function removeAccents(str: string) {
    var AccentsMap = [
      "aàảãáạăằẳẵắặâầẩẫấậ",
      "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
      "dđ",
      "DĐ",
      "eèẻẽéẹêềểễếệ",
      "EÈẺẼÉẸÊỀỂỄẾỆ",
      "iìỉĩíị",
      "IÌỈĨÍỊ",
      "oòỏõóọôồổỗốộơờởỡớợ",
      "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
      "uùủũúụưừửữứự",
      "UÙỦŨÚỤƯỪỬỮỨỰ",
      "yỳỷỹýỵ",
      "YỲỶỸÝỴ",
    ];
    for (var i = 0; i < AccentsMap.length; i++) {
      var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
      var char = AccentsMap[i][0];
      str = str.replace(re, char);
    }
    return str;
  }

  const getPropertyDataChart = (
    key: string,
    propertyRange: number[],
    dataTraining: number[][],
    prices: number[],
    step: number
  ) => {
    const priceMatchPropertyValues: LooseObject = {};

    // Get the data including the minimum and maximum prices
    const minMaxData: LooseObject = {};

    // Get index of property key in SAMPLE_VALUE
    const keyList = Object.keys(SAMPLE_VALUE);
    const propertyIndex = keyList.indexOf(key);
    for (let i = propertyRange[0]; i <= propertyRange[1]; i += step) {
      priceMatchPropertyValues[i] = [];
      for (let j = 0; j < dataTraining.length; j++) {
        if (dataTraining[j][propertyIndex] === i) {
          priceMatchPropertyValues[i].push(prices[j]);
        }
      }
      minMaxData[i] = [
        Math.min(...priceMatchPropertyValues[i]),
        Math.max(...priceMatchPropertyValues[i]),
      ];
    }

    return minMaxData;
  };

  const getSampleTrainingValues = (values: any) => {
    const result: number[][] = [];

    const district: string =
      "district_" +
      removeAccents(values.district.toLowerCase()).split(" ").join("-");
    const type: string = "type_" + values.type;

    const areas: number[] = [];
    for (let i = values.area[0]; i <= values.area[1]; i = i + 5) {
      areas.push(i);
    }

    const bathrooms: number[] = [];
    for (let i = values.bathroom[0]; i <= values.bathroom[1]; i++) {
      bathrooms.push(i);
    }

    const bedrooms: number[] = [];
    for (let i = values.bedroom[0]; i <= values.bedroom[1]; i++) {
      bedrooms.push(i);
    }

    // Convert values input to arrays of training data
    areas.forEach((area) => {
      bathrooms.forEach((bathroom) => {
        bedrooms.forEach((bedroom) => {
          // Set value to key of SAMPLE_VALUE
          let item: Record<string, number> = SAMPLE_VALUE;
          item["area"] = area;
          item["bathroom"] = bathroom;
          item["bedroom"] = bedroom;
          item[`${district}`] = 1;
          item[`${type}`] = 1;

          // Get data from values of above object
          result.push(Object.values(item));
        });
      });
    });
    return result;
  };

  const onSubmitInputForm = async (values: any) => {
    setIsLoading(true);
    const dataTraining: number[][] = getSampleTrainingValues(values);
    const response = await modelTrainingApi.getXGBoostModel(dataTraining);

    const areaValues = getPropertyDataChart(
      "area",
      values.area,
      dataTraining,
      response,
      rangeArea.step
    );
    const bathValues = getPropertyDataChart(
      "bathroom",
      values.bathroom,
      dataTraining,
      response,
      rangeRoom.step
    );

    const bedValues = getPropertyDataChart(
      "bedroom",
      values.bedroom,
      dataTraining,
      response,
      rangeRoom.step
    );
    setAreaValues(areaValues);
    setBathValues(bathValues);
    setBedValues(bedValues);
    setIsLoading(false);
  };

  useEffect(() => {
    getLSTMModel();
  }, []);

  return (
    <>
      <CustomContainer $isDarkMode={isDarkMode}>
        <CustomTitle>HOUSE PRICE PREDICTION</CustomTitle>
        <Space wrap style={{ marginBottom: `${marginDefault}` }}>
          <Button type="dashed">
            <Link to="/input-form">Input Form</Link>
          </Button>
          <Button type="dashed">
            <Link to="/upload-form">Upload Form</Link>
          </Button>
        </Space>
        <CustomFormWrapper>
          <Routes>
            <Route
              path="/input-form"
              element={
                <InputForm
                  onSubmitInputForm={onSubmitInputForm}
                  isLoading={isLoading}
                  isDarkMode={isDarkMode}
                  setIsLoading={setIsLoading}
                />
              }
            ></Route>
            <Route path="/upload-form" element={<UploadForm />}></Route>
            <Route
              path="/"
              element={
                <InputForm
                  onSubmitInputForm={onSubmitInputForm}
                  isLoading={isLoading}
                  isDarkMode={isDarkMode}
                  setIsLoading={setIsLoading}
                />
              }
            ></Route>
          </Routes>
          <CustomDarkModeWrapper $isDarkMode={isDarkMode}>
            <span>Dark Mode: </span>
            <Switch onChange={(value) => setIsDarkMode(value)} />
          </CustomDarkModeWrapper>
        </CustomFormWrapper>
        <CustomChartWrapper>
          {Object.keys(areaValues).length > 0 ? (
            <XGBoostChart
              theme={isDarkMode ? "dark" : "light"}
              option={optionXGBoostChart(
                areaValues,
                "Biểu đồ giao động giá nhà theo diện tích",
                "Diện tích (m2)"
              )}
            />
          ) : (
            ""
          )}
          {Object.keys(bathValues).length > 0 ? (
            <XGBoostChart
              theme={isDarkMode ? "dark" : "light"}
              option={optionXGBoostChart(
                bathValues,
                "Biểu đồ giao động giá nhà theo số phòng tắm",
                "Số phòng tắm"
              )}
            />
          ) : (
            ""
          )}
          {Object.keys(bedValues).length > 0 ? (
            <XGBoostChart
              theme={isDarkMode ? "dark" : "light"}
              option={optionXGBoostChart(
                bedValues,
                "Biểu đồ giao động giá nhà theo số phòng ngủ",
                "Số phòng ngủ"
              )}
            />
          ) : (
            ""
          )}
          {LSTMData.length > 0 ? (
            <LSTMCharts
              theme={isDarkMode ? "dark" : "light"}
              option={optionLSTM(LSTMData)}
            />
          ) : (
            ""
          )}
        </CustomChartWrapper>
      </CustomContainer>
    </>
  );
}
