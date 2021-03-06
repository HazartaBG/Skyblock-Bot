const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const {
  GUILD_NAME,
  GUEST_ROLE_ID,
  PLAYER_ROLE_ID,
  VERIFICATION_CHANNEL_ID,
} = require('../constants');
const { ServerError } = require('../errors/serverError');
const { hypixelService } = require('../services/hypixelService');
const { mojangService } = require('../services/mojangService');

const data = new SlashCommandBuilder()
  .setName('guild-verify')
  .setDescription('Verifies that the user is in the guild.')
  .addStringOption((option) =>
    option
      .setName('name')
      .setDescription('Your Minecraft Username.')
      .setRequired(true)
  );

async function callback({ options, user, member, guild, channelId }) {
  if (channelId != VERIFICATION_CHANNEL_ID) {
    throw ServerError.invalidChannel(guild, VERIFICATION_CHANNEL_ID);
  }

  const name = options.getString('name');
  const requesterDiscord = `${user.username}#${user.discriminator}`;

  const { name: mojangName, id: uuid } = await mojangService.getUUID(name);
  if (!uuid) throw new ServerError('Invalid Username.');

  let discordName;

  try {
    discordName = (await hypixelService.getPlayer(name)).links?.DISCORD;
  } catch (e) {
    throw new ServerError('Invalid Username.');
  }

  if (discordName != requesterDiscord) {
    console.log(
      `\n\nDiscord From Links: ${discordName}\nRequester Discord: ${requesterDiscord}\n\n`
    );
    throw new ServerError(
      "Player profile's linked discord doesn't match your current discord."
    );
  }

  const guildName = (await hypixelService.getGuild(uuid)).guild?.name;

  if (guildName != GUILD_NAME) {
    console.log(
      `\n\nGuild From API: ${guildName}\nGuild from constants: ${GUILD_NAME}\n\n`
    );
    throw new ServerError("Player isn't in the guild.");
  }

  const foundMember = await guild.members.fetch({
    user: member.user.id,
    force: true,
  });

  const playerRole = guild.roles.cache.get(PLAYER_ROLE_ID);
  const guestRole = guild.roles.cache.get(GUEST_ROLE_ID);

  await foundMember.roles.add(playerRole);
  await foundMember.roles.remove(guestRole);

  try {
    await foundMember.setNickname(mojangName);
  } catch (e) {
    throw new ServerError(
      "Can't change nickname of someone that has more permissions than I do."
    );
  }

  return {
    embeds: [
      new MessageEmbed()
        .setColor('#00FF00')
        .setTitle('Successful Verification!')
        .setDescription(
          `Successfully verified ${mojangName} to your discord account!`
        )
        .setFooter({
          text: 'by StefanDP#6411',
        }),
    ],
    ephemeral: true,
  };
}

module.exports = {
  data,
  callback,
};
