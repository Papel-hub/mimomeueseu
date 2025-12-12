'use client';
import '@google/model-viewer';
import React from 'react';

const ModelViewerWrapper = () => {
  return React.createElement('model-viewer', {
    src: '/models/mimo.glb',
    alt: 'Visualização 3D do produto',
    ar: true,
    'ar-modes': 'webxr scene-viewer quick-look',
    'camera-controls': true,
    'auto-rotate': true,
    exposure: '0.8',
    'shadow-intensity': '1',
    style: { width: '100%', height: '100%', background: '#fff' },
  });
};

export default ModelViewerWrapper;