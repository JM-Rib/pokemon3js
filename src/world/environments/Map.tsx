import ModelLoader from "../../utils/ModelLoader.tsx";
import React, { useEffect, useRef } from "react";
import {usePlane} from "@react-three/cannon";
import {Plane} from "@react-three/drei";
import {DoubleSide} from "three";

const Map = () => {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], material: 'ground' }), useRef())


    return (
        <>
            {/*<ModelLoader modelPath="island.glb" ref={ref}  physicsProps={{ ref }} />*/}
            <Plane args={[100, 100]} ref={ref} rotation={[0, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <meshPhysicalMaterial attach="material" color="green" side={ DoubleSide} />
            </Plane>
        </>
    );
}

export default Map;
