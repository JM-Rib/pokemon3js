import React, { forwardRef, useEffect, useRef, useState } from "react";
import {usePlane, useConvexPolyhedron} from "@react-three/cannon";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TrimeshCollider } from "../../utils/TrimeshCollider.ts";
import { Convex } from "../../utils/Convex.ts";
import IslandParts from "./IslandParts.tsx";
import { ConvexPolyhedron, Shape } from "cannon-es";

const Map = forwardRef( (props, ref) => {
    const [refone] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -0.1, 0], material: 'ground' }), useRef());
    const [mesObjetsALaCon, setMesObjetsALaCon] = useState<Shape[]>([]);

    interface ShapeObject {
        vertices: Float32Array;
        indices: Int16Array;
    }
    const shapes = useRef<Shape[]>([]);
    
    const gltf = useLoader(GLTFLoader, "island.glb");
    useEffect(() => {
        gltf.scene.traverse((child) => {
            console.log(child.userData.physics);
            if(child.name === "FP_jog_islandao"){
                child.traverse( (mesh) => {
                    if(mesh.userData.physics === "convex"){
                        
                        let phys = new Convex(mesh, {});

                        shapes.current.push(phys.body.shapes[0]);
                    }
                    // if(mesh.userData.physics === "trimesh-r3f-conversion"){
                    //     let phys = new TrimeshCollider(mesh, {});
                    //     // physObjectsRef.current.push(phys.body);
                    //     var referencement: ShapeObject = {
                    //         vertices: phys.body.shapes[0].vertices,
                    //         indices: phys.body.shapes[0].indices
                    //     }
                    //     shapes.current.push(referencement);
                    // }
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
                    <IslandParts key={i} convex={x} faces={x.faces} vertices={x.vertices} /> 
                </>
            ))) : null} 
        </>
    )
});

export default Map;
