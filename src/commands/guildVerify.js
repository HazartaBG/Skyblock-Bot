const { SlashCommandBuilder } = require('@discordjs/builders');
const { GUILD_NAME } = require('../constants');
const { ServerError } = require('../errors/serverError');
const { hypixelService } = require('../services/hypixelService');
const { mojangService } = require('../services/mojangService');

const data = new SlashCommandBuilder()
  .setName('guild-verify')
  .setDescription('Verifies that the user is in the guild.')
  .addStringOption((option) =>
    option
      .setName('name')
      .setDescription('The player name to get the UUID of.')
      .setRequired(true)
  );

async function callback(interaction) {
  const name = interaction.options.getString('name');
  const requesterDiscord = `${interaction.user.username}#${interaction.user.discriminator}`;

  try {
    const uuid = (await mojangService.getUUID(name)).id;
    if (!uuid) throw new ServerError('Invalid Username.');

    let discordName;

    try {
      discordName = (await hypixelService.getPlayer(name)).links.DISCORD;
    } catch (e) {
      throw new ServerError('Invalid Username.');
    }

    if (discordName != requesterDiscord) {
      throw new ServerError(
        "Player profile's linked discord doesn't match your current discord."
      );
    }

    const guildName = (await hypixelService.getGuild(uuid)).guild.name;

    if (guildName != GUILD_NAME) {
      throw new ServerError("Player isn't in the guild.");
    }

    await interaction.reply(uuid);
  } catch (e) {
    if (e instanceof ServerError) {
      throw e;
    }

    throw { message: 'Internal Error' };
  }
}

module.exports = {
  data,
  callback,
};
