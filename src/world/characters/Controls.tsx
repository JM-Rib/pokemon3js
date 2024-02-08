import {MutableRefObject, useMemo, useRef} from "react";
import {useKeyboardControls, KeyboardControls} from "../../utils/useKeyboardControls.tsx";
import {useFrame} from "@react-three/fiber";
import {PublicApi} from "@react-three/cannon";
import character from "./Character";
import {Euler, Object3D, Quaternion, Vector3} from "three";

interface ControlsProps {
    characterApi: PublicApi;
    yaw: Object3D;
}


const Controls = ({characterApi, yaw}: ControlsProps) => {
    const moveSpeed = 1;
    const jumpForce = 10;
    const velocity = useMemo(() => new Vector3(), []);
    const inputVelocity = useMemo(() => new Vector3(), []);
    const euler = useMemo(() => new Euler(), []); // Rotation en coordonnées d'Euler
    const quat = useMemo(() => new Quaternion(), []);

    const controls: KeyboardControls = useKeyboardControls();

    useFrame(({ clock }) => {
        const delta = clock.getDelta(); // Delta time

        // Calcul de la nouvelle position en fonction des contrôles clavier
        const speed = moveSpeed * delta;
        const direction = [0, 0, 0];

        if (controls.moveForward) direction[2] = -1;
        if (controls.moveBackward) direction[2] = 1;
        if (controls.moveLeft) direction[0] = -1;
        if (controls.moveRight) direction[0] = 1;

        inputVelocity.z = direction[2] * speed;
        inputVelocity.x = direction[0] * speed;
        inputVelocity.setLength(0.7);

        euler.y = yaw.rotation.y;
        quat.setFromEuler(euler);
        inputVelocity.applyQuaternion(quat);
        velocity.set(inputVelocity.x, -10, inputVelocity.z);
        characterApi.applyImpulse([velocity.x, velocity.y, velocity.z], [0, 0, 0]);

        console.log(direction)
        // Saut
        if (controls.jump && characterApi.position[1] === 0) { // Vérifiez si le personnage est au sol avant de sauter
        }
    });

    return null; // Les contrôles sont gérés dans le useFrame
};


export default Controls;
