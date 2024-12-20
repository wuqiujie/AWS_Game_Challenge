import React from "react";
import Desk from "../models/Desk";
import Computer from "../models/Computer";
import Room from "../models/Room";
import Lamp from "../models/Lamp";
import Books from "../models/Books";
import Paper from "../models/Paper";
import Pen from "../models/Pen";
import City from "../models/City";
import Office from "../models/Office";
import NightSky from "./environment/NightSky";
import Stars from "./environment/Stars";
import Moon from "./environment/Moon";
import NightLighting from "./environment/NightLighting";
import Ground from "./environment/Ground";
import FogEffect from "./environment/FogEffect";

export default function DeskScene() {
  return (
    <>
      <Stars />
      <Moon />
      <NightLighting />
      <Ground />
      <FogEffect />
      <Pen position={[0.3, -0.28, 4.3]} />
      <Desk position={[0, -1.1, 4.3]} />
      <Computer position={[0, -0.55, 5.2]} />
      <Lamp position={[0.5, -0.25, 4.2]} />
      <Books position={[-0.35, -0.25, 4.2]} />
      {/*
      <Office position={[0, -1, 5]} />
      <Desk position={[0, -0.7, 4.2]} />
      
      <Paper position={[0.1, -0.4, 4.3]} />
      <Pen position={[-0.2, -0.4, 4.2]} />
      */}
    </>
  );
}
