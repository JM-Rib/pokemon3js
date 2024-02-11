import {MutableRefObject, useEffect, useMemo, useRef} from "react";
import {useKeyboardControls, KeyboardControls} from "../../utils/useKeyboardControls.tsx";
import {useFrame} from "@react-three/fiber";
import {PublicApi} from "@react-three/cannon";
import character from "./Character";
import {AnimationAction, AnimationClip, Euler, Matrix4, Object3D, Quaternion, Vector3} from "three";
import {Environment, useAnimations} from "@react-three/drei";


interface ControlsProps {
    characterApi: PublicApi;
    characterRef: MutableRefObject<Object3D>;
    yaw: Object3D;
    playerGrounded: MutableRefObject<boolean>;
    inJumpAction: MutableRefObject<boolean>;
    actions: Array<AnimationAction>;
}


const Controls = (ControlsProps) => {
    const { characterApi, characterRef, yaw, playerGrounded, inJumpAction, actions } = ControlsProps;
    const moveSpeed = 2;
    const jumpForce = 6;
    const characterPosition = useMemo(() => new Vector3(), []);
    const velocity = useMemo(() => new Vector3(), []);
    const inputVelocity = useMemo(() => new Vector3(), []);
    const euler = useMemo(() => new Euler(), []); // Rotation en coordonnées d'Euler
    const quat = useMemo(() => new Quaternion(), []);
    const raycasterOffset = useMemo(() => new Vector3(), []);
    const rotationMatrix = useMemo(() => new Matrix4(), []);
    const targetQuaternion = useMemo(() => new Quaternion(), []);
    const previousPosition = useRef(new Vector3());
    const prevActiveAction = useRef(0) // 0:idle, 1:walking, 2:jumping
    const controls: KeyboardControls = useKeyboardControls();

    useEffect(() => {
        console.log('actionsdsd', actions);
    }, [actions]);



    useFrame(({ clock, raycaster }, delta) => {
        if (document.pointerLockElement) {
            let ativeAction = 0;// 0:idle, 1:walking, 2:jumping
            // Calcul de la nouvelle position en fonction des contrôles clavier
            const speed = moveSpeed * delta;
            const direction = [0, 0, 0];

            characterApi.angularFactor.set(0, 0, 0);
            characterRef.current.getWorldPosition(characterPosition);

            //playerGrounded.current = false;
            raycasterOffset.copy(characterPosition);
            raycasterOffset.y += 0.01;
            raycaster.set(raycasterOffset, new Vector3(0, -1, 0));

            // Si le personnage est au sol, on lui applique un amortissement linéaire
            if (!playerGrounded.current) {
                characterApi.linearDamping.set(0);
            }else {
                characterApi.linearDamping.set(0.999999);
            }

            const distance = characterPosition.distanceTo(previousPosition.current);

            // On calcule la rotation du personnage
            rotationMatrix.lookAt(characterPosition, previousPosition.current, new Vector3(0, 1, 0));
            targetQuaternion.setFromRotationMatrix(rotationMatrix);
            if (distance > 0.0001 && !characterRef.current.quaternion.equals(targetQuaternion)) {
                targetQuaternion.z = 0;
                targetQuaternion.x = 0;
                targetQuaternion.normalize();
                targetQuaternion.rotateTowards(targetQuaternion, delta * 20);
                characterApi.quaternion.copy(targetQuaternion);
            }

            // On calcule la vélocité du personnage
            inputVelocity.set(0,0,0);
            if (controls.moveForward){
                ativeAction = 1;
                direction[2] = -10;
                //actions['walking'].reset().play();
            }
            if (controls.moveBackward){
                ativeAction = 1;
                direction[2] = 10;
                //actions['idle'].reset().fadeIn(0.5).play();
            }
            if (controls.moveLeft){
                ativeAction = 1;
                direction[0] = -10;
                //actions['leftStrafWalking'].reset().fadeIn(0.5).play();
            }
            if (controls.moveRight){
                ativeAction = 1;
                direction[0] = 10;
                //actions['rightStrafWalking'].reset().fadeIn(0.5).play();
            }

            inputVelocity.z = direction[2] * speed;
            inputVelocity.x = direction[0] * speed;

            if (ativeAction !== prevActiveAction.current) {
                //console.log('active action changed')
                if (prevActiveAction.current !== 1 && ativeAction === 1) {
                    //console.log('idle --> walking')
                    actions['idle'].fadeOut(0.1)
                    actions['walking'].reset().fadeIn(0.1).play()
                }
                if (prevActiveAction.current !== 0 && ativeAction === 0) {
                    //console.log('walking --> idle')
                    actions['walking'].fadeOut(0.1)
                    actions['idle'].reset().fadeIn(0.1).play()
                }
                prevActiveAction.current = ativeAction;
            }
            // On calcule la vélocité du saut
            if (controls.jump) {
                if (playerGrounded.current && !inJumpAction.current){
                    ativeAction = 2;
                    inJumpAction.current = true;
                    inputVelocity.y = jumpForce;
                    actions['walking'].fadeOut(0.1)
                    actions['idle'].fadeOut(0.1)
                    actions['jump'].reset().fadeIn(0.5).play();
                }
            }


            // On applique la vélocité au personnage
            euler.y = yaw.rotation.y;
            quat.setFromEuler(euler);
            inputVelocity.applyQuaternion(quat);
            velocity.set(inputVelocity.x, inputVelocity.y, inputVelocity.z);
            characterApi.applyImpulse([velocity.x, velocity.y, velocity.z], [0, 0, 0]);
            previousPosition.current.lerp(characterPosition, 0.3);
        }
    });

    return null; // Les contrôles sont gérés dans le useFrame
};


export default Controls;
