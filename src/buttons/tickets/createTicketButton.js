const { PermissionFlagsBits } = require('discord-api-types/v10');
const { MessageActionRow, MessageButton } = require('discord.js');
const { TICKET_CATEGORY_ID } = require('../../constants');

const customId = 'ticket_create';

const button = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId(customId)
    .setLabel('📩 Bulgarian Support Ticket')
    .setStyle('PRIMARY')
);

async function callback(interaction) {
  const { guild, user } = interaction;
  const channelName = `${user.username.toLowerCase()}-${user.id}`;

  const foundChannel = guild.channels.cache.find((x) => x.name == channelName);

  if (foundChannel) {
    return {
      content: 'Channel already exists: ' + foundChannel.toString(),
      ephemeral: true,
    };
  }

  const channel = await guild.channels.create(channelName, {
    type: 'text',
    permissionOverwrites: [
      {
        id: guild.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
    ],
  });

  await channel.setParent(TICKET_CATEGORY_ID);
  await channel.permissionOverwrites.edit(user.id, { VIEW_CHANNEL: true });

  return {
    content: 'Successfully created ticket: ' + channel.toString(),
    ephemeral: true,
  };
}

module.exports = {
  button,
  callback,
  customId,
};
