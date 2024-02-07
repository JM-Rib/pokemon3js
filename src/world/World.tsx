import { Physics } from '@react-three/cannon';
import { Environment, OrbitControls } from "@react-three/drei";
import { PerspectiveCamera } from 'three';
// @ts-ignore
import Pokemons from "./pokemons/Pokemons.tsx";
// @ts-ignore
import Character from "./characters/Character.tsx";
// @ts-ignore
import Map from "./environments/Map.tsx";
import { useFrame, useThree } from "@react-three/fiber";
import { Color } from "three";
import { useRef } from "react";

const World = () => {
    const cameraTop = useRef<PerspectiveCamera>(null);
    const cameraBottom = useRef<PerspectiveCamera>(null);
    const { size } = useThree();

    useFrame(({ gl, scene }) => {
        const renderer = gl;

        // Rendu de la première caméra (cameraTop)
        if (cameraTop.current) {
            renderer.setViewport(0, 0, Math.floor(size.width / 2), size.height);
            renderer.setScissor(0, 0, Math.floor(size.width / 2), size.height);
            renderer.setScissorTest(true);
            renderer.setClearColor(new Color(1, 1, 1));
            cameraTop.current.aspect = Math.floor(size.width / 2) / size.height;
            cameraTop.current.updateProjectionMatrix();
            renderer.render(scene, cameraTop.current);
        }

        // Rendu de la deuxième caméra (cameraBottom)
        if (cameraBottom.current) {
            renderer.setViewport(Math.floor(size.width / 2), 0, Math.ceil(size.width / 2), size.height);
            renderer.setScissor(Math.floor(size.width / 2), 0, Math.ceil(size.width / 2), size.height);
            renderer.setScissorTest(true);
            renderer.setClearColor(new Color(1, 1, 1));
            cameraBottom.current.aspect = Math.ceil(size.width / 2) / size.height;
            cameraBottom.current.updateProjectionMatrix();
            renderer.render(scene, cameraBottom.current);
        }
    });

    return (
        <>
            <perspectiveCamera ref={cameraTop} position={[0, 0, 5]} fov={75} aspect={size.width / 2 / size.height} near={0.1} far={1000} />
            <perspectiveCamera ref={cameraBottom} position={[0, 0, 5]} fov={50} aspect={size.width / 2 / size.height} near={0.1} far={1000} />
            <OrbitControls camera={cameraTop.current || undefined} />

            <Physics gravity={[0, -10, 0]}>
                <Map />
                <Environment preset="sunset" background />
                <Pokemons />
                <Character />
            </Physics>
        </>
    );
}

export default World;
