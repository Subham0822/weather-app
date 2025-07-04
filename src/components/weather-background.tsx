"use client"

import { useEffect, useState } from "react"

interface WeatherBackgroundProps {
  weatherType: "sunny" | "rainy" | "cloudy" | "snowy" | "stormy" | "foggy" | "windy" | "clear"
  isDay: boolean
}

export function WeatherBackground({ weatherType, isDay }: WeatherBackgroundProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getBackgroundClasses = () => {
    const baseClasses = "absolute inset-0 transition-all duration-1000 ease-in-out"

    if (!mounted) return `${baseClasses} bg-gradient-to-br from-blue-400 to-blue-600`

    switch (weatherType) {
      case "sunny":
        return isDay
          ? `${baseClasses} bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500 animate-gradient-shift`
          : `${baseClasses} bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900`

      case "rainy":
        return isDay
          ? `${baseClasses} bg-gradient-to-br from-gray-600 via-blue-700 to-gray-800`
          : `${baseClasses} bg-gradient-to-br from-gray-900 via-blue-900 to-black`

      case "cloudy":
        return isDay
          ? `${baseClasses} bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600`
          : `${baseClasses} bg-gradient-to-br from-gray-800 via-gray-900 to-black`

      case "snowy":
        return isDay
          ? `${baseClasses} bg-gradient-to-br from-blue-300 via-blue-100 to-gray-400`
          : `${baseClasses} bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900`

      case "stormy":
        return `${baseClasses} bg-gradient-to-br from-gray-900 via-purple-900 to-black animate-lightning`

      case "foggy":
        return isDay
          ? `${baseClasses} bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500`
          : `${baseClasses} bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900`

      case "windy":
        return isDay
          ? `${baseClasses} bg-gradient-to-br from-blue-300 via-cyan-400 to-teal-500 animate-wind-sway`
          : `${baseClasses} bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900`

      default:
        return isDay
          ? `${baseClasses} bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600`
          : `${baseClasses} bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900`
    }
  }

  const getOverlayElements = () => {
    switch (weatherType) {
      case "sunny":
        return (
          <>
            <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-300 rounded-full opacity-80 animate-pulse-soft blur-sm"></div>
            <div className="absolute top-20 right-20 w-24 h-24 bg-orange-300 rounded-full opacity-60 animate-float"></div>
          </>
        )

      case "stormy":
        return (
          <>
            <div className="absolute inset-0 bg-black opacity-20 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500/10 to-transparent animate-lightning-flash"></div>
          </>
        )

      case "foggy":
        return (
          <>
            <div className="absolute inset-0 bg-white opacity-10 animate-pulse-soft"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/20 to-transparent animate-fog-drift"></div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <>
      <div className={getBackgroundClasses()}></div>
      {getOverlayElements()}

      {/* Animated stars for night time */}
      {!isDay && (weatherType === "clear" || weatherType === "sunny") && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      )}
    </>
  )
}
