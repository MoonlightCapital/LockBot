const {RichEmbed} = require('discord.js')
const userDB = require('../database/users')

exports.run = async (client, message, args) => {

  if(args.length < 1)
    return message.channel.send(':warning: Please specify an user')

  const data = await userDB.getUser(client.utils.parseMention(args.shift()))

  if(!data)
    return message.channel.send(':warning: No data recorded for this user')

  const discordUser = await client.fetchUser(data.id)

  const embed = new RichEmbed()
  .setTitle(`Statistics for ${client.utils.escapeMarkdown(discordUser.tag)}`)
  .setColor(0x005597)
  .setThumbnail(discordUser.displayAvatarURL)

  .addField('Points earned', data.points || 0, true)
  .addField('Stars received', data.starsReceived || 0, true)
  .addField('Stars given', data.starsGiven || 0, true)
  .addField('Points multiplier', data.pointsMultiplier, true)

  message.channel.send(embed)
}

exports.help = {
  name: 'statsfor',
  info: 'Shows some statistics of an user',
  usage: '<user>',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  modOnly: true,
  aliases: [],
}
