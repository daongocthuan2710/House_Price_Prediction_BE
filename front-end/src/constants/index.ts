import { TREAL_RESTATE } from "../types";

export const marginDefault = "30px";

// Area Range Default
export const rangeArea = {
  min: 20,
  max: 1000,
  step: 5,
};

// Bathroom and Bedroom Range Default
export const rangeRoom = {
  min: 1,
  max: 10,
  step: 1,
};

// The values of Real Estates' type
export const REAL_ESTATES: TREAL_RESTATE[] = [
  {
    key: "thue-can-ho-chung-cu",
    name: "Thuê căn hộ chung cư",
  },
  {
    key: "thue-can-ho-dich-vu",
    name: "Thuê căn hộ dịch vụ",
  },
  {
    key: "thue-can-ho-officetel",
    name: "Thuê căn hộ officetel",
  },
  {
    key: "thue-can-ho-penthouse",
    name: "Thuê căn hộ penthouse",
  },
  {
    key: "thue-can-ho-tap-the-cu-xa",
    name: "Thuê căn hộ tập thể, cư xá",
  },
  {
    key: "thue-cua-hang-shop-shophouse",
    name: "Thuê căn hộ cửa hàng, shop, shophouse",
  },
  {
    key: "thue-dat-trong",
    name: "Thuê đất trống",
  },
  {
    key: "thue-duong-noi-bo",
    name: "Thuê đường nội bộ",
  },
  {
    key: "thue-mat-bang-cua-hang-shop-cafe-do-uong",
    name: "Thuê mặt bằng cửa hàng, shop, cà phê, đồ uống",
  },
  {
    key: "thue-mat-bang-cua-hang-shop-nhieu-muc-dich",
    name: "Thuê mặt bằng cửa hàng, shop nhiều mục đích",
  },
  {
    key: "thue-mat-bang-cua-hang-shop-quan-an-nha-hang",
    name: "Thuê mặt bằng cửa hàng, shop, quán ăn, nhà hàng",
  },
  {
    key: "thue-mat-bang-cua-hang-shop-thoi-trang-my-pham-thuoc",
    name: "Thuê mặt bằng cửa hàng, shop thời trang, mỹ phẩm, thuốc",
  },
  {
    key: "thue-nha-biet-thu-lien-ke",
    name: "Thuê nhà, biệt thự liền kề",
  },
  {
    key: "thue-nha-hem-ngo",
    name: "Thuê nhà hẻm ngõ",
  },
  {
    key: "thue-nha-kho",
    name: "Thuê nhà kho",
  },
  {
    key: "thue-nha-mat-tien-pho",
    name: "Thuê nhà mặt tiền phố",
  },
  {
    key: "thue-nha-xuong",
    name: "Thuê nhà xưởng",
  },
  {
    key: "thue-phong-tro-khu-nha-tro",
    name: "Thuê phòng trọ khu nhà trọ",
  },
  {
    key: "thue-phong-tro-loi-di-rieng",
    name: "Thuê phòng trọ lối đi riêng",
  },
  {
    key: "thue-van-phong-nha-rieng-can-ho",
    name: "Thuê văn phòng, nhà riêng, căn hộ",
  },
  {
    key: "thue-van-phong-toa-nha-cao-oc",
    name: "Thuê văn phòng, tòa nhà, cao ốc",
  },
  {
    key: "thue-van-phong-tt-thuong-mai",
    name: "Thuê văn phòng, trung tâm thương mại",
  },
];

// The values' order of the array that will be tranning to predict the price
export const SAMPLE_VALUE: Record<string, number> = {
  area: 0,
  bedroom: 0,
  bathroom: 0,
  "district_huyen-binh-chanh": 0,
  "district_huyen-cu-chi": 0,
  "district_huyen-hoc-mon": 0,
  "district_huyen-nha-be": 0,
  "district_quan-1": 0,
  "district_quan-10": 0,
  "district_quan-11": 0,
  "district_quan-12": 0,
  "district_quan-2": 0,
  "district_quan-3": 0,
  "district_quan-4": 0,
  "district_quan-5": 0,
  "district_quan-6": 0,
  "district_quan-7": 0,
  "district_quan-8": 0,
  "district_quan-9": 0,
  "district_quan-binh-tan": 0,
  "district_quan-binh-thanh": 0,
  "district_quan-go-vap": 0,
  "district_quan-phu-nhuan": 0,
  "district_quan-tan-binh": 0,
  "district_quan-tan-phu": 0,
  "district_quan-thu-duc": 0,
  "type_thue-can-ho-chung-cu": 0,
  "type_thue-can-ho-dich-vu": 0,
  "type_thue-can-ho-officetel": 0,
  "type_thue-can-ho-penthouse": 0,
  "type_thue-can-ho-tap-the-cu-xa": 0,
  "type_thue-cua-hang-shop-shophouse": 0,
  "type_thue-duong-noi-bo": 0,
  "type_thue-mat-bang-cua-hang-shop-cafe-do-uong": 0,
  "type_thue-mat-bang-cua-hang-shop-nhieu-muc-dich": 0,
  "type_thue-mat-bang-cua-hang-shop-quan-an-nha-hang": 0,
  "type_thue-nha-biet-thu-lien-ke": 0,
  "type_thue-nha-hem-ngo": 0,
  "type_thue-nha-mat-tien-pho": 0,
  "type_thue-phong-tro-khu-nha-tro": 0,
  "type_thue-phong-tro-loi-di-rieng": 0,
};
