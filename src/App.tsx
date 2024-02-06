import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from "@react-three/drei";
import Model from './Model.tsx';

const App: React.FC = () => {
  return (
    <Canvas style={{ width: '100%', height: '100vh' }}>
      <Suspense fallback={null}>
        <Model modelPath="monster.glb" />
        <Model modelPath="island.glb" />
        <OrbitControls />
        <Environment preset="sunset" background />
      </Suspense>
    </Canvas>
  );
};

export default App;
