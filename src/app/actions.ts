'use server';

import { getWeatherRecommendation } from '@/ai/flows/weather-recommendation';
import type { WeatherRecommendationInput } from '@/ai/flows/weather-recommendation';

export async function fetchWeatherRecommendation(input: WeatherRecommendationInput): Promise<string> {
  try {
    const result = await getWeatherRecommendation(input);
    return result.recommendation;
  } catch (error) {
    console.error('AI recommendation failed:', error);
    // Return a friendly fallback message
    return 'Could not get a recommendation right now. How about making a cup of tea?';
  }
}
