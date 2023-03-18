export interface ReferencePoint {
  ip: string;
  latitude: number;
  longitude: number;
  name: string;
  id: number;
  latency?: number;
}

export interface EstimatedLocation {
  latitude: number;
  longitude: number;
}
