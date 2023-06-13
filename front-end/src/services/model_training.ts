import axiosClient from "./axiosClient";

const modelTrainingApi = {
  async getXGBoostModel(value: number[][]): Promise<number[]> {
    const url = "/xgboost-model";
    const response = await axiosClient.post(url, { data: value });
    return response.data;
  },
  async getLSTMModel(): Promise<any> {
    const url = "/lstm-model";
    return await axiosClient.get(url);
  },
};

export default modelTrainingApi;
