exports.run = async (client, message, args) => {

  if(!message.channel.permissionsFor(message.guild.me).has('MANAGE_MESSAGES'))
    return message.channel.send(':no_entry: I\'m missing permissions to manage messages in this channel')

  if(client.serverconfig.noCleanChannels.includes(message.channel.id))
    return message.channel.send(':no_entry: You cannot clean messages here')

  const option = args.shift()
  if(!option)
    return message.channel.send(':warning: Please specify an option as a first argument')

  const amount = 100 // TODO: MAKE THIS VARIABLE

  if(isNaN(amount) || amount < 2 || amount > 100)
    return message.channel.send(':warning: Last argument (the amount of messages to delete) must be an integer between 2 and 100')

  const messages = await message.channel.fetchMessages({limit: amount})
  let filtered

  switch(option) {

    case 'all':
      filtered = messages
      break;

    case 'user':
      if(!args[0])
        return message.channel.send(':warning: Second argument must be an user')

      const user = client.utils.parseMention(args[0])
      filtered = messages.filter(m=>m.author.id === user)

      break;

    case 'matching':

      let pattern = args.join(' ')

      try {
        pattern = new RegExp(pattern)
      } catch(e) {
        return message.channel.send(':warning: You provided an invalid pattern')
      }

      filtered = messages.filter(m=>m.content.match(pattern))

      break;

    case 'bots':
      filtered = messages.filter(m=>m.author.bot === true)
      break;

    default:
      return message.channel.send(':warning: You provided an invalid option')
  }

  filtered.delete(message.id)

  if(filtered.size === 0)
    return message.channel.send(':warning: No messages matching the provided query found')

  message.channel.bulkDelete(filtered, true).then((ms) => {
    message.react('✅')

    client.logger.log('CHANNEL_CLEAN', `:wastebasket: ${message.author.tag} (\`${message.author.id}\`) cleaned channel <#${message.channel.id}>, here's the command content:
\`\`\`${message.cleanContent}\`\`\`
\`${ms.size}\` messages were cleaned in the process
    `)
  }).catch((e) => {
    message.channel.send(':x: Something went wrong')
  })

}

exports.help = {
  name: 'clean',
  info: 'Cleans a channel with the supplied parameters',
  usage: '<something>',
  unlisted: false,
}

exports.config = {
  guildOnly: true,
  ownerOnly: false,
  modOnly: true,
  aliases: [],
}
