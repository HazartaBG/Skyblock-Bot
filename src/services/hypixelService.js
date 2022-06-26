const axios = require('axios').default;
const { HYPIXEL_API_KEY } = process.env;

const baseEndpoint = 'https://api.hypixel.net';
const endpoints = {
  getGuild: (uuid) =>
    `${baseEndpoint}/guild?key=${HYPIXEL_API_KEY}&player=${uuid}`,
  getPlayer: (uuid) => `${baseEndpoint}/player?uuid=${uuid}`,
  getPlayerTest: (playername) =>
    `https://api.slothpixel.me/api/players/${playername}`,
};

async function getGuild(uuid) {
  return (await axios.get(endpoints.getGuild(uuid))).data;
}

async function getPlayer(playername) {
  return (await axios.get(endpoints.getPlayerTest(playername))).data;
}

exports.hypixelService = {
  getGuild,
  getPlayer,
};
