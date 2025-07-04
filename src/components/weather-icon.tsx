import type { FC } from 'react';
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning, Wind, CloudSun } from 'lucide-react';

interface WeatherIconProps {
  condition: string;
  isDay: number;
  className?: string;
}

export const WeatherIcon: FC<WeatherIconProps> = ({ condition, isDay, className }) => {
  const lowerCaseCondition = condition.toLowerCase();
  let IconComponent;

  if (lowerCaseCondition.includes('sunny') || (lowerCaseCondition.includes('clear') && isDay === 1)) {
    IconComponent = Sun;
  } else if (lowerCaseCondition.includes('clear') && isDay === 0) {
    IconComponent = Moon;
  } else if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle')) {
    IconComponent = CloudRain;
  } else if (lowerCaseCondition.includes('snow') || lowerCaseCondition.includes('sleet') || lowerCaseCondition.includes('blizzard')) {
    IconComponent = CloudSnow;
  } else if (lowerCaseCondition.includes('thunder')) {
    IconComponent = CloudLightning;
  } else if (lowerCaseCondition.includes('fog') || lowerCaseCondition.includes('mist')) {
    IconComponent = CloudFog;
  } else if (lowerCaseCondition.includes('overcast')) {
    IconComponent = Cloud;
  } else if (lowerCaseCondition.includes('cloudy')) {
    IconComponent = isDay === 1 ? CloudSun : Cloud;
  } else {
    IconComponent = isDay === 1 ? CloudSun : Moon;
  }

  return <IconComponent className={className} />;
}
