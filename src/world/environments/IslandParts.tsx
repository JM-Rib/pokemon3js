import React, { useRef } from "react";
import { useConvexPolyhedron } from "@react-three/cannon";
import * as THREE from 'three';

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface ShapeObject {
  vertices: Vec3[]; 
  faces: number[][];
}

const IslandParts = ({ vertices, faces }: ShapeObject) => {
  const threeVertices = vertices.map(v => new THREE.Vector3(v.x, v.y, v.z).clone());

  console.log("Converted Vertices:", threeVertices);
  console.log("Faces:", faces);

  const [convexRef] = useConvexPolyhedron(() => ({
    args: [threeVertices, faces], 
    material: 'ground',
    position: [0, 0, 0],
  }), useRef<THREE.Mesh>(null));

  faces.forEach((face, index) => {
    console.log(`Face ${index}:`, face);
    face.forEach(vertexIndex => {
        console.log(`Vertex ${vertexIndex}:`, vertices[vertexIndex]);
    });
  });

  console.log("Physics args:", { vertices: threeVertices, faces });

  return <mesh ref={convexRef}></mesh>;
};

export default IslandParts;
