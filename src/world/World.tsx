import { Physics, useBox } from '@react-three/cannon';
import React from "react";
import {Environment} from "@react-three/drei";
import Pokemons from "./pokemons/Pokemons.tsx";
import Character from "./characters/Character.tsx";
import Map from "./environments/Map.tsx";
import ToggleDebug from "../utils/ToggleDebug.tsx";

const World = () => {
  return (
      <>

              <Physics>
              <ToggleDebug>
                <Map/>
                <Character/>
              </ToggleDebug>
                <Environment preset="sunset" background/>

              </Physics>

      </>
  );
}
export default World;
