import ModelLoader from "../../utils/ModelLoader.tsx";
import React from "react";
import {usePlane} from "@react-three/cannon";

const Map = () => {
    const [ref] = usePlane(() => ({
        position: [0, 0, 0],
        rotation: [-Math.PI / 2, 0, 0]
    }));

    return (
        <>
            <ModelLoader modelPath="island.glb" ref={ref}/>
        </>
    );
}

export default Map;