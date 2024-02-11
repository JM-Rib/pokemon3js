import ModelLoader from "../../utils/ModelLoader.tsx";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useBox, useCompoundBody, useContactMaterial } from "@react-three/cannon";
import { useFrame, useThree } from "@react-three/fiber";
import useFollowCam from "../../utils/useFollowCam.tsx";
import Controls from "./Controls.tsx";
import { Vector3 } from "three";

const Character = () => {
    const [modelLoaded, setModelLoaded] = useState(false);
    const [actions, setActions] = useState(null);
    const contactNormal = useMemo(() => new Vector3(0, 0, 0), []);
    const playerGrounded = useRef(false);
    const inJumpAction = useRef(false);

    const handleGLTFLoaded = (loadedActions) => {
        setActions(loadedActions);
        setModelLoaded(true);
    };

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
            if (e.contact.bi.id !== e.body.id) {
                contactNormal.set(e.contact.ni[0], e.contact.ni[1], e.contact.ni[2]);
            }
            if (contactNormal.dot(new Vector3(0, -1, 0)) > 0.5) {
                console.log('grounded');
                playerGrounded.current = true;
                inJumpAction.current = false;
            }
        },
        material: 'slippery',
        linearDamping: 0,
        position: [0, 2, 0]
    }));

    const { camera } = useThree();
    const { pivot, alt, yaw, pitch } = useFollowCam(ref, [0, 1, 1.5]);

    useFrame(({ raycaster }, delta) => {

    });

    return (
        <>
            <Suspense fallback={null}>
                <ModelLoader modelPath="character.glb" physicsProps={{ ref }} onGLTFLoaded={handleGLTFLoaded} />
            </Suspense>
            {modelLoaded && actions && ( // Vérifiez que les actions sont chargées avant de passer à Controls
                <Controls
                    characterApi={api}
                    characterRef={ref}
                    yaw={yaw}
                    playerGrounded={playerGrounded}
                    inJumpAction={inJumpAction}
                    actions={actions}
                />
            )}
        </>
    );
}

export default Character;
