import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from "@react-three/drei";
import ModelLoader from './utils/ModelLoader.tsx';
import World from "./world/World.tsx";

const App: React.FC = () => {
  return (
    <Canvas style={{ width: '100%', height: '100vh' }} onPointerDown={(e) => e.target.requestPointerLock()}>
      <Suspense fallback={null}>

        <World/>

      </Suspense>
    </Canvas>
  );
};

export default App;
