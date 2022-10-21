import React, { useEffect, useState } from 'react';

interface CoordsState {
  latitude?: number;
  longitude?: number;
}

export default function useCoords() {
  const [coords, setCoords] = useState<CoordsState>({
    latitude: undefined,
    longitude: undefined,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  }, []);

  return coords;
}
