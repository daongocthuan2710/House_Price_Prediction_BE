import React, { useRef, useEffect } from "react";
// import { init, getInstanceByDom } from "echarts";
// import type { CSSProperties } from "react";
// import type { EChartsOption, ECharts, SetOptionOpts } from "echarts";
// import echarts from "echarts/types/dist/echarts";

// function run(_rawData: any) {
//     // var countries = ['Australia', 'Canada', 'China', 'Cuba', 'Finland', 'France', 'Germany', 'Iceland', 'India', 'Japan', 'North Korea', 'South Korea', 'New Zealand', 'Norway', 'Poland', 'Russia', 'Turkey', 'United Kingdom', 'United States'];
//     const countries = [
//       'Finland',
//       'France',
//       'Germany',
//       'Iceland',
//       'Norway',
//       'Poland',
//       'Russia',
//       'United Kingdom'
//     ];
//     const datasetWithFilters :any[] = [];
//     const seriesList :any[] = [];
//     echarts.util.each(countries, function (country) {
//       var datasetId = 'dataset_' + country;
//       datasetWithFilters.push({
//         id: datasetId,
//         fromDatasetId: 'dataset_raw',
//         transform: {
//           type: 'filter',
//           config: {
//             and: [
//               { dimension: 'Year', gte: 1950 },
//               { dimension: 'Country', '=': country }
//             ]
//           }
//         }
//       });
//       seriesList.push({
//         type: 'line',
//         datasetId: datasetId,
//         showSymbol: false,
//         name: country,
//         endLabel: {
//           show: true,
//           formatter: function (params: { value: string[]; }) {
//             return params.value[3] + ': ' + params.value[0];
//           }
//         },
//         labelLayout: {
//           moveOverlap: 'shiftY'
//         },
//         emphasis: {
//           focus: 'series'
//         },
//         encode: {
//           x: 'Year',
//           y: 'Income',
//           label: ['Country', 'Income'],
//           itemName: 'Year',
//           tooltip: ['Income']
//         }
//       });
//     });
//     option = {
//       animationDuration: 10000,
//       dataset: [
//         {
//           id: 'dataset_raw',
//           source: _rawData
//         },
//         ...datasetWithFilters
//       ],
//       title: {
//         text: 'Income of Germany and France since 1950'
//       },
//       tooltip: {
//         order: 'valueDesc',
//         trigger: 'axis'
//       },
//       xAxis: {
//         type: 'category',
//         nameLocation: 'middle'
//       },
//       yAxis: {
//         name: 'Income'
//       },
//       grid: {
//         right: 140
//       },
//       series: seriesList
//     };
//     myChart.setOption(option);
//   }
  
// export interface ReactEChartsProps {
//   option: EChartsOption;
//   style?: CSSProperties;
//   settings?: SetOptionOpts;
//   loading?: boolean;
//   theme?: "light" | "dark";
// }

// export default function ReactECharts({
//   option,
//   style,
//   settings,
//   loading,
//   theme,
// }: ReactEChartsProps): JSX.Element {
//   const chartRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     // Initialize chart
//     let chart: ECharts | undefined;
//     if (chartRef.current !== null) {
//       chart = init(chartRef.current, theme);
//     }

//     // Add chart resize listener
//     // ResizeObserver is leading to a bit janky UX
//     function resizeChart() {
//       chart?.resize();
//     }
//     window.addEventListener("resize", resizeChart);

//     // Return cleanup function
//     return () => {
//       chart?.dispose();
//       window.removeEventListener("resize", resizeChart);
//     };
//   }, [theme]);

//   useEffect(() => {
//     // Update chart
//     if (chartRef.current !== null) {
//       const chart = getInstanceByDom(chartRef.current);
//       if (chart) chart.setOption(option, settings);
//     }
//   }, [option, settings, theme]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

//   useEffect(() => {
//     // Update chart
//     if (chartRef.current !== null) {
//       const chart = getInstanceByDom(chartRef.current);
//       // eslint-disable-next-line @typescript-eslint/no-unused-expressions
//       if (chart) loading === true ? chart.showLoading() : chart.hideLoading();
//     }
//   }, [loading, theme]);

//   return (
//     <div ref={chartRef} style={{ width: "100%", height: "600px", ...style }} />
//   );
// }
