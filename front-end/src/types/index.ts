export type TREAL_RESTATE = {
  key: string;
  name: string;
};

export type TDistrict = {
  district_id: string;
  district_name: string;
  district_type: string;
  lat: string | null;
  lng: string | null;
};

export interface LooseObject {
  [key: string]: any;
}
