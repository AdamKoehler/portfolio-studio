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

// FloatingTree component with animation
const FloatingTree = ({ position, color = 'green', project }: any) => {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() / 2
    groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 0.2
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Tree trunk */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Tree top */}
      <mesh position={[0, 0.5, 0]}>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[0, 2, 0]}
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

// Ground plane
const Ground = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[100, 100, 32, 32]} />
      <meshStandardMaterial 
        color="#2d5a27"
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  )
}

export default function ForestTheme({ portfolio }: Props) {
  return (
    <div className="w-screen h-screen bg-green-900">
      <Canvas camera={{ position: [0, 0, 15], fov: 70 }}>
        <color attach="background" args={['#1a472a']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.5} penumbra={1} />

        <Suspense fallback={null}>
          <Ground />
          {portfolio.projects.map((project, i) => (
            <FloatingTree
              key={project.id}
              project={project}
              position={[i * 4 - 6, 0, 0]}
              color={['#2d5a27', '#3a7d44', '#4a9e5f'][i % 3]}
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
