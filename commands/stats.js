const {RichEmbed} = require('discord.js')

exports.run = (client, message, args) => {

  if(!message.author.data)
    return message.channel.send(':warning: No data recorded for you')

  const embed = new RichEmbed()
  .setTitle(`Statistics for ${client.utils.escapeMarkdown(message.author.tag)}`)
  .setColor(0x008080)
  .setThumbnail(message.author.displayAvatarURL)

  .addField('Points earned', message.author.data.points || 0, true)
  .addField('Stars received', message.author.data.starsReceived || 0, true)
  .addField('Stars given', message.author.data.starsGiven || 0, true)

  if(message.author.data.pointsMultiplier > 1) {
    embed.addBlankFiend()
    .addField(`:star2: **Your points will be multiplied by ${message.author.data.pointsMultiplier}** :star2:`)
  }

  message.channel.send(embed)
}

exports.help = {
  name: 'stats',
  info: 'Shows some statistics about yourself',
  usage: '',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  modOnly: false,
  aliases: [],
}
