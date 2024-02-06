import React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Model: React.FC<{ modelPath: string, x?: Int16Array, y?: Int16Array, z?: Int16Array}> = ({ modelPath, x = 0, y = 0, z = 0 }) => {
  const gltf = useLoader(GLTFLoader, modelPath);
  return <primitive object={gltf.scene} position={[x, y, z]}  />;
};

export default Model;
