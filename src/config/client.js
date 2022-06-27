const { GatewayIntentBits } = require('discord-api-types/v10');
const { Client } = require('discord.js');
const { errorEmbed } = require('../embeds/errorEmbed');
const { ServerError } = require('../errors/serverError');
const { TOKEN } = process.env;
const client = new Client({
  intents: [GatewayIntentBits.Guilds, 'GUILD_MEMBERS'],
});

const talkedRecently = new Set();
const cooldownInMiliseconds = 10000;

exports.initClient = (commands) => {
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = commands.find(
      (command) => interaction.commandName == command.data.name
    );

    try {
      if (command) {
        if (talkedRecently.has(interaction.user.id)) {
          throw new ServerError(
            'You are on cooldown. Try again in a bit.',
            'ephemeral'
          );
        }

        talkedRecently.add(interaction.user.id);

        setTimeout(() => {
          talkedRecently.delete(interaction.user.id);
        }, cooldownInMiliseconds);

        const result = await command.callback(interaction);
        await interaction.reply(result);
      }
    } catch (e) {
      let message;

      if (!(e instanceof ServerError)) {
        console.log(e);
        message = 'Internal Error';
      } else {
        if (e.flag == 'ephemeral') {
          client.api
            .interactions(interaction.id, interaction.token)
            .callback.post({
              data: {
                type: 4,
                data: {
                  content: e.message,
                  flags: 64, // make reply ephemeral
                },
              },
            });
          return;
        }

        message = e.message;
      }

      await interaction.reply({ embeds: [errorEmbed(message)] });
    }
  });

  client.login(TOKEN);
};
