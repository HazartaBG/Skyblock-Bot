const { TOKEN, CLIENT_ID } = process.env;
const { GUILD_ID } = require('../constants');

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

exports.initCommands = async (commands) => {
  const rest = new REST({ version: '10' }).setToken(TOKEN);

  await (async () => {
    try {
      console.log('Started refreshing application (/) commands.');

      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: commands,
      });

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();
};
