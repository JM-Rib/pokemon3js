import ModelLoader from "../../utils/ModelLoader.tsx";
import React, { useEffect, useRef } from "react";
import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";

const Character = () => {
    const [ref] = useBox(() => ({ 
        mass: 1, 
        collisionFilterGroup: 1, 
        position: [0, 0, 0], //Permet que le perso tombe droit
        rotation: [0, 0, 0], 
    }));

    useFrame(() => {
    });


    return (
        <>
            <ModelLoader modelPath="characters.glb" ref={ref} physicsProps={{ ref }} />
            {/* Utilisez meshRef.current ici */}
        </>
    );
}

export default Character;
