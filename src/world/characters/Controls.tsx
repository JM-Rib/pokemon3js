import {MutableRefObject, useRef} from "react";
import {useKeyboardControls, KeyboardControls} from "../../utils/useKeyboardControls.tsx";
import {useFrame} from "@react-three/fiber";
import {PublicApi} from "@react-three/cannon";
import character from "./Character";

interface ControlsProps {
    characterApi: PublicApi;
}


const Controls = ({characterApi}: ControlsProps) => {
    const moveSpeed = 1;
    const jumpForce = 10;

    const controls: KeyboardControls = useKeyboardControls();

    const velocity = useRef([0, 0, 0]);

    useFrame(({ clock }) => {
        const delta = clock.getDelta(); // Delta time

        // Calcul de la nouvelle position en fonction des contrôles clavier
        const speed = moveSpeed * delta;
        const direction = [0, 0, 0];

        if (controls.moveForward) direction[2] = -1;
        if (controls.moveBackward) direction[2] = 1;
        if (controls.moveLeft) direction[0] = -1;
        if (controls.moveRight) direction[0] = 1;

        // Appliquer le déplacement sur l'objet physique
        characterApi.velocity.set(direction[0],-10,direction[2]);

        //quand le personnage n'est pas immobile
        if (direction[0] !== 0 || direction[2] !== 0) {
            characterApi.velocity.set(direction[0],0.1,direction[2]);
        }

        console.log(direction)
        // Saut
        if (controls.jump && characterApi.position[1] === 0) { // Vérifiez si le personnage est au sol avant de sauter
        }
    });

    return null; // Les contrôles sont gérés dans le useFrame
};


export default Controls;