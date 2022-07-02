const { MessageActionRow, MessageButton } = require('discord.js');

const customId = 'ticket_create';

const button = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId(customId)
    .setLabel('📩 Bulgarian Support Ticket')
    .setStyle('PRIMARY')
);

function callback(interaction) {
  console.log(interaction);
}

module.exports = {
  button,
  callback,
  customId,
};
