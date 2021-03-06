const { Event } = require('../structures/Event');
const { ServerError } = require('../errors/serverError');
const { errorEmbed } = require('../embeds/errorEmbed');

const talkedRecently = new Set();
const cooldownInMiliseconds = 10000;

module.exports = new Event('interactionCreate', async (interaction) => {
  try {
    if (!interaction.isCommand() && !interaction.isButton()) return;

    if (talkedRecently.has(interaction.user.id)) {
      throw new ServerError('You are on cooldown. Try again in a bit.');
    }

    if (interaction.isButton()) {
      const { callback } = interaction.client.buttons.get(interaction.customId);
      if (!callback) return;

      talkedRecently.add(interaction.user.id);

      setTimeout(() => {
        talkedRecently.delete(interaction.user.id);
      }, cooldownInMiliseconds);

      return interaction.reply(await callback(interaction));
    }

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    talkedRecently.add(interaction.user.id);

    setTimeout(() => {
      talkedRecently.delete(interaction.user.id);
    }, cooldownInMiliseconds);

    const content = await command.callback(interaction);
    await interaction.reply(content);
  } catch (e) {
    let message;

    if (!(e instanceof ServerError)) {
      console.log(e);
      message = 'Internal Error';
    } else {
      message = e.message;
    }

    await interaction.reply({
      embeds: [errorEmbed(message)],
      ephemeral: true,
    });
  }
});
