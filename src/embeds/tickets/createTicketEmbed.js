const { MessageEmbed } = require('discord.js');

exports.createTicketEmbed = new MessageEmbed()
  .setTitle('Bulgarian Support Ticket')
  .setColor('#00FF00')
  .setDescription(
    'Цъкнете бутона по-долу, за да отворите **БИЛЕТ**!\n\n**Тикет се отваря само за важни неща!**\nЗабранено е в тикета:\n- *Тагването повече от веднъж*\n- *Спаменето*\n- *Обиждането*\n- *Пращането на други дискорд групи*\n\n**ЕКИПА НИ Е НА РАЗПОЛОЖЕНИЕ ЗА ВАС ВИНАГИ**'
  )
  .setFooter({
    text: 'by StefanDP#6411',
  });
