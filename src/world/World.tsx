import { Physics } from '@react-three/cannon';
import React, { useRef } from "react";
import {Environment, OrbitControls, PerspectiveCamera} from "@react-three/drei";
import Pokemons from "./pokemons/Pokemons.tsx";
import Character from "./characters/Character.tsx";
import Map from "./environments/Map.tsx";
import { useFrame, useThree } from "@react-three/fiber";
import { Color } from "three";

const World = () => {
    const cameraTop = useRef();
    const cameraBottom = useRef();
    const { size } = useThree();

    useFrame((state, delta) => {
        const { gl, scene } = state;
        const renderer = state.gl;

        renderer.setViewport(0, 0, Math.floor(size.width / 2), size.height);
        renderer.setScissor(0, 0, Math.floor(size.width / 2), size.height);
        renderer.setScissorTest(true);
        renderer.setClearColor(new Color(1, 1, 1));
        cameraTop.current.aspect = Math.floor(size.width / 2) / size.height;
        cameraTop.current.updateProjectionMatrix();
        renderer.render(scene, cameraTop.current);

        renderer.setViewport(Math.floor(size.width / 2), 0, Math.floor(size.width / 2), size.height); // Utilisez Math.ceil pour arrondir vers le haut
        renderer.setScissor(Math.floor(size.width / 2), 0, Math.floor(size.width / 2), size.height);
        renderer.setScissorTest(true);
        renderer.setClearColor(new Color(1, 1, 1));
        cameraBottom.current.aspect = Math.floor(size.width / 2) / size.height; // Utilisez Math.ceil pour arrondir vers le haut
        cameraBottom.current.updateProjectionMatrix();
        renderer.render(scene, cameraBottom.current);
    });

    return (
        <>
            <PerspectiveCamera ref={cameraTop} position={[0, 0, 5]} fov={75} aspect={size.width / size.height} near={0.1} far={1000} />
            <OrbitControls camera={cameraTop.current} />
            <PerspectiveCamera ref={cameraBottom} position={[0, 0, 5]} fov={50} aspect={size.width / size.height} near={0.1} far={1000} />

            <Physics gravity={[0, -10, 0]}>
                <Map/>
                <Environment preset="sunset" background/>
                <Pokemons/>
                <Character/>
            </Physics>
        </>
    );
}

export default World;
