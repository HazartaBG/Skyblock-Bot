const createTicketButton = require('../buttons/tickets/createTicketButton');

const { DEVELOPER_ID, VERIFICATION_CHANNEL_ID } = require('../constants');
const { createTicketEmbed } = require('../embeds/tickets/createTicketEmbed');
const { Event } = require('../structures/Event');

module.exports = new Event('messageCreate', async (message) => {
  if (message.author.bot) return false;

  if (message.channelId === VERIFICATION_CHANNEL_ID) {
    if (message.author.id !== DEVELOPER_ID) {
      return await message.delete();
    }
  }

  if (message.content === '!send-ticket-embed') {
    if (message.author.id !== DEVELOPER_ID) {
      return false;
    }

    return await message.channel.send({
      embeds: [createTicketEmbed],
      components: [createTicketButton.button],
    });
  }
});
