const axios = require('axios').default;
const { HYPIXEL_API_KEY } = process.env;

const baseEndpoint = 'https://api.hypixel.net';
const endpoints = {
  getGuild: (uuid) =>
    `${baseEndpoint}/guild?key=${HYPIXEL_API_KEY}&player=${uuid}`,
  getPlayer: (playername) =>
    `https://api.slothpixel.me/api/players/${playername}`,
};

async function getGuild(uuid) {
  return (await axios.get(endpoints.getGuild(uuid))).data;
}

async function getPlayer(playername) {
  return (await axios.get(endpoints.getPlayer(playername))).data;
}

exports.hypixelService = {
  getGuild,
  getPlayer,
};
