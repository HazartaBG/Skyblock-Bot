const axios = require('axios').default;

const baseEndpoint = 'https://api.mojang.com';
const endpoints = {
  getUUID: (username) => `${baseEndpoint}/users/profiles/minecraft/${username}`,
};

async function getUUID(username) {
  return (await axios.get(endpoints.getUUID(username))).data;
}

exports.mojangService = {
  getUUID,
};
