"use client"

import { useEffect, useState } from "react"

interface WeatherParticlesProps {
  weatherType: "sunny" | "rainy" | "cloudy" | "snowy" | "stormy" | "foggy" | "windy" | "clear"
  intensity?: "low" | "medium" | "high"
}

export function WeatherParticles({ weatherType, intensity = "medium" }: WeatherParticlesProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>(
    [],
  )

  useEffect(() => {
    const particleCount = {
      low: 20,
      medium: 40,
      high: 60,
    }[intensity]

    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }))

    setParticles(newParticles)
  }, [weatherType, intensity])

  const getParticleClasses = (particle: any) => {
    const baseClasses = "absolute rounded-full pointer-events-none"

    switch (weatherType) {
      case "rainy":
        return `${baseClasses} bg-blue-300 opacity-70 animate-rain-drop`

      case "snowy":
        return `${baseClasses} bg-white opacity-80 animate-snow-fall`

      case "stormy":
        return `${baseClasses} bg-gray-300 opacity-60 animate-storm-particle`

      case "windy":
        return `${baseClasses} bg-white opacity-40 animate-wind-particle`

      default:
        return `${baseClasses} bg-white opacity-30 animate-float-gentle`
    }
  }

  const getParticleShape = () => {
    switch (weatherType) {
      case "rainy":
        return "w-0.5 h-4 rounded-full"

      case "snowy":
        return "w-2 h-2 rounded-full"

      default:
        return "w-1 h-1 rounded-full"
    }
  }

  if (!["rainy", "snowy", "stormy", "windy"].includes(weatherType)) {
    return null
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`${getParticleClasses(particle)} ${getParticleShape()}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: weatherType === "rainy" ? "2px" : `${particle.size}px`,
            height: weatherType === "rainy" ? "16px" : `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: weatherType === "rainy" ? "1s" : weatherType === "snowy" ? "3s" : "2s",
          }}
        ></div>
      ))}
    </div>
  )
}
