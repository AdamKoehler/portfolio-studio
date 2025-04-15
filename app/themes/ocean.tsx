'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, useGLTF } from '@react-three/drei'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'
import { ProjectType } from '@/app/dashboard/update/page'
import { IntroductionScreen } from './intro-screen'
import { Portfolio as PortfolioType } from '@/app/types/portfolio'

interface FloatingBubbleProps {
  position: [number, number, number]
  color?: string
  project: ProjectType
  onClick: () => void
}

const FloatingBubble = ({ position, color, project, onClick }: FloatingBubbleProps) => {
  // since bubbles are going to be different count for other people depending on how many projects they have
  // the project bubble component can be called multiple times without collision of bubbles
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const textRef = useRef<any>(null)

  // Every frame update, the bubble position is updated to orbit around the volcano
  useFrame((state) => {
    const { clock, camera } = state
    if (groupRef.current) {
      // Circular orbit around the volcano
      const radius = 15
      const angle = clock.getElapsedTime() * 0.15
      // instead of using frame rate to calculate position, clock returns the time since the scene was loaded
      // if we used frame rate to calculate position then the bubbles would move faster or slower depending on high or low frames
      groupRef.current.position.x = Math.cos(angle + position[0]) * radius
      groupRef.current.position.z = Math.sin(angle + position[0]) * radius
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() + position[0]) * 1
    }
    
    // Keep text facing camera
    if (textRef.current) {
      textRef.current.lookAt(camera.position)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      <Text
        ref={textRef}
        position={[0, 2.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {project.title}
      </Text>
    </group>
  )
}

const Volcano = () => {
  const { scene } = useGLTF('/volcano.glb') // stored in public folder
  const meshRef = useRef<THREE.Mesh>(null!)

  return (
    <group position={[0, -25, 0]}>
      <primitive object={scene} ref={meshRef} scale={[4,4,4]} />

      {/* blue light coming from surface to hit the top of bubbles and add depth */}
      <pointLight
        position={[0, 80, 0]}
        intensity={3}
        distance={60}
        decay={0.1}
        color="#0000ff"
      />
      
      {/* light at tip of volcano to make surroundings glow */}
      <pointLight
        position={[0,30,0]}
        intensity={4}
        distance={100}
        decay={0.4}
        color="#ff4500"
      />
    </group>
  )
}

interface ProjectDetailsProps {
  project: ProjectType
  onClose: () => void
}

const ProjectDetails = ({ project, onClose }: ProjectDetailsProps) => {
  // when a bubble is clicked, a div is displayed showing project details
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-blue-900/90 p-8 rounded-lg max-w-4xl w-full mx-4 border border-blue-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-blue-400 hover:text-white">
          ✕
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.imageURL && (
            <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
              <img src={project.imageURL} alt={project.title} className="object-cover w-full h-full" />
            </div>
          )}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-white mb-4">{project.title}</h2>
            {project.description && (
              <p className="text-gray-300 mb-4">{project.description}</p>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300"
              >
                View Project →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface BubblePosition {
  x: number
  y: number
  z: number
  speed: number
  scale: number
}

const Bubbles = () => { // randomly generated bubbles coming from the volcano
  const bubbles = useRef<THREE.Group>(null!)
  const [bubblePositions] = useState<BubblePosition[]>(() => {
    // Initialize random bubble positions in a circle
    return Array.from({ length: 50 }, () => ({
      x: Math.cos(Math.random() * Math.PI * 2) * 15,
      y: -5,
      z: Math.sin(Math.random() * Math.PI * 2) * 15,
      speed: 0.5 + Math.random() * 0.5,
      scale: 0.2 + Math.random() * 0.3,
    }))
  })

  // every frame there is a check to make sure bubbles are within a defined range
  // if they are not, the bubble is reset to a random position in the defined radius
  // the bubble is also given a random speed ,size, and drift 
  useFrame((state) => {
    if (bubbles.current) {
      bubbles.current.children.forEach((bubble, index) => {
        const pos = bubblePositions[index]
        
        // Move bubble upward
        bubble.position.y += pos.speed * 0.05
        
        // if bubbles reach top of screen, reset position to random position in circle
        if (bubble.position.y > 50) {
          const radius = Math.random() * 15
          const angle = Math.random() * Math.PI * 2
          bubble.position.x = Math.cos(angle) * radius
          bubble.position.y = -5
          bubble.position.z = Math.sin(angle) * radius
        }
        
        // smooth bubble drift using time as a constant so that bubble positions dont jump too far
        // movement range of -0.01 to 0.01
        bubble.position.x += Math.sin(state.clock.elapsedTime + index) * 0.01 
        bubble.position.z += Math.sin(state.clock.elapsedTime + index) * 0.01
      })
    }
  })

  return (
    <group ref={bubbles}>
      {bubblePositions.map((pos, index) => (
        <mesh key={index} position={[pos.x, pos.y, pos.z]} scale={[pos.scale, pos.scale, pos.scale]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

interface OceanThemeProps {
  portfolio: PortfolioType
}

export default function OceanTheme({ portfolio }: OceanThemeProps) {
  const [showIntro, setShowIntro] = useState(true)
  const [showProjects, setShowProjects] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null)

  const handleStart = () => {
    setShowIntro(false)
    setShowProjects(true)
  }

  const handleProjectClick = (project: ProjectType) => {
    setSelectedProject(project)
  }

  const handleCloseDetails = () => {
    setSelectedProject(null)
  }

  const handleReturnToIntro = () => {
    setShowProjects(false)
    setShowIntro(true)
  }

  // Calculate positions for project bubbles in a circle
  function getBubblePositions(bubbleCount: number) {
    const positions = []
  
    for (let i = 0; i <= bubbleCount; i++) {
      const angle = (i / (bubbleCount + 1)) * Math.PI * 2
      positions.push([angle, 5, 0]) // angle, fixed height, z is 0
    }
  
    return positions
  }

  const bubblePositions = getBubblePositions(portfolio.projects.length)

  return (
    <div className="w-screen h-screen bg-blue-900">
      {showIntro && <IntroductionScreen portfolio={portfolio} onStart={handleStart} />}
      
      {showProjects && (
        <>
          <Canvas camera={{ position: [0, 10, 30], fov: 70 }}>
            <color attach="background" args={['#0a192f']} />
            <fog attach="fog" args={['#0a192f', 20, 150]} />
            
            {/* ambient lighting is kept low to help colors pop */}
            <ambientLight intensity={0.1} />

            {/* blue light coming from top of the scene to add depth */}
            <spotLight 
              position={[0, 20, 0]} 
              intensity={3} 
              angle={0.3} 
              penumbra={0.5}
              distance={80}
              decay={1}
              color="#0000ff"
            />

            {/* red light coming from the tip of volcano to light up project bubbles */}
            <spotLight 
              position={[0, -10, 0]} 
              intensity={2} 
              angle={0.5} 
              penumbra={0.5}
              distance={50}
              decay={1}
              color="#ff0000"
            />

            <Suspense fallback={null}>
              <Volcano />
              <Bubbles />
              <FloatingBubble
                position={bubblePositions[0] as [number, number, number]}
                color="#ffffff"
                project={{ 
                  title: "About Me", 
                  id: "home",
                  description: "Learn more about me",
                  url: "#",
                  imageURL: null
                }}
                onClick={handleReturnToIntro}
              />
              {portfolio.projects.map((project, i) => (
                <FloatingBubble
                  key={project.id}
                  project={project}
                  position={bubblePositions[i + 1] as [number, number, number]}
                  color={['#4a90e2', '#50e3c2', '#f5a623'][i % 3]}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </Suspense>

            {/* Camera controls, limited camera movement so that the user cant go under the volcano mesh */}
            <OrbitControls 
              enableZoom={true}
              minDistance={10}
              maxDistance={80}
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
          {selectedProject && (
            <ProjectDetails 
              project={selectedProject} 
              onClose={handleCloseDetails}
            />
          )}
        </>
      )}
    </div>
  )
}
