"use client";

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fetchWeatherRecommendation } from './actions';
import { WeatherIcon } from '@/components/weather-icon';
import { Thermometer, Wind, Droplets, BrainCircuit, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    humidity: number;
  };
}

export default function Home() {
  const [location, setLocation] = useState('London');
  const [inputValue, setInputValue] = useState('London');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAiLoading, startAiTransition] = useTransition();
  
  const { toast } = useToast();

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY!;

  useEffect(() => {
    async function fetchData() {
      if (!location) return;

      setIsLoading(true);
      setError(null);
      setRecommendation('');

      try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message || 'Failed to fetch weather data.');
        }
        const data: WeatherData = await response.json();
        setWeather(data);

        startAiTransition(async () => {
          const aiRec = await fetchWeatherRecommendation({
            weatherCondition: data.current.condition.text,
            temperature: data.current.temp_c,
          });
          setRecommendation(aiRec);
        });

      } catch (err: any) {
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
        setWeather(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [location, toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setLocation(inputValue.trim());
    }
  };
  
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md space-y-6">
        <header className="text-center">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Breezy Weather
          </h1>
          <p className="mt-2 text-muted-foreground">Your simple and fun weather companion</p>
        </header>

        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a city..."
            className="flex-grow"
            aria-label="City Name"
          />
          <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
            {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div> : <Search />}
            <span className="sr-only">Search</span>
          </Button>
        </form>

        {isLoading ? (
          <Card className="w-full">
            <CardHeader>
              <Skeleton className="h-8 bg-muted rounded w-3/4 mx-auto" />
              <Skeleton className="h-4 bg-muted rounded w-1/2 mx-auto mt-2" />
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6 py-6">
              <Skeleton className="h-24 w-24 bg-muted rounded-full" />
              <Skeleton className="h-16 bg-muted rounded w-1/4" />
              <div className="grid grid-cols-3 gap-4 w-full pt-4">
                  <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full"/>
                    <Skeleton className="h-5 w-10 rounded-md"/>
                    <Skeleton className="h-3 w-16 rounded-md"/>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full"/>
                    <Skeleton className="h-5 w-10 rounded-md"/>
                    <Skeleton className="h-3 w-16 rounded-md"/>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full"/>
                    <Skeleton className="h-5 w-10 rounded-md"/>
                    <Skeleton className="h-3 w-16 rounded-md"/>
                  </div>
              </div>
            </CardContent>
          </Card>
        ) : weather ? (
          <Card className="w-full overflow-hidden shadow-lg border-primary/20 transition-all duration-500">
            <CardHeader className="text-center bg-card">
              <CardTitle className="font-headline text-3xl font-bold">{weather.location.name}</CardTitle>
              <p className="text-muted-foreground">{weather.location.region}, {weather.location.country}</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4 pt-6">
              <WeatherIcon
                condition={weather.current.condition.text}
                isDay={weather.current.is_day}
                className="w-24 h-24 text-accent animate-float"
              />
              <p className="text-6xl font-bold text-foreground">{Math.round(weather.current.temp_c)}°C</p>
              <p className="text-xl font-medium text-muted-foreground capitalize">{weather.current.condition.text}</p>
              
              <div className="grid grid-cols-3 gap-4 w-full pt-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Droplets className="w-6 h-6 text-primary" />
                  <span className="font-bold">{weather.current.humidity}%</span>
                  <span className="text-xs text-muted-foreground">Humidity</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Thermometer className="w-6 h-6 text-primary" />
                   <span className="font-bold">{Math.round(weather.current.feelslike_c)}°</span>
                  <span className="text-xs text-muted-foreground">Feels Like</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Wind className="w-6 h-6 text-primary" />
                  <span className="font-bold">{weather.current.wind_kph} kph</span>
                  <span className="text-xs text-muted-foreground">Wind</span>
                </div>
              </div>
              
              { (isAiLoading || recommendation) && (
                <Card className="bg-primary/5 border-primary/10 w-full mt-6">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <BrainCircuit className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      {isAiLoading ? (
                         <div className="w-full space-y-2 pt-1">
                           <Skeleton className="h-4 bg-muted rounded w-3/4" />
                           <Skeleton className="h-4 bg-muted rounded w-1/2" />
                         </div>
                      ) : (
                        <p className="text-sm text-foreground/80">{recommendation}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        ) : (
           <Card className="w-full">
             <CardContent className="p-6 text-center">
               <p className="text-destructive-foreground bg-destructive/80 p-4 rounded-md">{error || "Could not fetch weather data. Please try another city."}</p>
             </CardContent>
           </Card>
        )}
      </div>
    </main>
  );
}
