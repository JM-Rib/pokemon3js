import ModelLoader from "../../utils/ModelLoader.tsx";
import React, { useEffect, useRef } from "react";
import {usePlane} from "@react-three/cannon";
import {Plane, RandomizedLight, SpotLight} from "@react-three/drei";
import {DoubleSide} from "three";
import {useFrame} from "@react-three/fiber";

const Map = () => {
    const [ref] = usePlane(() => ({
        position: [0, -4, 0],
        collisionFilterGroup: 1,
        rotation: [-Math.PI/2, 0, 0],
        shape: undefined
    }));

    useFrame(() => {
        ref.current.rotation.x += 0.01;
    });


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