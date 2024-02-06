import ModelLoader from "../../utils/ModelLoader.tsx";
import React from "react";
import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";

const Character = () => {
    const [ref] = useBox(() => ({ mass: 1, position: [0, 0, 0] }));

    useFrame(({ clock }) => {
        ref.current.rotation.y = clock.getElapsedTime();
        console.log(ref);
    });

    return (
        <>
            <ModelLoader modelPath="characters.glb" ref={ref}/>
        </>
    );
}

export default Character;