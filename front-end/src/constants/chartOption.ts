// Libs
import { EChartsOption } from "echarts";

// Constants
import { dateList } from "./date";
import { priceFormat } from "../utils";
import { LooseObject } from "../types";

const price_formatter = (price: number | string) => {
  return `${priceFormat(Number(price), "vnđ")}`;
};

export const optionXGBoostChart = (
  values: LooseObject,
  tilte: string,
  propertyName: string
): EChartsOption => {
  const xAxis_data = Object.keys(values);
  const yAxis_data = Object.values(values);

  const min_price_data = [];
  const max_price_data = [];

  for (let i = 0; i < yAxis_data.length; i++) {
    min_price_data.push(yAxis_data[i][0]);
    max_price_data.push(yAxis_data[i][1] - yAxis_data[i][0]);
  }

  const option: EChartsOption = {
    title: {
      text: tilte,
      subtext: "Living Expenses in Shenzhen",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any) {
        const tar1 = params[0];
        const tar2 = params[1];

        return `${propertyName}: ${tar1.name} </br>
           ${tar2.seriesName}: ${price_formatter(
          tar1.value < tar2.value ? tar1.value : tar2.value
        )} -> ${price_formatter(
          tar1.value > tar2.value ? tar1.value : tar2.value
        )}
          `;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      splitLine: { show: false },
      data: xAxis_data,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value: any) => price_formatter(value),
      },
    },
    series: [
      {
        name: "Placeholder",
        type: "bar",
        stack: "Total",
        itemStyle: {
          borderColor: "transparent",
          color: "transparent",
        },
        emphasis: {
          itemStyle: {
            borderColor: "transparent",
            color: "transparent",
          },
        },
        data: min_price_data,
      },
      {
        name: "Giá thuê",
        type: "bar",
        stack: "Total",
        label: {
          show: false,
          position: "inside",
        },
        data: max_price_data,
      },
    ],
  };

  return option;
};

export const optionLSTM = (priceList: number[]): EChartsOption => {
  const priceCutDown = 22600000;
  const priceCuttedDown: number[] = [];
  const priceFormatted: string[] = [];
  for (let i = 0; i < priceList.length; i++) {
    priceCuttedDown.push(priceList[i] - priceCutDown);
    priceFormatted.push(price_formatter(priceList[i]));
  }

  const option: EChartsOption = {
    color: ["#80FFA5", "#00DDFF", "#37A2FF", "#FF0087", "#FFBF00"],
    animationDuration: 7000,
    title: {
      text: "Biểu đồ biến động giá theo thời gian",
      subtext: "2023",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      formatter: function (params: any) {
        var tar = params[0];
        return `Ngày: ${tar.name} </br>
           ${tar.seriesName}: ${price_formatter(tar.value + priceCutDown)}
          `;
      },
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: dateList,
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value: any) => price_formatter(value + priceCutDown),
      },
      axisPointer: {
        snap: true,
      },
    },
    visualMap: {
      show: false,
      dimension: 0,
      pieces: [
        {
          gt: 0,
          lte: 131,
          color: "green",
        },
        {
          gt: 131,
          color: "red",
        },
      ],
    },
    series: [
      {
        name: "Giá thuê",
        type: "line",
        smooth: true,
        data: priceCuttedDown,
        markArea: {
          itemStyle: {
            color: "rgba(255, 173, 177, 0.4)",
          },
          data: [
            [
              {
                name: "Tăng mạnh",
                xAxis: "4/1/2023",
              },
              {
                xAxis: "8/1/2023",
              },
            ],
            [
              {
                name: "Giảm mạnh",
                xAxis: "6/4/2023",
              },
              {
                xAxis: "11/4/2023",
              },
            ],
          ],
        },
      },
    ],
  };
  return option;
};
