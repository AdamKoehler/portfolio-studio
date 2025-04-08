'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { ProjectType } from '@/app/dashboard/update/page'

// Types
type Project = ProjectType

type Portfolio = {
  aboutMe: string | null
  theme: string
  github: string | null
  linkedin: string | null
  projects: Project[]
  owner: {
    image: string | null
  }
}

type Props = {
  portfolio: Portfolio
}

// FloatingBubble component with animation
const FloatingBubble = ({ position, color = 'skyblue', project }: any) => {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    meshRef.current.rotation.y = clock.getElapsedTime() / 2
    meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.2
  })

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      <Text
        position={[position[0], position[1] + 1.5, position[2]]}
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

// Water surface effect
const WaterSurface = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[100, 100, 32, 32]} />
      <meshStandardMaterial 
        color="#1a365d"
        transparent
        opacity={0.8}
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
  )
}

export default function OceanTheme({ portfolio }: Props) {
  return (
    <div className="w-screen h-screen bg-blue-900">
      <Canvas camera={{ position: [0, 0, 15], fov: 70 }}>
        <color attach="background" args={['#0a192f']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.5} penumbra={1} />

        <Suspense fallback={null}>
          <WaterSurface />
          {portfolio.projects.map((project, i) => (
            <FloatingBubble
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
