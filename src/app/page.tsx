"use client"

import type React from "react"

import { useState, useEffect, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { fetchWeatherRecommendation } from "./actions"
import { WeatherIcon } from "@/components/weather-icon"
import { Thermometer, Wind, Droplets, BrainCircuit, Search, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { WeatherBackground } from "@/components/weather-background"
import { WeatherParticles } from "@/components/weather-particles"

interface WeatherData {
  location: {
    name: string
    region: string
    country: string
  }
  current: {
    temp_c: number
    feelslike_c: number
    is_day: number
    condition: {
      text: string
      icon: string
      code: number
    }
    wind_kph: number
    humidity: number
  }
}

export default function Home() {
  const [location, setLocation] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [recommendation, setRecommendation] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAiLoading, startAiTransition] = useTransition()

  const { toast } = useToast()

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY!

  useEffect(() => {
    if (!location) {
      setWeather(null)
      setIsLoading(false)
      return
    }

    async function fetchData() {
      setIsLoading(true)
      setError(null)
      setRecommendation("")

      try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error.message || "Failed to fetch weather data.")
        }
        const data: WeatherData = await response.json()
        setWeather(data)

        startAiTransition(async () => {
          const aiRec = await fetchWeatherRecommendation({
            weatherCondition: data.current.condition.text,
            temperature: data.current.temp_c,
          })
          setRecommendation(aiRec)
        })
      } catch (err: any) {
        setError(err.message)
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        })
        setWeather(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [location, toast])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setLocation(inputValue.trim())
    }
  }

  const getWeatherType = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) return "rainy"
    if (lowerCondition.includes("snow") || lowerCondition.includes("blizzard")) return "snowy"
    if (lowerCondition.includes("thunder") || lowerCondition.includes("storm")) return "stormy"
    if (lowerCondition.includes("fog") || lowerCondition.includes("mist")) return "foggy"
    if (lowerCondition.includes("wind")) return "windy"
    if (lowerCondition.includes("cloud")) return "cloudy"
    if (lowerCondition.includes("sunny") || lowerCondition.includes("clear")) return "sunny"
    return "clear"
  }

  // Check if the background is light and we need dark text
  const isLightBackground = (condition: string, isDay: boolean) => {
    const weatherType = getWeatherType(condition)
    return (
      (weatherType === "snowy" && isDay) || (weatherType === "foggy" && isDay) || (weatherType === "sunny" && isDay)
    ) // sunny day can also be very bright
  }

  const textColorClass =
    weather && isLightBackground(weather.current.condition.text, weather.current.is_day === 1)
      ? "text-gray-800"
      : "text-white"

  const textColorClassSecondary =
    weather && isLightBackground(weather.current.condition.text, weather.current.is_day === 1)
      ? "text-gray-700"
      : "text-white/90"

  const textColorClassMuted =
    weather && isLightBackground(weather.current.condition.text, weather.current.is_day === 1)
      ? "text-gray-600"
      : "text-white/70"

  const dropShadowClass =
    weather && isLightBackground(weather.current.condition.text, weather.current.is_day === 1)
      ? "drop-shadow-sm"
      : "drop-shadow-2xl"

  const inputTextClass =
    weather && isLightBackground(weather.current.condition.text, weather.current.is_day === 1)
      ? "text-gray-800 placeholder:text-gray-600"
      : "text-white placeholder:text-white/70"

  const iconColorClass =
    weather && isLightBackground(weather.current.condition.text, weather.current.is_day === 1)
      ? "text-gray-700"
      : "text-white"

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Weather Background */}
      <WeatherBackground
        weatherType={weather ? getWeatherType(weather.current.condition.text) : "clear"}
        isDay={weather?.current.is_day === 1}
      />

      {/* Weather Particles */}
      {weather && (
        <WeatherParticles
          weatherType={getWeatherType(weather.current.condition.text)}
          intensity={weather.current.wind_kph > 20 ? "high" : "medium"}
        />
      )}

      <div className="relative z-10 w-full max-w-md space-y-6 p-4 sm:p-6 md:p-8">
        <header className="text-center">
          <h1
            className={`font-headline text-5xl sm:text-6xl font-bold tracking-tight ${textColorClass} ${dropShadowClass} animate-fade-in`}
          >
            Breezy Weather
          </h1>
          <p className={`mt-3 ${textColorClassSecondary} text-lg drop-shadow-lg animate-fade-in-delay`}>
            Your magical weather companion ✨
          </p>
        </header>

        <form onSubmit={handleSearch} className="flex gap-3 animate-slide-up">
          <div className="relative flex-grow">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a city..."
              className={`pl-10 bg-white/20 backdrop-blur-md border-white/30 ${inputTextClass} focus:bg-white/30 transition-all duration-300`}
              aria-label="City Name"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !inputValue.trim()}
            className="bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30 transition-all duration-300 shadow-lg"
          >
            {isLoading ? (
              <div
                className={`animate-spin rounded-full h-4 w-4 border-b-2 ${weather && isLightBackground(weather.current.condition.text, weather.current.is_day === 1) ? "border-gray-800" : "border-white"}`}
              ></div>
            ) : (
              <Search className={iconColorClass} />
            )}
            <span className="sr-only">Search</span>
          </Button>
        </form>

        {isLoading ? (
          <Card className="w-full bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl animate-pulse-glow">
            <CardHeader>
              <Skeleton className="h-8 bg-white/20 rounded w-3/4 mx-auto" />
              <Skeleton className="h-4 bg-white/20 rounded w-1/2 mx-auto mt-2" />
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6 py-6">
              <Skeleton className="h-24 w-24 bg-white/20 rounded-full" />
              <Skeleton className="h-16 bg-white/20 rounded w-1/4" />
              <div className="grid grid-cols-3 gap-4 w-full pt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full bg-white/20" />
                    <Skeleton className="h-5 w-10 rounded-md bg-white/20" />
                    <Skeleton className="h-3 w-16 rounded-md bg-white/20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : weather ? (
          <Card className="w-full bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl transition-all duration-500 hover:bg-white/15 animate-slide-up-delay">
            <CardHeader className="text-center bg-gradient-to-b from-white/5 to-transparent">
              <CardTitle className={`font-headline text-3xl font-bold ${textColorClass} drop-shadow-lg`}>
                {weather.location.name}
              </CardTitle>
              <p className={`${textColorClassSecondary} drop-shadow-md`}>
                {weather.location.region}, {weather.location.country}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6 pt-6">
              <div className="relative">
                <WeatherIcon
                  condition={weather.current.condition.text}
                  isDay={weather.current.is_day}
                  className={`w-28 h-28 ${textColorClass} ${dropShadowClass} animate-float`}
                />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl -z-10 animate-pulse-soft"></div>
              </div>

              <div className="text-center">
                <p className={`text-7xl font-bold ${textColorClass} ${dropShadowClass} animate-scale-in`}>
                  {Math.round(weather.current.temp_c)}°
                </p>
                <p className={`text-xl font-medium ${textColorClassSecondary} capitalize drop-shadow-lg mt-2`}>
                  {weather.current.condition.text}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 w-full pt-4">
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                  <Droplets
                    className={`w-6 h-6 ${isLightBackground(weather.current.condition.text, weather.current.is_day === 1) ? "text-blue-600" : "text-blue-200"} drop-shadow-lg`}
                  />
                  <span className={`font-bold ${textColorClass} text-lg`}>{weather.current.humidity}%</span>
                  <span className={`text-xs ${textColorClassMuted}`}>Humidity</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                  <Thermometer
                    className={`w-6 h-6 ${isLightBackground(weather.current.condition.text, weather.current.is_day === 1) ? "text-orange-600" : "text-orange-200"} drop-shadow-lg`}
                  />
                  <span className={`font-bold ${textColorClass} text-lg`}>
                    {Math.round(weather.current.feelslike_c)}°
                  </span>
                  <span className={`text-xs ${textColorClassMuted}`}>Feels Like</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                  <Wind
                    className={`w-6 h-6 ${isLightBackground(weather.current.condition.text, weather.current.is_day === 1) ? "text-gray-600" : "text-gray-200"} drop-shadow-lg`}
                  />
                  <span className={`font-bold ${textColorClass} text-lg`}>{weather.current.wind_kph}</span>
                  <span className={`text-xs ${textColorClassMuted}`}>km/h</span>
                </div>
              </div>

              {(isAiLoading || recommendation) && (
                <Card className="bg-white/15 backdrop-blur-md border-white/20 w-full mt-6 shadow-xl animate-fade-in-up">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                        <BrainCircuit className={`w-5 h-5 ${textColorClass} drop-shadow-lg`} />
                      </div>
                      {isAiLoading ? (
                        <div className="w-full space-y-2 pt-2">
                          <Skeleton className="h-4 bg-white/20 rounded w-3/4" />
                          <Skeleton className="h-4 bg-white/20 rounded w-1/2" />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <p className={`text-sm ${textColorClassSecondary} leading-relaxed drop-shadow-sm`}>
                            {recommendation}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
            <CardContent className="flex flex-col items-center space-y-6 py-6">
              <div className="text-7xl font-bold text-gray-400">--</div>
              <p className="text-xl font-medium text-gray-400 capitalize drop-shadow-lg mt-2">--</p>
              <div className="grid grid-cols-3 gap-6 w-full pt-4">
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <Droplets className="w-6 h-6 text-gray-300" />
                  <span className="font-bold text-gray-400 text-lg">--</span>
                  <span className="text-xs text-gray-300">Humidity</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <Thermometer className="w-6 h-6 text-gray-300" />
                  <span className="font-bold text-gray-400 text-lg">--</span>
                  <span className="text-xs text-gray-300">Feels Like</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                  <Wind className="w-6 h-6 text-gray-300" />
                  <span className="font-bold text-gray-400 text-lg">--</span>
                  <span className="text-xs text-gray-300">km/h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
