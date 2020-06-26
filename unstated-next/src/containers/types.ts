export enum LoadStatus {
  None,
  Loading,
  Loaded
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export type ThingType = "thing1" | "thing2" | "thing3";
