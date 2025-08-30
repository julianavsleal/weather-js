import { getWeatherByCity, getWeatherForCities } from "./api/weatherService.js";

const input = document.getElementById("cityInput");
const button = document.getElementById("searchBtn");
const result = document.getElementById("result");

button.addEventListener("click", async () => {
  const cityText = input.value.trim();

  if (!cityText) {
    result.textContent = "⚠️ Por favor, digite uma cidade.";
    return;
  }

  result.textContent = "Carregando...";

  // Se o usuário digitar várias cidades separadas por vírgula
  const cities = cityText.split(",").map((c) => c.trim()).filter(Boolean);

  if (cities.length === 1) {
    // 🔹 Caso de apenas 1 cidade → usa a função antiga
    const data = await getWeatherByCity(cities[0]);
    if (data.erro) {
      result.textContent = `⚠️ Erro: ${data.erro}`;
    } else {
      result.textContent = `📍 ${data.cidade}
🌡️ ${data.temperatura}
${data.descricao}
💨 ${data.vento}`;
    }
  } else {
    // 🔹 Caso de várias cidades → usa a nova função
    const results = await getWeatherForCities(cities);

    result.textContent = results
      .map((data) =>
        data.erro
          ? `⚠️ ${data.cidade_consultada}: ${data.erro}`
          : `📍 ${data.cidade}
🌡️ ${data.temperatura}
${data.descricao}
💨 ${data.vento}`
      )
      .join("\n\n");
  }
});
