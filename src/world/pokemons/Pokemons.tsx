import ModelLoader from "../../utils/ModelLoader.tsx";
import React, {useRef} from "react";
import {useBox} from "@react-three/cannon";

const Pokemons = () => {
    const [ref] = useBox(() => ({ mass: 1, position: [1, 5, 0] }));
    return (
        <>
            <ModelLoader modelPath="monster.glb" ref={ref}  />
        </>
    );
}

export default Pokemons;
