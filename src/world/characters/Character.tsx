import ModelLoader from "../../utils/ModelLoader.tsx";
import React, { useEffect, useRef } from "react";
import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import Controls from "./Controls.tsx";

const Character = () => {
    const [ref, api] = useBox(() => ({
        mass: 1, 
        collisionFilterGroup: 1, 
        position: [0, 0, 0], //Permet que le perso tombe droit
        rotation: [0, 0, 0], 
    }));

    useFrame((state, delta) => {
        // Faites tourner la boîte de collision ici
        //zapi.rotation.set(0, Math.sin(state.clock.elapsedTime) * 0.5, 0);
    });

    return (
        <>
            <ModelLoader modelPath="characters.glb" ref={ref} physicsProps={{ ref }} />
            <Controls characterApi={api} />
        </>
    );
}

export default Character;
