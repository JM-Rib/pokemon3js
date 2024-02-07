import React, {MutableRefObject, useEffect, useRef} from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ModelLoader: React.FC<{ modelPath: string, x?: Int16Array, y?: Int16Array, z?: Int16Array, physicsProps?: any }> = ({ modelPath, x = 0, y = 0, z = 0, physicsProps }) => {
  const gltf = useLoader(GLTFLoader, modelPath);

  return <primitive object={gltf.scene} position={[x, y, z]} {...physicsProps} />;
};

export default ModelLoader;
