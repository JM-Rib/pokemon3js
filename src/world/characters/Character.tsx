import ModelLoader from "../../utils/ModelLoader.tsx";
import React, {Suspense, useEffect, useMemo, useRef} from "react";
import {useBox, useCompoundBody, useContactMaterial} from "@react-three/cannon";
import { useFrame,  useThree } from "@react-three/fiber";
import useFollowCam from "../../utils/useFollowCam.tsx";
import Controls from "./Controls.tsx";
import {Vector3} from "three"; // Import the useFollowCam hook

const Character = () => {
    const worldPosition = useMemo(() => new Vector3(), []);
    useContactMaterial('ground', 'slippery', {
        friction: 0,
        restitution: 0.01,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
    });
    const [ref, api] = useCompoundBody(() => ({
        mass: 1,
        shapes: [
            { args: [0.25], position: [0, 0.25, 0], type: 'Sphere' },
            { args: [0.25], position: [0, 0.75, 0], type: 'Sphere' },
            { args: [0.25], position: [0, 1.25, 0], type: 'Sphere' }
        ],
        onCollide: (e) => {
        },
        material: 'slippery',
        linearDamping: 0,
        position: [0, 2, 0]
    }));

    const { camera } = useThree(); // Get the camera from useThree hook
    const { pivot, alt, yaw, pitch } = useFollowCam(ref, [0, 1, 1.5]); // Call the useFollowCam hook

    useFrame(({raycaster}, delta) => {
        //
        ref.current.getWorldPosition(worldPosition);
        //api.linearDamping.set(0.9999999);
    });

    return (
        <>
            <Suspense fallback={null}>
                <ModelLoader modelPath="characters.glb" ref={ref} physicsProps={{ ref }} />
            </Suspense>
            <Controls characterApi={api} yaw={yaw} />
        </>
    );
}

export default Character;
