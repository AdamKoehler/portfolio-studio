'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, useGLTF, useProgress } from '@react-three/drei'
import { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'
import { ProjectType } from '@/app/dashboard/update/page'
import { IntroductionScreen } from './intro-screen'
import { Portfolio as PortfolioType } from '@/app/types/portfolio'
import { Progress } from '@/components/ui/progress'

// Camera controller component that must be inside Canvas
const CameraController = () => {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)

  useFrame(() => {
    if (controlsRef.current) {
      // If camera is below 2 units, adjust it
      if (camera.position.y < 2) {
        camera.position.y = 2
        controlsRef.current.update()
      }
    }
  })

  return (
    <OrbitControls 
      ref={controlsRef}
      enableZoom={true}
      minDistance={5}
      maxDistance={30}
      enablePan={false}
      minPolarAngle={Math.PI / 6} // looking down 30 degrees from horizontal
      maxPolarAngle={Math.PI / 2} // upper limit 90 degrees from horizontal
    />
  )
}

// Simple sky with gradient
const Sky = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[200, 32, 32]} />
      <meshBasicMaterial 
        color="#87CEEB" 
        side={THREE.BackSide}
        fog={false}
      />
    </mesh>
  )
}

// temporarily using this as a placeholder for projects until I create campsite meshes in blender
const ProjectPlaceholder = ({ position, project, onClick }: { 
  position: [number, number, number], 
  project: ProjectType, 
  onClick: () => void 
}) => {
  const groupRef = useRef<THREE.Group>(null!)
  const textRef = useRef<any>(null)
  const { scene } = useGLTF('/TentMesh.glb')

  useFrame((state) => {
    const { camera } = state
    
    // Keep text facing camera
    if (textRef.current) {
      textRef.current.lookAt(camera.position)
    }

    // Make tent face the center of the scene
    if (groupRef.current) {
      // Calculate direction to center
      const direction = new THREE.Vector3(0, 0, 0).sub(groupRef.current.position).normalize()
      // Calculate rotation angle
      const targetRotation = Math.atan2(direction.x, direction.z)
      // Apply rotation
      groupRef.current.rotation.y = targetRotation
    }
  })

  // Adjust the y position to be slightly lower
  const adjustedPosition: [number, number, number] = [position[0], position[1] - 0.5, position[2]]

  return (
    <group ref={groupRef} position={adjustedPosition}>
      <primitive 
        object={scene.clone()} 
        onClick={onClick}
        scale={[0.5, 0.5, 0.5]}
      />
      <Text
        ref={textRef}
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {project.title}
      </Text>
    </group>
  )
}

// progress component from shadcn/ui. large mesh from blender so it might be slow on mobile
const LoadingProgress = ({ progress }: { progress: number }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-green-900/80 backdrop-blur-sm">
      <div className="w-64 p-6 bg-green-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4 text-center">Loading Forest Scene</h2>
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-white text-center">{Math.round(progress)}%</p>
      </div>
    </div>
  )
}

// blender forest scene
const ForestScene = () => {
  const { scene } = useGLTF('/ForestScene.glb')
  const forestRef = useRef<THREE.Group>(null!)

  return (
    <group ref={forestRef}>
      <primitive object={scene} scale={[1, 1, 1]} />
    </group>
  )
}

// Project details modal
const ProjectDetails = ({ project, onClose }: { project: ProjectType, onClose: () => void }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-green-900/90 p-8 rounded-lg max-w-4xl w-full mx-4 border border-green-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-green-400 hover:text-white">
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
                className="inline-flex items-center text-green-400 hover:text-green-300"
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

// overall scene component that includes loading progress tracking and camera controls
const Scene = ({ projectPositions, portfolio, handleReturnToIntro, handleProjectClick }: {
  projectPositions: [number, number, number][],
  portfolio: PortfolioType,
  handleReturnToIntro: () => void,
  handleProjectClick: (project: ProjectType) => void
}) => {
  // Use the useProgress hook to get real loading progress
  const { progress } = useProgress()
  
  // Show loading UI until progress reaches 100%
  const isLoading = progress < 100

  return (
    <>
      {isLoading && <LoadingProgress progress={progress} />}
      
      <Canvas camera={{ position: [0, 5, 15], fov: 75 }}>
        <color attach="background" args={['#00000f']} />
        <fog attach="fog" args={['#D3D3D3', 20, 50]} />
        
        {/* Sky gradient */}
        <Sky />
        
        {/* Ambient light for general illumination */}
        <ambientLight intensity={0.3} />
        
        {/* Directional light to simulate sunlight */}
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1} 
          castShadow={true}
          color="#ffcc80"
        />

        <Suspense fallback={null}>
          <ForestScene />
          
          {/* About Me placeholder */}
          <ProjectPlaceholder
            position={projectPositions[0]}
            project={{ 
              title: "About Me", 
              id: "home",
              description: "Learn more about me",
              url: "#",
              imageURL: null
            }}
            onClick={handleReturnToIntro}
          />
          
          {/* Project placeholders */}
          {portfolio.projects.map((project, i) => (
            <ProjectPlaceholder
              key={project.id}
              project={project}
              position={projectPositions[i + 1]}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </Suspense>

        {/* Camera controller with position constraints */}
        <CameraController />
      </Canvas>
    </>
  )
}

interface ForestThemeProps {
  portfolio: PortfolioType
}

export default function ForestTheme({ portfolio }: ForestThemeProps) {
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

  // Calculate positions for project placeholders in a circle around the center
  function getProjectPositions(count: number): [number, number, number][] {
    const radius = 10
    const positions: [number, number, number][] = []
  
    for (let i = 0; i <= count; i++) {
      const angle = (i / (count + 1)) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const y = 1 // Height above ground
      const z = Math.sin(angle) * radius
      positions.push([x, y, z])
    }
  
    return positions
  }

  const projectPositions = getProjectPositions(portfolio.projects.length)

  return (
    <div className="w-screen h-screen bg-green-900">
      {showIntro && <IntroductionScreen portfolio={portfolio} onStart={handleStart} />}
      
      {showProjects && (
        <>
          <Scene 
            projectPositions={projectPositions}
            portfolio={portfolio}
            handleReturnToIntro={handleReturnToIntro}
            handleProjectClick={handleProjectClick}
          />
          
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
