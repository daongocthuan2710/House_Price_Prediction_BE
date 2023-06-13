import { TREAL_RESTATE } from "../types";

export const MARGIN_DEFAULT = "30px";

// Properties name
export const PROPERTY_NAME = {
  district: "district",
  area: "area",
  type: "type",
  bathroom: "bathroom",
  bedroom: "bedroom",
};

// Area Range Default
export const RANGE_AREA = {
  min: 20,
  max: 200,
  step: 5,
};

// Bathroom and Bedroom Range Default
export const RANGE_BEDROOM = {
  min: 1,
  max: 6,
  step: 1,
};

export const RANGE_BATHROOM = {
  min: 1,
  max: 4,
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
    key: "thue-nha-biet-thu-lien-ke",
    name: "Thuê nhà, biệt thự liền kề",
  },
  {
    key: "thue-nha-hem-ngo",
    name: "Thuê nhà hẻm ngõ",
  },
  {
    key: "thue-nha-mat-tien-pho",
    name: "Thuê nhà mặt tiền phố",
  },
  {
    key: "thue-phong-tro-khu-nha-tro",
    name: "Thuê phòng trọ khu nhà trọ",
  },
  {
    key: "thue-phong-tro-loi-di-rieng",
    name: "Thuê phòng trọ lối đi riêng",
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

export const DISTRICT_NAME: Record<string, string> = {
  "district_huyen-binh-chanh": "Huyện Bình Chánh",
  "district_huyen-cu-chi": "Huyện Củ Chi",
  "district_huyen-hoc-mon": "Huyện Hoc Mon",
  "district_huyen-nha-be": "Huyện Nhà Bè",
  "district_quan-1": "Quận 1",
  "district_quan-10": "Quận 10",
  "district_quan-11": "Quận 11",
  "district_quan-12": "Quận 12",
  "district_quan-2": "Quận 2",
  "district_quan-3": "Quận 3",
  "district_quan-4": "Quận 4",
  "district_quan-5": "Quận 5",
  "district_quan-6": "Quận 6",
  "district_quan-7": "Quận 7",
  "district_quan-8": "Quận 8",
  "district_quan-9": "Quận 9",
  "district_quan-binh-tan": "Quận Bình Tân",
  "district_quan-binh-thanh": "Quận Bình Thạnh",
  "district_quan-go-vap": "Quận Gò Vấp",
  "district_quan-phu-nhuan": "Quận Phú Nhuận",
  "district_quan-tan-binh": "Quận Tân Bình",
  "district_quan-tan-phu": "Quận Tân Phú",
  "district_quan-thu-duc": "Quận Thủ Đức",
};

export const TYPE_NAME: Record<string, string> = {
  "type_thue-can-ho-chung-cu": "Thuê căn hộ chung cư",

  "type_thue-can-ho-dich-vu": "Thuê căn hộ dịch vụ",

  "type_thue-can-ho-officetel": "Thuê căn hộ officetel",

  "type_thue-can-ho-penthouse": "Thuê căn hộ penthouse",

  "type_thue-can-ho-tap-the-cu-xa": "Thuê căn hộ tập thể, cư xá",

  "type_thue-cua-hang-shop-shophouse": "Thuê căn hộ cửa hàng, shop, shophouse",

  "type_thue-duong-noi-bo": "Thuê đường nội bộ",

  "type_thue-mat-bang-cua-hang-shop-cafe-do-uong":
    "Thuê mặt bằng cửa hàng, shop, cà phê, đồ uống",

  "type_thue-mat-bang-cua-hang-shop-nhieu-muc-dich":
    "Thuê mặt bằng cửa hàng, shop nhiều mục đích",

  "type_thue-mat-bang-cua-hang-shop-quan-an-nha-hang":
    "Thuê mặt bằng cửa hàng, shop, quán ăn, nhà hàng",

  "type_thue-nha-biet-thu-lien-ke": "Thuê nhà, biệt thự liền kề",

  "type_thue-nha-hem-ngo": "Thuê nhà hẻm ngõ",

  "type_thue-nha-mat-tien-pho": "Thuê nhà mặt tiền phố",

  "type_thue-phong-tro-khu-nha-tro": "Thuê phòng trọ khu nhà trọ",

  "type_thue-phong-tro-loi-di-rieng": "Thuê phòng trọ lối đi riêng",
};
