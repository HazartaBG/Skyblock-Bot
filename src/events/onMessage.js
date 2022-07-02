const { createTicket } = require('../buttons/createTicketButton');
const { DEVELOPER_ID } = require('../constants');
const { createTicketEmbed } = require('../embeds/createTicketEmbed');
const { Event } = require('../structures/Event');

module.exports = new Event('messageCreate', (message) => {
  if (message.author.bot) return false;

  if (message.content === '!send-ticket-embed') {
    if (message.author.id !== DEVELOPER_ID) {
      return false;
    }

    return message.channel.send({
      embeds: [createTicketEmbed],
      components: [createTicket.button],
    });
  }
});
