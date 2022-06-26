const { MessageEmbed } = require('discord.js');

exports.errorEmbed = (errorMessage) =>
  new MessageEmbed()
    .setColor('#ff0000')
    .setTitle('Error')
    .setDescription(errorMessage)
    .setTimestamp()
    .setFooter({
      text: 'by StefanDP#6411',
    });

// .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
