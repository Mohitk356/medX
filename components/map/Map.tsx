"use client"
import React, { useEffect } from 'react';

function GoogleMap() {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 25.0720338, lng: 55.1314865 },
        zoom: 15,
      });


      const markerPosition = { lat: 25.0720338, lng: 55.1314865 };

      const marker = new window.google.maps.Marker({
        position: markerPosition,
        map: map,
        title: 'MedX Pharmacy LLC, Marina ',
      });
    };
    document.head.appendChild(script);
  }, []);

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
}

export default GoogleMap;
