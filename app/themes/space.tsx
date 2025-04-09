'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Text } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useRef, useState, useEffect, useMemo, forwardRef } from 'react'
import * as THREE from 'three'
import { ProjectType } from '@/app/dashboard/update/page'
import Image from 'next/image'
import { IntroductionScreen } from './intro-screen'
import { Portfolio } from '@/app/types/portfolio'

// Had to make this type alias to replace the project prop
type Project = ProjectType

type Props = {
  portfolio: Portfolio
}

// Custom star field for that sweet hyperspace effect
const HyperspaceStars = forwardRef<THREE.Points>((_, ref) => {
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices = []
    const colors = []
    
    // More stars near the camera for that depth effect
    for (let i = 0; i < 10000; i++) {
      const z = Math.random() * 20 - 10
      const x = (Math.random() - 0.5) * 2000
      const y = (Math.random() - 0.5) * 2000
      
      vertices.push(x, y, z)
      
      // Some color variation to make it look less boring
      const color = new THREE.Color()
      color.setHSL(Math.random() * 0.1 + 0.9, 0.5, Math.random() * 0.5 + 0.5)
      colors.push(color.r, color.g, color.b)
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    
    return geometry
  }, [])

  const starsMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    })
  }, [])

  return <points ref={ref} geometry={starsGeometry} material={starsMaterial} />
})

HyperspaceStars.displayName = 'HyperspaceStars'

// The warp through space transition effect when you click explore projects
const TransitionEffect = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0)
  const starsRef = useRef<THREE.Points>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const duration = 4000
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min(elapsed / duration, 1)
      setProgress(newProgress)
      
      if (newProgress < 1) {
        if (starsRef.current) {
          const speed = Math.pow(newProgress, 2.5) * 800
          starsRef.current.position.z = newProgress * speed
          starsRef.current.rotation.y += 0.001
        }
        requestAnimationFrame(animate)
      } else {
        onComplete()
      }
    }
    
    animate()
  }, [onComplete])

  return (
    <div className="absolute inset-0 bg-black z-20">
      <Canvas camera={{ position: [0, 0, 3], fov: 140 }} ref={canvasRef}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Suspense fallback={null}>
          <Stars
            ref={starsRef}
            radius={50}
            depth={30}
            count={30000}
            factor={1.5}
            saturation={0}
            fade
            speed={4}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

// The sun in the center of the solar system
const CentralStar = () => {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() / 3
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial 
          color="#ff6b6b"
          emissive="#ff6b6b"
          emissiveIntensity={0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <pointLight
        position={[0, 0, 0]}
        intensity={0.3}
        distance={20}
        decay={2}
        color="#ff6b6b"
      />
    </group>
  )
}

// Camera light to make sure we can see everything
const CameraLight = () => {
  return (
    <group>
      <pointLight
        position={[0, 0, 0]}
        intensity={1.5}
        distance={50}
        decay={1}
        color="#ffffff"
      />
    </group>
  )
}

// Modal that pops up when you click a project
const ProjectDetails = ({ project, onClose }: { project: ProjectType, onClose: () => void }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-900/90 p-8 rounded-lg max-w-4xl w-full mx-4 border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {project.imageURL && (
            <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
              <Image
                src={project.imageURL}
                alt={project.title}
                fill
                className="object-cover"
              />
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

// Each project is represented as a floating planet
const FloatingPlanet = ({ position, color = 'skyblue', project, onClick }: any) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const textRef = useRef<any>(null)

  useFrame((state) => {
    const { clock, camera } = state
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() / 4
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() / 2) * 0.5
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() / 2
    }
    if (textRef.current) {
      textRef.current.lookAt(camera.position)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh 
        ref={meshRef}
        onClick={onClick}
      >
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      <Text
        ref={textRef}
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

// The main component that puts everything together
export default function SpaceTheme({ portfolio }: Props) {
  const [showIntro, setShowIntro] = useState(true)
  const [showTransition, setShowTransition] = useState(false)
  const [showProjects, setShowProjects] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null)

  const handleStart = () => {
    setShowIntro(false)
    setShowTransition(true)
  }

  const handleTransitionComplete = () => {
    setShowTransition(false)
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

  // Calculate where to put each planet in a circle
  const getProjectPositions = (count: number) => {
    const radius = 10
    const positions = []
    // Add one extra spot for the About Me planet
    for (let i = 0; i < count + 1; i++) {
      const angle = (i / (count + 1)) * Math.PI * 2
      positions.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ])
    }
    return positions
  }

  const projectPositions = getProjectPositions(portfolio.projects.length)

  return (
    <div className="w-screen h-screen bg-black">
      {showIntro && <IntroductionScreen portfolio={portfolio} onStart={handleStart} />}
      {showTransition && <TransitionEffect onComplete={handleTransitionComplete} />}
      
      {showProjects && (
        <>
          <Canvas camera={{ position: [0, 5, 25], fov: 60 }}>
            <color attach="background" args={['#000000']} />
            <ambientLight intensity={0.02} />
            
            <Stars 
              radius={300} 
              depth={60} 
              count={20000} 
              factor={2}
              saturation={0} 
              fade 
              speed={1}
            />

            <Suspense fallback={null}>
              <CentralStar />
              <CameraLight />
              {/* About Me planet */}
              <FloatingPlanet
                position={projectPositions[0] as [number, number, number]}
                color="#ff6b6b"
                project={{ title: "About Me", id: "home" }}
                onClick={handleReturnToIntro}
              />
              {portfolio.projects.map((project, i) => (
                <FloatingPlanet
                  key={project.id}
                  project={project}
                  position={projectPositions[i + 1] as [number, number, number]}
                  color={['#4a90e2', '#50e3c2', '#f5a623'][i % 3]}
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </Suspense>

            <EffectComposer>
              <Bloom
                intensity={0.5}
                luminanceThreshold={0.1}
                luminanceSmoothing={0.9}
              />
            </EffectComposer>

            <OrbitControls 
              enableZoom={true}
              minDistance={15}
              maxDistance={30}
              enablePan={false}
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
