import { getWeatherByCity } from "./api/weatherService.js";

const input = document.getElementById("cityInput");
const button = document.getElementById("searchBtn");
const result = document.getElementById("result");

button.addEventListener("click", async () => {
  const city = input.value.trim();
  result.textContent = "Carregando...";

  const data = await getWeatherByCity(city);

  if (data.erro) {
    result.textContent = `⚠️ Erro: ${data.erro}`;
  } else {
    result.textContent = `📍 ${data.cidade}\n🌡️ ${data.temperatura}°C\n${data.descricao}\n${data.vento}`;
  }
});
