import ModelLoader from "../../utils/ModelLoader.tsx";
import React, { useEffect, useRef } from "react";
import {usePlane} from "@react-three/cannon";

const Map = () => {
    const [ref] = usePlane(() => ({
        position: [0, -10, 0],
        collisionFilterGroup: 1,
        rotation: [0, 0, 0]
    }));
    const MapRef = useRef();

    return (
        <>
            <ModelLoader modelPath="island.glb" ref={ref} meshRef={MapRef} physicsProps={{ ref }} />
        </>
    );
}

export default Map;