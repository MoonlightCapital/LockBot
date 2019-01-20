const userDB = require('../database/users')

exports.run = async (client, message, args) => {

  if(args.length < 2)
    return message.channel.send(':warning: Please specify an user, and how many points should I give them')

  const user = await userDB.getUser(client.utils.parseMention(args.shift()))

  if(!user)
    return message.channel.send(':x: Couldn\'t find this user in the database')

  const discordUser = await client.fetchUser(user.id)

  const points = parseInt(args.shift())

  if(isNaN(points))
    return message.channel.send(':warning: Amount of points must be an integer')

  if(points > 1000 || points < -1000)
    return message.channel.send(':warning: Maybe you\'re giving out too many points...')

  if(user.id === message.author.id)
    return message.channel.send(':no_entry: You cannot give points to yourself')

  const reason = args.join(' ')

  await userDB.updateUser({points: user.points + points}, user.id)

  message.channel.send(`:white_check_mark: ${client.utils.escapeMarkdown(discordUser.tag)} received ${points} points ${reason ? 'for '+reason : ''}`)
}

exports.help = {
  name: 'reward',
  info: 'Rewards users with points',
  usage: '<user> <amount> [reason]',
  unlisted: false,
}

exports.config = {
  guildOnly: true,
  ownerOnly: false,
  modOnly: true,
  aliases: [],
}
