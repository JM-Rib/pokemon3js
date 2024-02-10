import ModelLoader from "../../utils/ModelLoader.tsx";
import React, { useEffect, useRef, useMemo } from "react";
import {usePlane, useTrimesh} from "@react-three/cannon";
import {Plane} from "@react-three/drei";
import {TorusGeometry} from "three";

const Map = () => {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], material: 'ground' }), useRef());
    const geometry = useMemo(() => new TorusGeometry(0.75, 0,1), [[0.75, 0,1]]);
    const [isleRef] = useTrimesh(() => ({
      args: [geometry.attributes.position.array, geometry.index?.array],
      material: 'ring',
      position: [0, 1, 0],
    }));


    return (
        <>
            <ModelLoader modelPath="island.glb" ref={isleRef}  physicsProps={{ isleRef }} />
        </>
    );
}

export default Map;
