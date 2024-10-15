import {MutableRefObject, useMemo, useRef} from "react";
import {useKeyboardControls, KeyboardControls} from "../../utils/useKeyboardControls.tsx";
import {useFrame} from "@react-three/fiber";
import {PublicApi} from "@react-three/cannon";
import character from "./Character";
import {Euler, Matrix4, Object3D, Quaternion, Vector3} from "three";
import { Environment } from "@react-three/drei";

interface ControlsProps {
    characterApi: PublicApi;
    characterRef: MutableRefObject<Object3D>;
    yaw: Object3D;
    playerGrounded: MutableRefObject<boolean>;
    inJumpAction: MutableRefObject<boolean>;
}


const Controls = ({characterApi, yaw, characterRef, playerGrounded, inJumpAction}: ControlsProps) => {
    const moveSpeed = 6;
    const jumpForce = 0.05;
    const worldPosition = useMemo(() => new Vector3(), []);
    const characterPosition = useMemo(() => new Vector3(), []);
    const velocity = useMemo(() => new Vector3(), []);
    const inputVelocity = useMemo(() => new Vector3(), []);
    const euler = useMemo(() => new Euler(), []); // Rotation en coordonnées d'Euler
    const quat = useMemo(() => new Quaternion(), []);
    const raycasterOffset = useMemo(() => new Vector3(), []);
    const rotationMatrix = useMemo(() => new Matrix4(), []);
    const targetQuaternion = useMemo(() => new Quaternion(), []);
    const previousPosition = useRef(new Vector3());

    const controls: KeyboardControls = useKeyboardControls();



    useFrame(({ clock, raycaster }, delta) => {
        let ativeAction = 0;
        // Calcul de la nouvelle position en fonction des contrôles clavier
        const speed = moveSpeed * delta;
        const direction = [0, 0, 0];

        if(characterApi.angularFactor !== undefined ){
            characterApi.angularFactor.set(0, 0, 0);
        }
        characterRef.current.getWorldPosition(worldPosition);
        previousPosition.current.copy(worldPosition);

        //playerGrounded.current = false;
        raycasterOffset.copy(worldPosition);
        raycasterOffset.y += 0.01;
        raycaster.set(raycasterOffset, new Vector3(0, -1, 0));


        if (characterApi.linearDamping !== undefined) {
            if (!playerGrounded.current) {
                characterApi.linearDamping.set(0);
            }else {
                characterApi.linearDamping.set(0.999999);
            }
        }

        const unsubscribe = characterApi.position.subscribe((newValue) => {
            //characterRef.current.position.set(newValue[0], newValue[1], newValue[2]);
            characterPosition.x = newValue[0];
            characterPosition.y = newValue[1];
            characterPosition.z = newValue[2];
        });

        const distance = characterPosition.distanceTo(yaw.position);
        if(process.env.REACT_APP_CAMERA_CHIASSE !== 'false'){
            rotationMatrix.lookAt(worldPosition, yaw.position, characterRef.current.up);
            // Create a rotation matrix that inverts the Y rotation by Math.PI radians
            // Apply the inversion to the rotation matrix
            targetQuaternion.setFromRotationMatrix(rotationMatrix);


            if (distance > 0.0001 && !characterRef.current.quaternion.equals(targetQuaternion)) {
                targetQuaternion.z = 0;
                targetQuaternion.x = 0;

                if (delta > 0.0001) {

                    targetQuaternion.normalize();
                    characterRef.current.quaternion.rotateTowards(yaw.quaternion, -delta*3);
                    let invertedQuaternion = new Quaternion(characterRef.current.quaternion.x, characterRef.current.quaternion.y, characterRef.current.quaternion.z, characterRef.current.quaternion.w);
                    characterApi.quaternion.copy(invertedQuaternion);
                    //inverse le characterRef.current.quaternion
                }
                //characterApi.rotation.set(0, characterRef.current.rotation.y * 10, 0);
            }
        }



        if (document.pointerLockElement) {
            inputVelocity.set(0,0,0);
            if (controls.moveForward) direction[2] = -10;
            if (controls.moveBackward) direction[2] = 10;
            if (controls.moveLeft) direction[0] = -10;
            if (controls.moveRight) direction[0] = 10;

            inputVelocity.z = direction[2] * speed;
            inputVelocity.x = direction[0] * speed;

            if (direction[0] !== 0 || direction[2] !== 0) {
                ativeAction = 1;
            }
            if (controls.jump) {
                if (playerGrounded.current && !inJumpAction.current){
                    ativeAction = 2;
                    inJumpAction.current = true;
                    inputVelocity.y = 12;
                    console.log('jump');
                }
            }

            euler.y = yaw.rotation.y;
            quat.setFromEuler(euler);
            inputVelocity.applyQuaternion(quat);
            velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z);
            characterApi.applyImpulse([velocity.x, velocity.y, velocity.z], [0, 0, 0]);
        }
    });

    return null; // Les contrôles sont gérés dans le useFrame
};


export default Controls;
