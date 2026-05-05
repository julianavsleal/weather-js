# 🌦️ Weather-js

Um aplicativo simples de previsão do tempo em **Node.js** que permite ao usuário inserir o nome de uma cidade e obter dados meteorológicos como **temperatura**, **umidade** e **velocidade do vento**, utilizando a [API Open-Meteo](https://open-meteo.com/).

O projeto também inclui **tratamento de erros**, como para entradas inválidas ou falhas na API, e salva as respostas recebidas em um arquivo de log.

---

## 📋 Visão Geral

- Entrada do usuário: nome da cidade  
- Busca de coordenadas da cidade (geocoding)  
- Consulta à API Open-Meteo para obter dados do clima  
- Exibição dos resultados em formato amigável no terminal  
- Registro das respostas em arquivo local  
- Testes unitários implementados com **Jest**

---

## 💻 Tecnologias Utilizadas

- **HTML5** 
- **CSS3** 
- **JavaScript** 
- **Node.js** 
- **Jest** 
- **node-fetch** 
- **Open-Meteo API** 

---

## ⚙️ Instalação

Clone o repositório e entre na pasta do projeto:

```bash
git clone https://github.com/julianavsleal/weather-js.git

cd weather-js
