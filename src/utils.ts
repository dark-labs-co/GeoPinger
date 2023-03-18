import { ReferencePoint, EstimatedLocation } from "./types";

export function distance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function multilaterationTriangulation(
  referencePoints: ReferencePoint[]
): EstimatedLocation {
  const speedOfLight = 299792.458; // Speed of light in km/ms
  const latSum = referencePoints.reduce(
    (sum, point) => sum + point.latitude,
    0
  );
  const lonSum = referencePoints.reduce(
    (sum, point) => sum + point.longitude,
    0
  );

  let estimatedLat = latSum / referencePoints.length;
  let estimatedLon = lonSum / referencePoints.length;
  let prevLat: number, prevLon: number;

  do {
    prevLat = estimatedLat;
    prevLon = estimatedLon;
    let weightSum = 0;
    let latWeightedSum = 0;
    let lonWeightedSum = 0;

    for (const point of referencePoints) {
      const distanceEstimate = distance(
        point.latitude,
        point.longitude,
        estimatedLat,
        estimatedLon
      );
      const timeDifference = distanceEstimate / speedOfLight - point.latency!;
      const weight = 1 / (timeDifference * timeDifference);

      weightSum += weight;
      latWeightedSum += point.latitude * weight;
      lonWeightedSum += point.longitude * weight;
    }

    estimatedLat = latWeightedSum / weightSum;
    estimatedLon = lonWeightedSum / weightSum;
  } while (
    Math.abs(estimatedLat - prevLat) > 1e-8 ||
    Math.abs(estimatedLon - prevLon) > 1e-8
  );

  return { latitude: estimatedLat, longitude: estimatedLon };
}
