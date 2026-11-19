// Real Agro-Meteorological Weather Service using Open-Meteo API
// Free, public, no private API key needed, high reliability for Indian agricultural coordinates

export interface WeatherCondition {
  label: string;
  tamilLabel: string;
  icon: "sun" | "cloud-sun" | "cloud-rain" | "wind" | "cloud-lightning";
}

export interface DayForecast {
  date: string;
  dayName: string;
  tamilDayName: string;
  tempMax: number;
  tempMin: number;
  precipitationProb: number;
  weatherCode: number;
  condition: WeatherCondition;
}

export interface LiveWeatherData {
  locationName: string;
  tamilLocationName: string;
  latitude: number;
  longitude: number;
  currentTemp: number;
  relativeHumidity: number;
  windSpeedKmh: number;
  precipitationMm: number;
  weatherCode: number;
  condition: WeatherCondition;
  dailyForecast: DayForecast[];
  lastUpdated: string;
  dataSource: string;
  farmingAdvisory: {
    status: "Optimal" | "Caution" | "Action Required";
    tamilStatus: string;
    advice: string;
    tamilAdvice: string;
  };
}

export const DISTRICT_COORDINATES: Record<
  string,
  { lat: number; lng: number; name: string; tamilName: string }
> = {
  Thanjavur: {
    lat: 10.787,
    lng: 79.1378,
    name: "Thanjavur, Tamil Nadu",
    tamilName: "தஞ்சாவூர், தமிழ்நாடு",
  },
  Tiruvarur: {
    lat: 10.7725,
    lng: 79.6365,
    name: "Tiruvarur, Tamil Nadu",
    tamilName: "திருவாரூர், தமிழ்நாடு",
  },
  Mayiladuthurai: {
    lat: 11.1075,
    lng: 79.6522,
    name: "Mayiladuthurai, Tamil Nadu",
    tamilName: "மயிலாடுதுறை, தமிழ்நாடு",
  },
  Nagapattinam: {
    lat: 10.7672,
    lng: 79.8449,
    name: "Nagapattinam, Tamil Nadu",
    tamilName: "நாகப்பட்டினம், தமிழ்நாடு",
  },
  Tiruchirappalli: {
    lat: 10.7905,
    lng: 78.7047,
    name: "Tiruchirappalli, Tamil Nadu",
    tamilName: "திருச்சிராப்பள்ளி, தமிழ்நாடு",
  },
  Madurai: {
    lat: 9.9252,
    lng: 78.1198,
    name: "Madurai, Tamil Nadu",
    tamilName: "மதுரை, தமிழ்நாடு",
  },
  Coimbatore: {
    lat: 11.0168,
    lng: 76.9558,
    name: "Coimbatore, Tamil Nadu",
    tamilName: "கோயம்புத்தூர், தமிழ்நாடு",
  },
  Tirunelveli: {
    lat: 8.7139,
    lng: 77.7567,
    name: "Tirunelveli, Tamil Nadu",
    tamilName: "திருநெல்வேலி, தமிழ்நாடு",
  },
};

export function mapWmoCodeToCondition(code: number): WeatherCondition {
  if (code === 0) {
    return {
      label: "Clear Sky",
      tamilLabel: "தெளிவான வானிலை",
      icon: "sun",
    };
  }
  if (code <= 3) {
    return {
      label: "Partly Cloudy",
      tamilLabel: "பகுதி மேகமூட்டம்",
      icon: "cloud-sun",
    };
  }
  if (code <= 48) {
    return {
      label: "Fog & Morning Dew",
      tamilLabel: "பனிமூட்டம் & பனிப்பொழிவு",
      icon: "wind",
    };
  }
  if (code <= 67) {
    return {
      label: "Rain Showers",
      tamilLabel: "மழைத்தூறல் & மிதமான மழை",
      icon: "cloud-rain",
    };
  }
  if (code <= 82) {
    return {
      label: "Heavy Rain / Downpour",
      tamilLabel: "கனமழை",
      icon: "cloud-rain",
    };
  }
  return {
    label: "Thunderstorm Alert",
    tamilLabel: "இடி மின்னலுடன் கூடிய மழை",
    icon: "cloud-lightning",
  };
}

export function computeFarmingAdvisory(
  temp: number,
  humidity: number,
  precipProb: number,
  weatherCode: number,
): LiveWeatherData["farmingAdvisory"] {
  if (weatherCode >= 80 || precipProb >= 65) {
    return {
      status: "Action Required",
      tamilStatus: "கவனம் தேவை",
      advice:
        "High precipitation risk: Postpone foliar spraying and fertilizer application. Clear field drainage channels to prevent waterlogging.",
      tamilAdvice:
        "கனமழை வாய்ப்பு: உரம் இடுதல் மற்றும் பூச்சி மருந்து தெளிப்பதை ஒத்திவைக்கவும். வயல் வடிகால் வாய்க்கால்களை தூர்வாரவும்.",
    };
  }
  if (humidity > 85 && temp > 28) {
    return {
      status: "Caution",
      tamilStatus: "எச்சரிக்கை",
      advice:
        "High humidity and warm air favor fungal pathogens (Blast / Blight). Inspect panicles and maintain prophylactic biocontrol.",
      tamilAdvice:
        "அதிக ஈரப்பதம் குலைநோய் மற்றும் இலைக்கருகல் நோய் பூஞ்சணத்தை தூண்டலாம். பயிர் தாள்களை ஆய்வு செய்யவும்.",
    };
  }
  return {
    status: "Optimal",
    tamilStatus: "சாதகமானது",
    advice:
      "Favorable agro-climatic conditions for intercultural operations, field scouting, and harvesting.",
    tamilAdvice:
      "களை எடுத்தல், பயிர் பாதுகாப்பு மற்றும் அறுவடை பணிகளுக்கு உகந்த சாதகமான வானிலை.",
  };
}

export async function fetchLiveWeatherData(
  districtOrLat: string | number,
  lon?: number,
): Promise<LiveWeatherData> {
  let lat = 10.787;
  let lng = 79.1378;
  let locationName = "Thanjavur, Tamil Nadu";
  let tamilLocationName = "தஞ்சாவூர், தமிழ்நாடு";

  if (typeof districtOrLat === "string" && DISTRICT_COORDINATES[districtOrLat]) {
    const loc = DISTRICT_COORDINATES[districtOrLat];
    lat = loc.lat;
    lng = loc.lng;
    locationName = loc.name;
    tamilLocationName = loc.tamilName;
  } else if (typeof districtOrLat === "number" && typeof lon === "number") {
    lat = districtOrLat;
    lng = lon;
    locationName = `Coordinates (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
    tamilLocationName = `புவியியல் அமைவிடம் (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather service returned HTTP ${res.status}`);
  }

  const data = await res.json();
  const current = data.current;
  const daily = data.daily;

  const currentCondition = mapWmoCodeToCondition(current.weather_code || 0);

  const days: DayForecast[] = [];
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const tamilDays = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];

  if (daily && Array.isArray(daily.time)) {
    for (let i = 0; i < Math.min(daily.time.length, 7); i++) {
      const dateStr = daily.time[i];
      const d = new Date(dateStr);
      const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : daysOfWeek[d.getDay()];
      const tamilDayName = i === 0 ? "இன்று" : i === 1 ? "நாளை" : tamilDays[d.getDay()];
      const wCode = daily.weather_code[i] || 0;
      days.push({
        date: dateStr,
        dayName,
        tamilDayName,
        tempMax: Math.round(daily.temperature_2m_max[i] ?? current.temperature_2m),
        tempMin: Math.round(daily.temperature_2m_min[i] ?? current.temperature_2m - 5),
        precipitationProb: daily.precipitation_probability_max[i] ?? 0,
        weatherCode: wCode,
        condition: mapWmoCodeToCondition(wCode),
      });
    }
  }

  const advisory = computeFarmingAdvisory(
    current.temperature_2m,
    current.relative_humidity_2m,
    days[0]?.precipitationProb ?? 0,
    current.weather_code || 0,
  );

  return {
    locationName,
    tamilLocationName,
    latitude: lat,
    longitude: lng,
    currentTemp: Math.round(current.temperature_2m),
    relativeHumidity: Math.round(current.relative_humidity_2m),
    windSpeedKmh: Math.round(current.wind_speed_10m),
    precipitationMm: current.precipitation || 0,
    weatherCode: current.weather_code || 0,
    condition: currentCondition,
    dailyForecast: days,
    lastUpdated: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    dataSource: "Open-Meteo WMO Meteorological Sensor Network",
    farmingAdvisory: advisory,
  };
}
