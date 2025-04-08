'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Text } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { ProjectType } from '@/app/dashboard/update/page'

// Types
type Project = ProjectType

type Portfolio = {
  aboutMe: string
  theme: string
  github: string
  linkedin: string
  projects: Project[]
}

type Props = {
  portfolio: Portfolio
}

// FloatingPlanet component with animation
const FloatingPlanet = ({ position, color = 'skyblue', project }: any) => {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    meshRef.current.rotation.y = clock.getElapsedTime() / 2
    meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.2
  })

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      <Text
        position={[position[0], position[1] + 2, position[2]]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {project.title}
      </Text>
    </group>
  )
}

export default function SpaceTheme({ portfolio }: Props) {
  return (
    <div className="w-screen h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 15], fov: 70 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade />

        <Suspense fallback={null}>
          {portfolio.projects.map((project, i) => (
            <FloatingPlanet
              key={project.id}
              project={project}
              position={[i * 4 - 6, 0, 0]}
              color={['#4a90e2', '#50e3c2', '#f5a623'][i % 3]}
            />
          ))}
        </Suspense>

        <OrbitControls 
          enableZoom={true}
          minDistance={5}
          maxDistance={20}
          enablePan={false}
        />
      </Canvas>
    </div>
  )
}
