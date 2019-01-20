const userDB = require('../database/users')

exports.run = async (client, message) => {
  if(!message.guild) return

  const channelMultiplier = client.serverconfig.points.special_channels[message.channel.id] || 1
  const userMultiplier = message.author.data.pointsMultiplier

  const added = 1 * channelMultiplier * userMultiplier
  console.log(added)

  const total = message.author.data.points += added

  userDB.updateUser({points: total}, message.author.id)
}

exports.help = {
  name: 'handlepoints',
  info: 'Handles points in messages',
  usage: '',
  unlisted: true,
}

exports.config = {
  guildOnly: true,
  ownerOnly: true,
  modOnly: true,
  aliases: [],
}
