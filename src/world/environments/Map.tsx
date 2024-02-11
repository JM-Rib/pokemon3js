import React, { useEffect, useRef, useState } from "react";
import {usePlane, useTrimesh, useCompoundBody} from "@react-three/cannon";
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TrimeshCollider } from "../../utils/TrimeshCollider.ts";
import { EdgesGeometry } from "three";

const Map = () => {
    const [refone] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -0.1, 0], material: 'ground' }), useRef());
    const physObjectsRef = useRef<TrimeshCollider[]>([]);
    const shapes = useRef<any[]>([]);
    
    // const geometry = useMemo(() => new TorusGeometry(0.75, 0,1), [[0.75, 0,1]]);
    const gltf = useLoader(GLTFLoader, "island.glb");

    // const findType = (object, type) => {
    //     object.children.forEach((child) => {
    //         if (child.type === type) {
    //             console.log(child);
    //         }
    //         findType(child, type);
    //     });
    // };
    // useEffect( () => {
    //     findType(gltf.scene, "Mesh")
    // }, []);

    useEffect(() => {
        gltf.scene.traverse((child) => {
            if(child.name === "FP_jog_islandao"){
                child.traverse( (mesh) => {
                    if(mesh.type === "SkinnedMesh"){
                        let phys = new TrimeshCollider(mesh, {});
                        physObjectsRef.current.push(phys.body);
                        shapes.current.push(phys.body.shapes[0]);
                    }
                })
            }
        });
        console.log(ref.current);
        console.log(...physObjectsRef.current);
    });
    
    const [ref] = useCompoundBody(
        () => ({
            mass: 0,
            position,
            shapes: shapes
        }),
        useRef()
    )

    return (
        <>
            <primitive object={gltf.scene} {...physObjectsRef.current} />
        </>
    )
}

export default Map;
