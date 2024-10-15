import { useEffect, useState } from "react";
import {exp} from "three/examples/jsm/nodes/math/MathNode";

export interface KeyboardControls {
    moveForward: boolean;
    moveBackward: boolean;
    moveLeft: boolean;
    moveRight: boolean;
    jump: boolean;
}
export const useKeyboardControls = (): KeyboardControls => {
    const [controls, setControls] = useState<KeyboardControls>({
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        jump: false
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key.toLowerCase()) {
                case "z":
                    setControls((prevControls) => ({ ...prevControls, moveForward: true }));
                    break;
                case "s":
                    setControls((prevControls) => ({ ...prevControls, moveBackward: true }));
                    break;
                case "q":
                    setControls((prevControls) => ({ ...prevControls, moveLeft: true }));
                    break;
                case "d":
                    setControls((prevControls) => ({ ...prevControls, moveRight: true }));
                    break;
                case " ":
                    setControls((prevControls) => ({ ...prevControls, jump: true }));
                    break;
                default:
                    break;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.key.toLowerCase()) {
                case "z":
                    setControls((prevControls) => ({ ...prevControls, moveForward: false }));
                    break;
                case "s":
                    setControls((prevControls) => ({ ...prevControls, moveBackward: false }));
                    break;
                case "q":
                    setControls((prevControls) => ({ ...prevControls, moveLeft: false }));
                    break;
                case "d":
                    setControls((prevControls) => ({ ...prevControls, moveRight: false }));
                    break;
                case " ":
                    setControls((prevControls) => ({ ...prevControls, jump: false }));
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return {
        moveForward: controls.moveForward,
        moveBackward: controls.moveBackward,
        moveLeft: controls.moveLeft,
        moveRight: controls.moveRight,
        jump: controls.jump,
    };
};

export default useKeyboardControls;
