

function getWeatherDescription(code) {
  const weatherMap = {
    0: { text: "Céu limpo", icon: "☀️" },
    1: { text: "Principalmente limpo", icon: "🌤️" },
    2: { text: "Parcialmente nublado", icon: "⛅" },
    3: { text: "Nublado", icon: "☁️" },
    45: { text: "Neblina", icon: "🌫️" },
    48: { text: "Neblina com gelo", icon: "🌫️" },
    51: { text: "Chuvisco fraco", icon: "🌦️" },
    53: { text: "Chuvisco moderado", icon: "🌦️" },
    55: { text: "Chuvisco intenso", icon: "🌧️" },
    61: { text: "Chuva fraca", icon: "🌦️" },
    63: { text: "Chuva moderada", icon: "🌧️" },
    65: { text: "Chuva forte", icon: "🌧️" },
    71: { text: "Neve fraca", icon: "❄️" },
    73: { text: "Neve moderada", icon: "❄️" },
    75: { text: "Neve forte", icon: "❄️" },
    80: { text: "Pancadas de chuva fraca", icon: "🌦️" },
    81: { text: "Pancadas de chuva moderada", icon: "🌧️" },
    82: { text: "Pancadas de chuva forte", icon: "🌧️" },
    95: { text: "Trovoada", icon: "⛈️" },
    96: { text: "Trovoada com granizo leve", icon: "🌩️" },
    99: { text: "Trovoada com granizo forte", icon: "🌩️" }
  };

  return weatherMap[code] || { text: "Clima desconhecido", icon: "❓" };
}

if (typeof fetch === "undefined") {
  global.fetch = require("node-fetch");
}
 async function getWeatherByCity(cityName) {
  try {
    if (!cityName || cityName.trim() === "") {
      throw new Error("O nome da cidade não pode estar vazio.");
    }

    // Geocodificação
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`
    );

    if (!geoResponse.ok) throw new Error("Falha ao buscar coordenadas da cidade.");
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("Cidade não encontrada.");
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Clima
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    if (!weatherResponse.ok) throw new Error("Falha ao buscar dados do clima.");
    const weatherData = await weatherResponse.json();

    if (!weatherData.current_weather) throw new Error("Dados do clima não disponíveis.");

    const { temperature, windspeed, winddirection, weathercode } = weatherData.current_weather;

    // Pegar descrição e ícone
    const { text, icon } = getWeatherDescription(weathercode);

    return {
      cidade: `${name}, ${country}`,
      temperatura: temperature,
      descricao: `${text} ${icon}`,
      vento: `Vento ${windspeed} km/h, direção ${winddirection}°`
    };

  } catch (error) {
    return { erro: error.message };
  }
}
export { getWeatherByCity };