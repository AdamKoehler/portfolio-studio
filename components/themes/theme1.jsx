"use client"; // Ensure this runs only in the browser

import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
const themes = [
  { id: "theme1", color: "red" },
  { id: "theme2", color: "blue" },
  { id: "theme3", color: "green" },
];

const ThemePanel = ({ position, color, onClick }) => {
  return (
    <mesh position={position} onClick={onClick}>
      <boxGeometry args={[2, 1, 0.1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const ThemeCarousel = ({ setSelectedTheme }) => {
  const groupRef = useRef();
  const [rotation, setRotation] = useState(0);

  // Rotate the carousel slowly
  useFrame(() => {
    groupRef.current.rotation.y += 0.005;
  });

  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} />

      <group ref={groupRef}>
        {themes.map((theme, index) => {
          const angle = (index / themes.length) * Math.PI * 2;
          const x = Math.cos(angle) * 3;
          const z = Math.sin(angle) * 3;

          return (
            <ThemePanel
              key={theme.id}
              position={[x, 0, z]}
              color={theme.color}
              onClick={() => setSelectedTheme(theme.id)}
            />
          );
        })}
      </group>

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};

export default ThemeCarousel;
