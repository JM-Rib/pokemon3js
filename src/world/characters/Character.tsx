import ModelLoader from "../../utils/ModelLoader.tsx";
import React, { useEffect, useRef } from "react";
import { useBox } from "@react-three/cannon";
import { useFrame,  useThree } from "@react-three/fiber";
import useFollowCam from "../../utils/useFollowCam.tsx";
import Controls from "./Controls.tsx";

const Character = () => {
    const [ref, api] = useBox(() => ({
        mass: 1,
        collisionFilterGroup: 1,
        position: [0, 0, 0], // Permet que le perso tombe droit
        rotation: [0, 0, 0],
    }));
    const CharacterRef = useRef();

    useFrame((state, delta) => {
        // Faites tourner la boîte de collision ici
        api.rotation.set(0, Math.sin(state.clock.elapsedTime) * 0.5, 0);
    });
    const { camera } = useThree(); // Get the camera from useThree hook
    const { pivot, alt, yaw, pitch } = useFollowCam(ref, [0, 1, 1.5]); // Call the useFollowCam hook

    useFrame(() => {
        // You can add custom logic related to character movement or animation here
    });

    return (
        <>
            <ModelLoader modelPath="characters.glb" ref={ref} physicsProps={{ ref }} />
            <Controls characterApi={api} />
        </>
    );
}

export default Character;
