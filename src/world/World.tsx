import { Physics, useBox } from '@react-three/cannon';
import React from "react";
import {Environment} from "@react-three/drei";
import Pokemons from "./pokemons/Pokemons.tsx";
import Character from "./characters/Character.tsx";
import Map from "./environments/Map.tsx";

const World = () => {
  return (
      <>
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