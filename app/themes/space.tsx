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
import { useLoader } from '@react-three/fiber'

type Project = ProjectType

type Props = {
  portfolio: Portfolio
}

// population of 10000 random stars for the background
const HyperspaceStars = forwardRef<THREE.Points>((_, ref) => {
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices = []
    const colors = []
    
    // generation of star positions and colors
    for (let i = 0; i < 10000; i++) {
      // xyz regenerates each iteration to create a random star position
      const z = Math.random() * 20 - 10
      const x = (Math.random() - 0.5) * 2000
      const y = (Math.random() - 0.5) * 2000
      
      vertices.push(x, y, z)
      
      // each star is assigned a random color
      // hsl: hue, saturation, lightness
      // h: Hue (0 to 1, 0.3= red, 0.6 =yellow etc.)
      // s: Saturation (0 to 1, where 0 is grayscale and 1 is full color)
      // l: Lightness (0 to 1, where 0 is black, 1 is white)
      const color = new THREE.Color()
      color.setHSL(Math.random() * 0.1 + 0.9, 0.5, Math.random() * 0.5 + 0.5)
      colors.push(color.r, color.g, color.b)
    }
    // geometry position and color reads from vertice and color arrays that are defined in the for loop above
    // each array has 10,000 elements and each element has 3 values [[x,y,z], [x,y,z], [x,y,z], ...] or [[r,g,b], [r,g,b], [r,g,b], ...]
    
    // so to optimize rendering this many values with sub values, we can store them in a buffer and group them in groups of 3
    // so [0,1,2,3,4,5,6,7,8,9,0,1] is now read as [[0,1,2], [3,4,5], [6,7,8], [9,0,1]] to represent vertice and RGB color assignment
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    
    return geometry
  }, [])

  const starsMaterial = useMemo(() => { 
    // use memo caches the definition of our star material
    // star material is created once and then react reuses it without recreating it on every render
    return new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    })
  }, []) // [] dependency: tells react to never re-run unless the component is remounted

  return <points ref={ref} geometry={starsGeometry} material={starsMaterial} />
})

HyperspaceStars.displayName = 'HyperspaceStars'

// The warp through space transition effect when you click explore projects
const TransitionEffect = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0)
  const starsRef = useRef<THREE.Points>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => { // once the component mounts the transition starts
    const duration = 4000 // 4 seconds
    const startTime = Date.now()
    
    const animate = () => {
      // this function is called every frame to determine how much time has passed
      // once animation is at 4000ms the new progress is set to 1 to signal completion
      const elapsed = Date.now() - startTime
      const newProgress = Math.min(elapsed / duration, 1)
      setProgress(newProgress)
      
      if (newProgress < 1) { // each frame we want to see if the animation is complete
        if (starsRef.current) { // if not complete we want to move the stars so that it appears that the viewer is moving
          const speed = Math.pow(newProgress, 2.5) * 800 // speed changes depending on newProgress value
          starsRef.current.position.z = newProgress * speed // the further along in the animation the faster it appears
          starsRef.current.rotation.y += 0.0005
          starsRef.current.rotation.x += 0.0005
        }
        requestAnimationFrame(animate) // if animation isnt complete requestAnimationFrame is called to run the animate function before the next browser repaint 
      } else { // animation is done we we can call onComplete (calls handleTransitionComplete function to change state of what to show)
        onComplete()
      }
    }
    
    animate() // starts the animation once the component mounts ^
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
            radius={100}
            depth={500}
            count={30000}
            factor={10}
            saturation={0}
            fade
            speed={4}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

// The sun in the center of the scene
const Sun = () => {
  const texture = useLoader(THREE.TextureLoader, '/sunTexture.jpg')

  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() / 3
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial 
          map={texture}
          emissive="#ffaa00"
          emissiveIntensity={1.5}
          roughness={0.2}
          metalness={0.8}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, 0, 0]}
        intensity={1}
        distance={40}
        decay={1.5}
        color="#ffaa00"
      />
    </group>
  )
}

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

// Div that pops up a display of project details when you click a project
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

// Each project is represented as a sphere mesh like a planet
const FloatingPlanet = ({ position, color = 'skyblue', project, onClick }: any) => {
  const meshRef = useRef<THREE.Mesh>(null!) // the planet sphere itself
  const groupRef = useRef<THREE.Group>(null!) // the wrapper around the planet + text
  const textRef = useRef<any>(null) // text displaying the project title

  useFrame((state) => { // use frame hook runs every frame to update the planet's position and rotation
    const { clock, camera } = state
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() / 4
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() / 2) * 0.5
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() / 2
    }
    if (textRef.current) {
      textRef.current.lookAt(camera.position) // label always faces the camera
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
          <Canvas camera={{ position: [0, 5, 25], fov: 70 }}>
            <color attach="background" args={['#000000']} />
            <ambientLight intensity={0.02} />
            
            <Stars 
              radius={60} 
              depth={100} 
              count={10000} 
              factor={4}
              saturation={80} 
              fade 
              speed={2}
            />

            <Suspense fallback={null}>
              <Sun />
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
