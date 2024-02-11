import { useEffect, useRef } from 'react';
import { useAnimations, useGLTF } from "@react-three/drei";

const ModelLoader = ({ modelPath, physicsProps, onGLTFLoaded }) => {
    const ref = useRef();
    const gltf= useGLTF(modelPath);
    const {names, actions} = useAnimations(gltf.animations, ref);
    //const modelAnimation = useAnimations(animations, ref);
    useEffect(() => {
        console.log(actions);
        actions[names[0]].reset().fadeIn(0.5).play();
        if (gltf && onGLTFLoaded) {
            onGLTFLoaded(actions);
        }
    }, [gltf, onGLTFLoaded]);

    return (
        <group ref={ref} dispose={null}>
            <primitive object={gltf.scene}   {...physicsProps} />
        </group>
    );
};

export default ModelLoader;
