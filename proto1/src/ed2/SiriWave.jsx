import React, { useEffect, useRef } from 'react';
import Siriwave from 'siriwave';

const SiriWave = ({ width, height, speed, amplitude, autostart, style }) => {
  const containerRef = useRef(null);
  const waveRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !waveRef.current) {
      waveRef.current = new Siriwave({
        container: containerRef.current,
        width,
        height,
        speed,
        amplitude,
        style,
        autostart,
      });
    }

    return () => {
      waveRef.current?.dispose?.();
      waveRef.current = null;
    };
  }, [width, height, speed, amplitude, style, autostart]);

  return <div ref={containerRef} />;
};

export default SiriWave;
