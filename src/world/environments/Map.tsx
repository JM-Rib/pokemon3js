import React, { forwardRef, useEffect, useRef, useState } from "react";
import { usePlane, useConvexPolyhedron } from "@react-three/cannon";
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Object3D } from "three";

// Define the ConvexMeshProps interface
interface ConvexMeshProps {
    mesh: any;
}

// ConvexMesh component for applying physics
const ConvexMesh = forwardRef<any, ConvexMeshProps>((props, ref) => {
    const { mesh } = props;
    console.log(mesh);

    // Convert flat array of vertices to an array of vectors
    const vertices = [];
    const positionArray = mesh.geometry.attributes.position.array;
    for (let i = 0; i < positionArray.length; i += 3) {
        vertices.push([positionArray[i], positionArray[i + 1], positionArray[i + 2]]);
    }

    // Convert flat index array to an array of faces (triangles)
    const faces = [];
    const indexArray = mesh.geometry.index.array;
    for (let i = 0; i < indexArray.length; i += 3) {
        faces.push([indexArray[i], indexArray[i + 1], indexArray[i + 2]]);
    }

    // Use cannon's convex polyhedron shape
    const [convexRef, api] = useConvexPolyhedron(() => ({
        args: [vertices, faces],
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        mass: 1,
    }));

    return <mesh ref={convexRef} geometry={mesh.geometry} material={mesh.material} />;
});

// Map component for loading the island GLB and applying physics
const Map = forwardRef((props, ref) => {
    const [mesObjetsALaCon, setMesObjetsALaCon] = useState<Object3D[]>([]);
    const shapes = useRef<Object3D[]>([]);

    // Load the GLB file
    const gltf = useLoader(GLTFLoader, "island.glb");

    useEffect(() => {
        gltf.scene.traverse((child) => {
            if (child.name === "FP_jog_islandao") {
                child.traverse((mesh) => {
                    if (mesh.userData.physics === "convex") {
                        shapes.current.push(mesh);
                    }
                });
            }
        });
    }, [gltf]);

    useEffect(() => {
        setMesObjetsALaCon(shapes.current);
    }, [shapes]);

    return (
        <>
            {gltf.scene && mesObjetsALaCon.map((child: any, i) => (
                child?.geometry?.attributes !== undefined && (
                    <ConvexMesh mesh={child} key={i} />
                )
            ))}
        </>
    );
});

export default Map;
