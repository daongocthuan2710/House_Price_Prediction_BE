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
import {
  SAMPLE_VALUE,
  MARGIN_DEFAULT,
  RANGE_AREA,
  RANGE_BATHROOM,
  RANGE_BEDROOM,
  PROPERTY_NAME,
  DISTRICT_NAME,
  TYPE_NAME,
} from "./constants";

// APIs
import modelTrainingApi from "./services/model_training";

// Types
import { LooseObject } from "./types";
import { Button, Space, Switch } from "antd";
import { Link } from "react-router-dom";

export default function App() {
  const [LSTMData, setLSTMData] = useState<number[]>([]);

  // Property values
  const [areaValues, setAreaValues] = useState<LooseObject>({});
  const [bathValues, setBathValues] = useState<LooseObject>({});
  const [bedValues, setBedValues] = useState<LooseObject>({});
  const [districtValues, setDistrictValues] = useState<LooseObject>({});
  const [typeValues, setTypeValues] = useState<LooseObject>({});

  //Handle Loading
  const [isLoadingInput, setIsLoadingInput] = useState<boolean>(false);
  const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);

  // Handle Darkmode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  console.log("typeValues: ", typeValues);

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

  type dataTraining = {
    district: string[];
    type: string[];
    area: number[];
    bathroom: number[];
    bedroom: number[];
  };

  const getPropertyDataInputChart = (
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

  const getPropertyDataUploadChart = (
    key: string,
    propertyRange: any[],
    dataTraining: number[][],
    prices: number[]
  ) => {
    // This variable is used to save prices that match the property key index
    const priceMatchPropertyValues: LooseObject = {};

    // Get the data including the minimum and maximum prices
    const minMaxData: LooseObject = {};

    if (
      [
        PROPERTY_NAME.area,
        PROPERTY_NAME.bathroom,
        PROPERTY_NAME.bedroom,
      ].includes(key)
    ) {
      // Get index of property [area, bathroom, bedroom] key in SAMPLE_VALUE
      const keyList = Object.keys(SAMPLE_VALUE);
      const propertyIndex = keyList.indexOf(key);

      for (let i = 0; i < propertyRange.length; i++) {
        const propertyValue = propertyRange[i];
        priceMatchPropertyValues[propertyValue] = [];

        for (let j = 0; j < dataTraining.length; j++) {
          if (dataTraining[j][propertyIndex] === propertyValue) {
            priceMatchPropertyValues[propertyValue].push(prices[j]);
          }
        }
        minMaxData[propertyValue] = [
          Math.min(...priceMatchPropertyValues[propertyValue]),
          Math.max(...priceMatchPropertyValues[propertyValue]),
        ];
      }
      return minMaxData;
    } else {
      for (let i = 0; i < propertyRange.length; i++) {
        // Get the value map key with SAMPLE_VALUE
        const propertyValue: string = propertyRange[i];
        // Get index of property [district, type] key in SAMPLE_VALUE
        const keyList = Object.keys(SAMPLE_VALUE);
        const propertyIndex = keyList.indexOf(propertyValue);
        console.log("propertyIndex: ", propertyIndex);

        // the index of the property will be 1 if the property is selected
        const checkedExistProperty: number = 1;

        priceMatchPropertyValues[propertyValue] = [];
        for (let j = 0; j < dataTraining.length; j++) {
          if (dataTraining[j][propertyIndex] === checkedExistProperty) {
            priceMatchPropertyValues[propertyValue].push(prices[j]);
          }
        }
        minMaxData[
          key === PROPERTY_NAME.district
            ? DISTRICT_NAME[`${propertyValue}`]
            : TYPE_NAME[`${propertyValue}`]
        ] = [
          Math.min(...priceMatchPropertyValues[propertyValue]),
          Math.max(...priceMatchPropertyValues[propertyValue]),
        ];
      }
      console.log("minMaxData: ", minMaxData);
      return minMaxData;
    }
  };

  const getSampleTrainingInputValues = (values: any) => {
    const result: number[][] = [];

    const district: string =
      "district_" +
      removeAccents(values.district.toLowerCase()).split(" ").join("-");

    const type: string = "type_" + values.type;

    const areas: number[] = [];
    for (let i = values.area[0]; i <= values.area[1]; i = i + RANGE_AREA.step) {
      areas.push(i);
    }

    const bathrooms: number[] = [];
    for (
      let i = values.bathroom[0];
      i <= values.bathroom[1];
      i += RANGE_BATHROOM.step
    ) {
      bathrooms.push(i);
    }

    const bedrooms: number[] = [];
    for (
      let i = values.bedroom[0];
      i <= values.bedroom[1];
      i += RANGE_BEDROOM.step
    ) {
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

  const getSampleTrainingUpdloadValues = (values: dataTraining) => {
    const result: number[][] = [];
    // District
    const districts: string[] = values.district;

    for (let i = 0; i < districts.length; i++) {
      districts[i] =
        "district_" +
        removeAccents(districts[i].toLowerCase()).split(" ").join("-");
    }

    // Type
    const types: string[] = values.type;

    for (let i = 0; i < districts.length; i++) {
      types[i] =
        "type_" + removeAccents(types[i].toLowerCase()).split(" ").join("-");
    }

    // Area
    const areas: number[] = [];
    for (let i = 0; i <= values.area.length; i++) {
      areas.push(values.area[i]);
    }

    // Bathroom
    const bathrooms: number[] = [];
    for (let i = 0; i <= values.bathroom.length; i++) {
      bathrooms.push(values.bathroom[i]);
    }

    // Bedroom
    const bedrooms: number[] = [];
    for (let i = 0; i <= values.bedroom.length; i++) {
      bedrooms.push(values.bedroom[i]);
    }

    // Convert values input to arrays of training data
    areas.forEach((area) => {
      bathrooms.forEach((bathroom) => {
        bedrooms.forEach((bedroom) => {
          districts.forEach((district) => {
            types.forEach((type) => {
              // Set value to key of SAMPLE_VALUE
              let item: Record<string, number> = SAMPLE_VALUE;
              item["area"] = area || 0;
              item["bathroom"] = bathroom || 0;
              item["bedroom"] = bedroom || 0;
              item[`${district}`] = 1;
              item[`${type}`] = 1;

              // Get data from values of above object
              result.push(Object.values(item));
            });
          });
        });
      });
    });
    return result;
  };

  const onSubmitInputForm = async (values: any) => {
    try {
      setIsLoadingInput(true);
      const dataTraining: number[][] = getSampleTrainingInputValues(values);
      const response = await modelTrainingApi.getXGBoostModel(dataTraining);

      const areaValues = getPropertyDataInputChart(
        PROPERTY_NAME.area,
        values.area,
        dataTraining,
        response,
        RANGE_AREA.step
      );
      const bathValues = getPropertyDataInputChart(
        PROPERTY_NAME.bathroom,
        values.bathroom,
        dataTraining,
        response,
        RANGE_BEDROOM.step
      );

      const bedValues = getPropertyDataInputChart(
        PROPERTY_NAME.bedroom,
        values.bedroom,
        dataTraining,
        response,
        RANGE_BEDROOM.step
      );
      setAreaValues(areaValues);
      setBathValues(bathValues);
      setBedValues(bedValues);
      setIsLoadingInput(false);
    } catch (error) {
      setIsLoadingInput(false);
      console.log("Faild to predict: ", error);
    }
  };

  const onSetValuesUpload = async (
    districts: string[],
    types: string[],
    areas: number[],
    baths: number[],
    beds: number[]
  ) => {
    try {
      setIsLoadingUpload(true);
      const data: dataTraining = {
        district: districts,
        type: types,
        area: areas,
        bathroom: baths,
        bedroom: beds,
      };
      const dataTraining = getSampleTrainingUpdloadValues(data);

      const response = await modelTrainingApi.getXGBoostModel(dataTraining);

      const areaValues = getPropertyDataUploadChart(
        PROPERTY_NAME.area,
        areas,
        dataTraining,
        response
      );
      const bathValues = getPropertyDataUploadChart(
        PROPERTY_NAME.bathroom,
        baths,
        dataTraining,
        response
      );

      const bedValues = getPropertyDataUploadChart(
        PROPERTY_NAME.bedroom,
        beds,
        dataTraining,
        response
      );

      const districtValues = getPropertyDataUploadChart(
        PROPERTY_NAME.district,
        districts,
        dataTraining,
        response
      );

      const typeValues = getPropertyDataUploadChart(
        PROPERTY_NAME.type,
        types,
        dataTraining,
        response
      );

      setAreaValues(areaValues);
      setBathValues(bathValues);
      setBedValues(bedValues);
      setDistrictValues(districtValues);
      setTypeValues(typeValues);

      setIsLoadingUpload(false);
    } catch (err) {
      setIsLoadingUpload(false);
      console.log("Failt to predict: ", err);
    }
  };

  useEffect(() => {
    getLSTMModel();
  }, []);

  return (
    <>
      <CustomContainer $isDarkMode={isDarkMode}>
        <CustomTitle>HOUSE PRICE PREDICTION</CustomTitle>
        <Space wrap style={{ marginBottom: `${MARGIN_DEFAULT}` }}>
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
                  isLoading={isLoadingInput}
                  isDarkMode={isDarkMode}
                  setIsLoading={setIsLoadingInput}
                />
              }
            ></Route>
            <Route
              path="/upload-form"
              element={
                <UploadForm
                  onSetValuesUpload={onSetValuesUpload}
                  isLoading={isLoadingUpload}
                />
              }
            ></Route>
            <Route
              path="/"
              element={
                <InputForm
                  onSubmitInputForm={onSubmitInputForm}
                  isLoading={isLoadingInput}
                  isDarkMode={isDarkMode}
                  setIsLoading={setIsLoadingInput}
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
          {Object.keys(districtValues).length > 0 ? (
            <XGBoostChart
              theme={isDarkMode ? "dark" : "light"}
              option={optionXGBoostChart(
                districtValues,
                "Biểu đồ giao động giá nhà theo quận",
                "Quận"
              )}
            />
          ) : (
            ""
          )}
          {Object.keys(typeValues).length > 0 ? (
            <XGBoostChart
              theme={isDarkMode ? "dark" : "light"}
              option={optionXGBoostChart(
                typeValues,
                "Biểu đồ giao động giá nhà theo loại bất động sản",
                "Quận"
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
