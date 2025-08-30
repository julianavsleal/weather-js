const { getWeatherByCity } = require("../src/api/weatherService.js");

describe('getWeatherByCity', () => {
  test('deve retornar dados meteorológicos para uma cidade válida', async () => {
    const resultado = await getWeatherByCity('São Paulo');
    expect(resultado).toHaveProperty('cidade');
    expect(resultado.cidade).toContain('São Paulo');
    expect(resultado).toHaveProperty('temperatura');
    expect(typeof resultado.temperatura).toBe('number');
    expect(resultado).toHaveProperty('descricao');
    expect(typeof resultado.descricao).toBe('string');
  });

  test('deve retornar erro para uma cidade inexistente', async () => {
    const resultado = await getWeatherByCity('CidadeInexistente123');
    expect(resultado).toHaveProperty('erro', 'Cidade não encontrada.');
  });

  test('deve retornar mensagem de erro para entrada vazia', async () => {
    const resultado = await getWeatherByCity('');
    expect(resultado).toHaveProperty('erro', 'O nome da cidade não pode estar vazio.');
  });

  test('deve retornar erro em caso de falha da API', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() => Promise.reject(new Error('Falha de rede')));
    const resultado = await getWeatherByCity('São Paulo');
    expect(resultado).toHaveProperty('erro');
    global.fetch = originalFetch;
  });
});