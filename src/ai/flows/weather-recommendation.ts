'use server';

/**
 * @fileOverview An AI agent that provides weather-based recommendations.
 *
 * - getWeatherRecommendation - A function that provides activity or fact recommendations based on weather.
 * - WeatherRecommendationInput - The input type for the getWeatherRecommendation function.
 * - WeatherRecommendationOutput - The return type for the getWeatherRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherRecommendationInputSchema = z.object({
  weatherCondition: z.string().describe('The current weather condition (e.g., sunny, rainy, cloudy).'),
  temperature: z.number().describe('The current temperature in Celsius.'),
});
export type WeatherRecommendationInput = z.infer<typeof WeatherRecommendationInputSchema>;

const WeatherRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('A recommendation for an activity or a fun fact based on the weather.'),
});
export type WeatherRecommendationOutput = z.infer<typeof WeatherRecommendationOutputSchema>;

export async function getWeatherRecommendation(input: WeatherRecommendationInput): Promise<WeatherRecommendationOutput> {
  return weatherRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherRecommendationPrompt',
  input: {schema: WeatherRecommendationInputSchema},
  output: {schema: WeatherRecommendationOutputSchema},
  prompt: `You are a helpful assistant that provides recommendations based on the current weather.

  Given the following weather condition and temperature, provide a single, concise recommendation for an activity or share a fun fact related to the weather.

  Weather Condition: {{{weatherCondition}}}
  Temperature: {{{temperature}}}°C
  
  Recommendation: `,
});

const weatherRecommendationFlow = ai.defineFlow(
  {
    name: 'weatherRecommendationFlow',
    inputSchema: WeatherRecommendationInputSchema,
    outputSchema: WeatherRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
