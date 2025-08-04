"use client"
import { Canvas } from "@react-three/fiber"
import type React from "react"

import { Suspense, useState, useEffect, useRef } from "react"
import { OrbitControls } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, ExternalLink, ChevronDown } from "lucide-react"
import { useFrame } from "@react-three/fiber"
import type { Mesh } from "three"
import { Box, Torus, Sphere, Icosahedron, Octahedron, Text } from "@react-three/drei"

// Glitch Text Effect Component
function GlitchText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div className={`${isGlitching ? "animate-pulse" : ""}`}>{children}</div>
      {isGlitching && (
        <>
          <div className="absolute inset-0 text-red-500 opacity-70 translate-x-1">{children}</div>
          <div className="absolute inset-0 text-blue-500 opacity-70 -translate-x-1">{children}</div>
        </>
      )}
    </div>
  )
}

// 3D Background Scene Component
function CyberpunkScene() {
  const meshRef = useRef<Mesh>(null)
  const torusRef = useRef<Mesh>(null)
  const sphereRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.elapsedTime * 0.1
      torusRef.current.rotation.z = state.clock.elapsedTime * 0.4
    }
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5
    }
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} color="#00ffff" intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#ff00ff" intensity={0.5} />

      <Box ref={meshRef} position={[-2, 0, 0]} args={[1, 1, 1]}>
        <meshStandardMaterial color="#00ffff" wireframe />
      </Box>

      <Torus ref={torusRef} position={[2, 1, -1]} args={[0.5, 0.2, 16, 100]}>
        <meshStandardMaterial color="#ff00ff" wireframe />
      </Torus>

      <Sphere ref={sphereRef} position={[0, -1, -2]} args={[0.5, 32, 32]}>
        <meshStandardMaterial color="#ffff00" wireframe />
      </Sphere>
    </>
  )
}

// Interactive 3D Model Component
function Interactive3DModel() {
  const mainModelRef = useRef<Mesh>(null)
  const orbitingModelsRef = useRef<Mesh[]>([])
  const [isHovered, setIsHovered] = useState(false)

  useFrame((state) => {
    if (mainModelRef.current) {
      mainModelRef.current.rotation.x = state.clock.elapsedTime * 0.3
      mainModelRef.current.rotation.y = state.clock.elapsedTime * 0.2
      mainModelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }

    // Animate orbiting models
    orbitingModelsRef.current.forEach((model, index) => {
      if (model) {
        const angle = state.clock.elapsedTime + (index * Math.PI * 2) / 3
        const radius = 3
        model.position.x = Math.cos(angle) * radius
        model.position.z = Math.sin(angle) * radius
        model.position.y = Math.sin(state.clock.elapsedTime + index) * 0.5
        model.rotation.x = state.clock.elapsedTime * 0.5
        model.rotation.y = state.clock.elapsedTime * 0.3
      }
    })
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} color="#00ffff" intensity={1.5} />
      <pointLight position={[-10, -10, -10]} color="#ff00ff" intensity={1} />
      <pointLight position={[0, 10, 0]} color="#ffff00" intensity={0.8} />

      {/* Main central model */}
      <Icosahedron
        ref={mainModelRef}
        args={[1.5, 0]}
        position={[0, 0, 0]}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
      >
        <meshStandardMaterial color={isHovered ? "#ff00ff" : "#00ffff"} wireframe transparent opacity={0.8} />
      </Icosahedron>

      {/* Orbiting models */}
      {[0, 1, 2].map((index) => (
        <Octahedron
          key={index}
          ref={(el) => {
            if (el) orbitingModelsRef.current[index] = el
          }}
          args={[0.5, 0]}
        >
          <meshStandardMaterial
            color={index === 0 ? "#00ffff" : index === 1 ? "#ff00ff" : "#ffff00"}
            wireframe
            transparent
            opacity={0.6}
          />
        </Octahedron>
      ))}

      {/* Floating text */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.5}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        INTERACTIVE 3D
      </Text>
    </>
  )
}

// Neon Border Component
function NeonCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-black rounded-lg">{children}</div>
    </div>
  )
}

// Cyberpunk Loading Screen Component
function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [glitchText, setGlitchText] = useState("INITIALIZING...")
  const [showStartButton, setShowStartButton] = useState(false)

  const loadingPhases = [
    "INITIALIZING NEURAL NETWORK...",
    "LOADING QUANTUM PROCESSORS...",
    "ESTABLISHING SECURE CONNECTION...",
    "CALIBRATING HOLOGRAPHIC DISPLAY...",
    "SYNCHRONIZING DATA STREAMS...",
    "ACTIVATING CYBERNETIC INTERFACE...",
    "SYSTEM READY - WELCOME TO THE GRID",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          setShowStartButton(true)
          setGlitchText("SYSTEM READY - CLICK TO ENTER")
          return 100
        }
        return newProgress
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const phaseInterval = setInterval(() => {
      setCurrentPhase((prev) => {
        const nextPhase = (prev + 1) % loadingPhases.length
        setGlitchText(loadingPhases[nextPhase])
        return nextPhase
      })
    }, 800)

    return () => clearInterval(phaseInterval)
  }, [])

  // Matrix rain effect
  const MatrixRain = () => {
    const columns = Array.from({ length: 50 }, (_, i) => (
      <div
        key={i}
        className="absolute top-0 text-green-400 opacity-30 animate-pulse"
        style={{
          left: `${i * 2}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${2 + Math.random() * 3}s`,
        }}
      >
        {Array.from({ length: 20 }, (_, j) => (
          <div
            key={j}
            className="text-xs font-mono"
            style={{
              animationDelay: `${j * 0.1}s`,
            }}
          >
            {Math.random() > 0.5 ? "1" : "0"}
          </div>
        ))}
      </div>
    ))
    return <div className="absolute inset-0 overflow-hidden">{columns}</div>
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      <MatrixRain />

      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="cyber-grid h-full w-full animate-pulse"></div>
      </div>

      {/* Central loading interface */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Main logo with glitch effect */}
        <div className="mb-12">
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              TECH.ARTIST
            </h1>
            {/* Glitch overlay */}
            <div className="absolute inset-0 text-6xl md:text-8xl font-bold text-red-500 opacity-30 animate-ping">
              TECH.ARTIST
            </div>
          </div>
        </div>

        {/* Loading progress circle */}
        <div className="relative mb-8">
          <svg className="w-32 h-32 mx-auto transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" stroke="rgba(0, 255, 255, 0.2)" strokeWidth="2" fill="none" />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - loadingProgress / 100)}`}
              className="transition-all duration-300 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ffff" />
                <stop offset="50%" stopColor="#ff00ff" />
                <stop offset="100%" stopColor="#ffff00" />
              </linearGradient>
            </defs>
          </svg>

          {/* Progress percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-cyan-400 font-mono">{Math.round(loadingProgress)}%</span>
          </div>
        </div>

        {/* Loading progress bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out relative"
              style={{ width: `${loadingProgress}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Status text with glitch effect */}
        <div className="mb-8">
          <div className="relative">
            <p className="text-lg font-mono text-cyan-300 animate-pulse">{glitchText}</p>
            {/* Glitch overlay for text */}
            <p className="absolute inset-0 text-lg font-mono text-red-500 opacity-50 animate-ping">{glitchText}</p>
          </div>
        </div>

        {/* System diagnostics */}
        <div className="grid grid-cols-2 gap-4 text-sm font-mono">
          <div className="text-left">
            <div className="text-green-400 mb-1">
              <span className="animate-pulse">●</span> NEURAL NET: ONLINE
            </div>
            <div className="text-green-400 mb-1">
              <span className="animate-pulse">●</span> QUANTUM CORE: ACTIVE
            </div>
            <div className="text-yellow-400 mb-1">
              <span className="animate-pulse">●</span> HOLOGRAM: LOADING
            </div>
          </div>
          <div className="text-left">
            <div className="text-green-400 mb-1">
              <span className="animate-pulse">●</span> FIREWALL: SECURE
            </div>
            <div className="text-green-400 mb-1">
              <span className="animate-pulse">●</span> DATA STREAM: STABLE
            </div>
            <div className="text-cyan-400 mb-1">
              <span className="animate-pulse">●</span> INTERFACE: READY
            </div>
          </div>
        </div>

        {/* Start Button */}
        {showStartButton && (
          <div className="mt-8 animate-pulse">
            <button
              onClick={onLoadingComplete}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold text-lg rounded-lg border border-cyan-500 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50"
            >
              <span className="flex items-center space-x-2">
                <span>ENTER THE GRID</span>
                <span className="text-xl">→</span>
              </span>
            </button>
            <p className="text-xs text-gray-500 mt-2 font-mono">CLICK TO ACCESS PORTFOLIO</p>
          </div>
        )}

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 text-cyan-400 font-mono text-xs opacity-50">
        SYSTEM_ID: CYBER_PORTFOLIO_v2.1
      </div>
      <div className="absolute top-4 right-4 text-cyan-400 font-mono text-xs opacity-50">
        {new Date().toISOString().slice(0, 19)}
      </div>
      <div className="absolute bottom-4 left-4 text-cyan-400 font-mono text-xs opacity-50">SECURITY_LEVEL: MAXIMUM</div>
      <div className="absolute bottom-4 right-4 text-cyan-400 font-mono text-xs opacity-50">CONNECTION: ENCRYPTED</div>
    </div>
  )
}

export default function CyberpunkPortfolio() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("hero")

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: "smooth" })
    setActiveSection(sectionId)
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-cyan-500/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <GlitchText>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                TECH.ARTIST
              </h1>
            </GlitchText>
            <div className="flex space-x-6">
              {["hero", "model", "about", "skills", "projects", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`text-sm uppercase tracking-wider transition-colors hover:text-cyan-400 ${
                    activeSection === section ? "text-cyan-400" : "text-gray-400"
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Suspense fallback={null}>
              <CyberpunkScene />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Suspense>
          </Canvas>
        </div>

        <div className="relative z-10 text-center">
          <GlitchText>
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ALEX CYBER
            </h1>
          </GlitchText>
          <div className="text-xl md:text-2xl mb-8 text-cyan-300 font-mono">
            {"<"} TECHNICAL ARTIST {"/>"}
          </div>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-300">
            Bridging the gap between art and technology through immersive 3D experiences, procedural generation, and
            cutting-edge visual effects.
          </p>
          <Button
            onClick={() => scrollToSection("projects")}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 text-lg"
          >
            VIEW PROJECTS
          </Button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-cyan-400" />
        </div>
      </section>

      {/* Interactive 3D Model Section */}
      <section id="model" className="relative h-screen flex items-center justify-center bg-gray-900/30">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <Suspense fallback={null}>
              <Interactive3DModel />
              <OrbitControls enableZoom={true} enablePan={true} />
            </Suspense>
          </Canvas>
        </div>

        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 text-center">
          <GlitchText>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              3D.SHOWCASE
            </h2>
          </GlitchText>
          <p className="text-lg text-gray-300 mt-4 font-mono">
            {">"} DRAG TO ROTATE • SCROLL TO ZOOM {"<"}
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-center">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/30">
            <p className="text-sm text-cyan-400 font-mono mb-2">REAL-TIME RENDERING</p>
            <div className="flex space-x-4 text-xs text-gray-400">
              <span>WebGL</span>
              <span>•</span>
              <span>Three.js</span>
              <span>•</span>
              <span>React Fiber</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <GlitchText>
            <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ABOUT.EXE
            </h2>
          </GlitchText>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg mb-6 text-gray-300 leading-relaxed">
                I'm a technical artist with 5+ years of experience creating immersive digital experiences. My expertise
                spans 3D modeling, procedural generation, shader programming, and real-time rendering.
              </p>
              <p className="text-lg mb-6 text-gray-300 leading-relaxed">
                I specialize in pushing the boundaries of what's possible in real-time graphics, combining artistic
                vision with technical innovation to create stunning visual experiences.
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black bg-transparent"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-black bg-transparent"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </div>

            <NeonCard>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-cyan-400">CORE.STATS</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Experience</span>
                    <span className="text-white font-mono">5+ Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Projects Completed</span>
                    <span className="text-white font-mono">50+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coffee Consumed</span>
                    <span className="text-white font-mono">∞</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-400 font-mono animate-pulse">ONLINE</span>
                  </div>
                </div>
              </div>
            </NeonCard>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <GlitchText>
            <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              SKILLS.JSON
            </h2>
          </GlitchText>

          <div className="grid md:grid-cols-3 gap-8">
            <NeonCard>
              <Card className="bg-transparent border-none">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6 text-cyan-400">3D & MODELING</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { name: "Blender", icon: "🎨" },
                      { name: "Maya", icon: "🏗️" },
                      { name: "Houdini", icon: "⚡" },
                      { name: "ZBrush", icon: "🗿" },
                      { name: "Substance", icon: "🎭" },
                      { name: "Cinema4D", icon: "🎬" },
                    ].map((skill, index) => (
                      <div
                        key={skill.name}
                        className="group relative flex flex-col items-center p-3 rounded-lg bg-gray-800/50 hover:bg-cyan-500/20 transition-all duration-300 cursor-pointer transform hover:scale-110 hover:rotate-3"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="text-2xl mb-2 group-hover:animate-bounce transition-transform duration-300 group-hover:text-cyan-400">
                          {skill.icon}
                        </div>
                        <span className="text-xs text-center text-gray-300 group-hover:text-cyan-400 transition-colors duration-300 font-mono">
                          {skill.name}
                        </span>
                        {/* Glowing border effect */}
                        <div className="absolute inset-0 rounded-lg border border-cyan-500/0 group-hover:border-cyan-500/50 transition-all duration-300"></div>
                        {/* Particle effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {Array.from({ length: 3 }, (_, i) => (
                            <div
                              key={i}
                              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                              style={{
                                left: `${20 + i * 30}%`,
                                top: `${20 + i * 20}%`,
                                animationDelay: `${i * 0.2}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </NeonCard>

            <NeonCard>
              <Card className="bg-transparent border-none">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6 text-purple-400">PROGRAMMING</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { name: "Python", icon: "🐍" },
                      { name: "C#", icon: "⚙️" },
                      { name: "HLSL", icon: "🌈" },
                      { name: "JavaScript", icon: "⚡" },
                      { name: "React", icon: "⚛️" },
                      { name: "Three.js", icon: "🎯" },
                    ].map((skill, index) => (
                      <div
                        key={skill.name}
                        className="group relative flex flex-col items-center p-3 rounded-lg bg-gray-800/50 hover:bg-purple-500/20 transition-all duration-300 cursor-pointer transform hover:scale-110 hover:rotate-3"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="text-2xl mb-2 group-hover:animate-bounce transition-transform duration-300 group-hover:text-purple-400">
                          {skill.icon}
                        </div>
                        <span className="text-xs text-center text-gray-300 group-hover:text-purple-400 transition-colors duration-300 font-mono">
                          {skill.name}
                        </span>
                        {/* Glowing border effect */}
                        <div className="absolute inset-0 rounded-lg border border-purple-500/0 group-hover:border-purple-500/50 transition-all duration-300"></div>
                        {/* Particle effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {Array.from({ length: 3 }, (_, i) => (
                            <div
                              key={i}
                              className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
                              style={{
                                left: `${20 + i * 30}%`,
                                top: `${20 + i * 20}%`,
                                animationDelay: `${i * 0.2}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </NeonCard>

            <NeonCard>
              <Card className="bg-transparent border-none">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6 text-pink-400">ENGINES & TOOLS</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { name: "Unity", icon: "🎮" },
                      { name: "Unreal", icon: "🚀" },
                      { name: "WebGL", icon: "🌐" },
                      { name: "Shader Graph", icon: "🔗" },
                      { name: "Git", icon: "📝" },
                      { name: "Perforce", icon: "🔄" },
                    ].map((skill, index) => (
                      <div
                        key={skill.name}
                        className="group relative flex flex-col items-center p-3 rounded-lg bg-gray-800/50 hover:bg-pink-500/20 transition-all duration-300 cursor-pointer transform hover:scale-110 hover:rotate-3"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="text-2xl mb-2 group-hover:animate-bounce transition-transform duration-300 group-hover:text-pink-400">
                          {skill.icon}
                        </div>
                        <span className="text-xs text-center text-gray-300 group-hover:text-pink-400 transition-colors duration-300 font-mono">
                          {skill.name}
                        </span>
                        {/* Glowing border effect */}
                        <div className="absolute inset-0 rounded-lg border border-pink-500/0 group-hover:border-pink-500/50 transition-all duration-300"></div>
                        {/* Particle effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {Array.from({ length: 3 }, (_, i) => (
                            <div
                              key={i}
                              className="absolute w-1 h-1 bg-pink-400 rounded-full animate-ping"
                              style={{
                                left: `${20 + i * 30}%`,
                                top: `${20 + i * 20}%`,
                                animationDelay: `${i * 0.2}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </NeonCard>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <GlitchText>
            <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              PROJECTS.DB
            </h2>
          </GlitchText>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Neural Network Visualizer",
                description: "Interactive 3D visualization of neural network architectures with real-time data flow.",
                tech: ["Three.js", "WebGL", "Python"],
                color: "cyan",
              },
              {
                title: "Procedural City Generator",
                description: "Algorithmic city generation system with customizable parameters and real-time rendering.",
                tech: ["Houdini", "Unity", "C#"],
                color: "purple",
              },
              {
                title: "Holographic UI System",
                description: "Futuristic interface components with particle effects and smooth animations.",
                tech: ["React", "GLSL", "WebGL"],
                color: "pink",
              },
              {
                title: "Quantum Particle Simulator",
                description: "Physics-based particle system simulating quantum mechanical behaviors.",
                tech: ["Unity", "Compute Shaders", "C#"],
                color: "cyan",
              },
              {
                title: "AR Data Visualization",
                description: "Augmented reality application for visualizing complex datasets in 3D space.",
                tech: ["ARCore", "Unity", "Python"],
                color: "purple",
              },
              {
                title: "Cyberpunk Environment",
                description: "Fully realized cyberpunk cityscape with dynamic lighting and weather systems.",
                tech: ["Unreal", "Blueprints", "Substance"],
                color: "pink",
              },
            ].map((project, index) => (
              <NeonCard key={index} className="group">
                <Card className="bg-transparent border-none h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${
                          project.color === "cyan"
                            ? "from-cyan-400 to-cyan-600"
                            : project.color === "purple"
                              ? "from-purple-400 to-purple-600"
                              : "from-pink-400 to-pink-600"
                        } animate-pulse`}
                      ></div>
                    </div>
                    <h3
                      className={`text-xl font-bold mb-2 ${
                        project.color === "cyan"
                          ? "text-cyan-400"
                          : project.color === "purple"
                            ? "text-purple-400"
                            : "text-pink-400"
                      }`}
                    >
                      {project.title}
                    </h3>
                    <p className="text-gray-300 mb-4 flex-grow">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="secondary" className="bg-gray-800 text-gray-300">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className={`w-full border-${project.color}-500 text-${project.color}-400 hover:bg-${project.color}-500 hover:text-black`}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Project
                    </Button>
                  </CardContent>
                </Card>
              </NeonCard>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gray-900/50">
        <div className="container mx-auto max-w-4xl text-center">
          <GlitchText>
            <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              CONTACT.SYS
            </h2>
          </GlitchText>

          <p className="text-xl mb-12 text-gray-300">
            Ready to create something extraordinary? Let's connect and build the future together.
          </p>

          <NeonCard className="max-w-md mx-auto">
            <div className="p-8">
              <div className="space-y-6">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  alex@techartist.dev
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black bg-transparent"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub Portfolio
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-black bg-transparent"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn Profile
                </Button>
              </div>
            </div>
          </NeonCard>

          <div className="mt-12 text-center">
            <p className="text-gray-500 font-mono">
              {">"} STATUS: AVAILABLE FOR PROJECTS {"<"}
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-cyan-500/30">
        <div className="container mx-auto text-center">
          <p className="text-gray-500 font-mono">© 2024 ALEX CYBER - TECHNICAL ARTIST - ALL RIGHTS RESERVED</p>
        </div>
      </footer>
    </div>
  )
}
