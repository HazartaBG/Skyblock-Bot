const { SlashCommandBuilder } = require('@discordjs/builders');
const { mojangService } = require('../services/mojangService');

const data = new SlashCommandBuilder()
  .setName('get-uuid')
  .setDescription("Replies with the player's UUID.")
  .addStringOption((option) =>
    option
      .setName('name')
      .setDescription('The player name to get the UUID of.')
      .setRequired(true)
  );

async function callback(interaction) {
  const name = interaction.options.getString('name');

  try {
    const uuid = (await mojangService.getUUID(name)).id;
    await interaction.reply(uuid);
  } catch (e) {
    throw { message: 'Invalid Username' };
  }
}

module.exports = {
  data,
  callback,
};
