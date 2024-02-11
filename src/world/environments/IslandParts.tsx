import React, { forwardRef, MutableRefObject, useEffect, useRef } from "react";
import { useTrimesh } from "@react-three/cannon";
    
interface ShapeObject {
    vertices: Float32Array;
    indices: Int16Array;
}
    
const IslandParts = (shape: ShapeObject) => {
    const [trimesh] = useTrimesh(() => ({
        args: [shape.vertices, shape.indices],
        material: 'ground',
        position: [0, 0, 0],
    }), useRef());

    return <mesh ref={trimesh} />;
};

export default IslandParts;
