import React, { forwardRef, MutableRefObject, useEffect, useRef } from "react";
import { Vector3 } from 'three';
import { useConvexPolyhedron } from "@react-three/cannon";

interface ShapeObject {
    vertices: Float32Array;
    indices: Float32Array;
}

declare type Triplet = [x: number, y: number, z: number];
declare type VectorTypes = Vector3 | Triplet;

declare type ConvexPolyhedronArgs<V extends VectorTypes = VectorTypes> = [
    vertices?: V[],
    faces?: number[][],
    normals?: V[],
    axes?: V[],
    boundingSphereRadius?: number
];

const IslandParts = (shapeConvex: ConvexPolyhedronArgs) => {
    // Convert Float32Array to an array of Triplet
    const verticesArray: Triplet[] = [];
    for (let i = 0; i < shapeConvex[0]?.length; i += 3) {
        verticesArray.push([shapeConvex[0][i], shapeConvex[0][i + 1], shapeConvex[0][i + 2]]);
    }

    // Assuming the indices is an array of faces, convert Float32Array to number[][]
    const indicesArray: number[][] = [];
    for (let i = 0; i < shapeConvex[1]?.length; i += 3) {
        indicesArray.push([
            shapeConvex[1][i],
            shapeConvex[1][i + 1],
            shapeConvex[1][i + 2],
        ]);
    }

    const [convex] = useConvexPolyhedron(() => ({
        args: [verticesArray, indicesArray], // Pass converted values
        material: 'ground',
        position: [0, 0, 0],
    }), useRef());

    return <mesh ref={convex} />;
};

export default IslandParts;
