require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const apis = [
  { name: "JSONPlaceholder", provider: "typicode", category:"REST", baseUrl:"https://jsonplaceholder.typicode.com/todos/1" },
  { name: "HTTPBin",         provider: "httpbin",  category:"REST", baseUrl:"https://httpbin.org/get" },
  { name: "IPify",           provider: "ipify",    category:"Network", baseUrl:"https://api.ipify.org?format=json" },
  { name: "Open-Meteo",      provider: "open-meteo", category:"Weather", baseUrl:"https://api.open-meteo.com/v1/forecast?latitude=40.7&longitude=-74&hourly=temperature_2m" },
  { name: "Coingecko",       provider: "coingecko", category:"Crypto", baseUrl:"https://api.coingecko.com/api/v3/ping" },
  { name: "SpaceX",          provider: "spacex",    category:"Aerospace", baseUrl:"https://api.spacexdata.com/v4/launches/latest" },
  { name: "Cat Facts",       provider: "catfact",   category:"Fun", baseUrl:"https://catfact.ninja/fact" },
  { name: "PokeAPI",         provider: "pokeapi",   category:"Gaming", baseUrl:"https://pokeapi.co/api/v2/pokemon/1" },
  { name: "ExchangeRate",    provider: "exchangerate.host", category:"Finance", baseUrl:"https://api.exchangerate.host/latest?base=USD" },
  { name: "Agify",           provider: "agify", category:"Demographics", baseUrl:"https://api.agify.io?name=michael" }
];

(async () => {
  for (const a of apis) {
    await db.api.upsert({
      where: { name: a.name },
      create: { ...a, regions: ["us-east-1","eu-west-1"] },
      update: { ...a },
    });
  }
  console.log("Seeded APIs");
  await db.$disconnect();
})();
