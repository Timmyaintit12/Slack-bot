const axios = require("axios");

require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/woah-cool-bot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();

app.command("/woah-cool-bot-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/woah-cool-bot-ping - Check bot latency
/woah-cool-bot-joke - Get a random joke
/woah-cool-bot-roll - Roll a dice
/woah-cool-bot-flip - Flip a coin
/woah-cool-bot-weather - Weather info for Wellington, NZ
/woah-cool-bot-catfact - Get a cat fact`
  });
});

app.command("/woah-cool-bot-catfact",async({ack,respond})=>{
  await ack();

  try{
    const response = await axios.get("https://catfact.ninja/fact");
      await respond({ text: `Cat Fact:\n${response.data.fact}`});
  } catch(err) {
    await respond({ text: "Failed to fetch a cat fact."});
  }
});

app.command("/woah-cool-bot-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.command("/woah-cool-bot-roll", async ({ ack, respond }) => {
  await ack();
  const roll = Math.floor(Math.random() * 6) + 1;
  await respond({text: `You rolled a ${roll}!`});
});

app.command("/woah-cool-bot-flip", async ({ ack, respond }) => {
  await ack();
  const flip = Math.random() < 0.5 ? "Heads" : "Tails";
  await respond({ text: `${flip}!` });
});

app.command("/woah-cool-bot-weather", async ({ ack, respond }) => {
  await ack();

  try {
    const lat = -41.2865;
    const lon = 174.7762;
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const weather = response.data.current_weather;
    await respond({
      text: `Weather in Wellington, NZ:\nTemp: ${weather.temperature}°C\nWind: ${weather.windspeed} km/h`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch weather information." });
  }
});