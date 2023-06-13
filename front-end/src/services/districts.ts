import { TDistrict } from "../types";
import axiosClient from "./axiosClient";

const codeHCM = 79;
const baseUrl = "https://vapi.vnappmob.com/api/province";
const districtApi = {
  async getAll(): Promise<TDistrict[]> {
    const url = `${baseUrl}/district/${codeHCM}`;
    return await axiosClient.get(url);
  },
};

export default districtApi;
