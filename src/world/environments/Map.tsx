import React, { forwardRef, useEffect, useRef, useState } from "react";
import {usePlane} from "@react-three/cannon";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TrimeshCollider } from "../../utils/TrimeshCollider.ts";
import IslandParts from "./IslandParts.tsx";

const Map = forwardRef( (props, ref) => {
    const [refone] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -0.1, 0], material: 'ground' }), useRef());
    const [mesObjetsALaCon, setMesObjetsALaCon] = useState<any>([]);

    interface ShapeObject {
        vertices: Float32Array;
        indices: Int16Array;
    }
    const shapes = useRef<ShapeObject[]>([]);
    
    const gltf = useLoader(GLTFLoader, "island.glb");
    useEffect(() => {
        gltf.scene.traverse((child) => {
            if(child.name === "FP_jog_islandao"){
                child.traverse( (mesh) => {
                    if(mesh.type === "SkinnedMesh"){
                        let phys = new TrimeshCollider(mesh, {});
                        // physObjectsRef.current.push(phys.body);
                        var referencement: ShapeObject = {
                            vertices: phys.body.shapes[0].vertices,
                            indices: phys.body.shapes[0].indices
                        }
                        shapes.current.push(referencement);
                    }
                })
            }
        });
    }, []);

    useEffect(() => {
        setMesObjetsALaCon(shapes.current);
    }, [shapes]);

    return (
        <>
            <primitive object={gltf.scene} />
            {mesObjetsALaCon ? (mesObjetsALaCon.map((x, i) => (
                <>
                    <IslandParts key={i} indices={x.indices} vertices={x.vertices} /> 
                </>
            ))) : null} 
        </>
    )
});

export default Map;
