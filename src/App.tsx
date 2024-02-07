import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import World from "./world/World.tsx";

const App: React.FC = () => {
  return (
    <Canvas style={{ width: '100%', height: '100vh' }}>
      <Suspense fallback={null}>
        <World/>
      </Suspense>
    </Canvas>
  );
};

export default App;
