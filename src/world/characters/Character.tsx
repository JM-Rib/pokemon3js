import ModelLoader from "../../utils/ModelLoader.tsx";
import React, { useEffect, useRef } from "react";
import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";

const Character = () => {
    const [ref] = useBox(() => ({ mass: 1, position: [0, 0, 0] }));
    const CharacterRef = useRef();

    useFrame(() => {
        if (CharacterRef.current)
            CharacterRef.current.rotation.y += 0.01;
            CharacterRef.current.position.y = Math.sin(0.01 * Date.now());
    });

    useEffect(() => {
        console.log(CharacterRef.current);
    }, [CharacterRef.current]);

    return (
        <>
            <ModelLoader modelPath="characters.glb" ref={ref} meshRef={CharacterRef} />
            {/* Utilisez meshRef.current ici */}
        </>
    );
}

export default Character;
