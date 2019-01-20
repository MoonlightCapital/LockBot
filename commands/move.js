exports.run = async (client, message, args) => {

  const channel = message.guild.channels.get(client.utils.parseMention(args[0]))

  if(!channel || channel.type !== 'text')
    return message.channel.send(`:x: I cound not find a text channel based on ${client.utils.escapeMarkdown(args[0])}`)

  if(!channel.permissionsFor(message.guild.me).has('MANAGE_WEBHOOKS'))
    return message.channel.send(`:no_entry: I don't have permissions to create webhooks in ${channel}`)

  const msg = args[1]

  if(!msg)
    return message.channel.send(':x: Please specify the ID of the message you want to move')

  message.channel.fetchMessage(msg).then(async (m) => {

    if(client.serverconfig.noCleanChannels.includes(m.channel.id))
      return message.channel.send(':no_entry: You cannot move messages from here')

    const wh = await channel.createWebhook('Message moving', client.user.displayAvatarURL, `Message move by ${message.author.tag}`)

    await wh.send(m.content, {disableEveryone: true, username: m.author.username, avatarURL: m.author.displayAvatarURL})
    await wh.delete('Did its job')

    await m.delete()

    message.channel.send(':white_check_mark: The message has been successfully moved, and the original has been deleted')


  }).catch((e) => {
    if(e.code === 50035) // Not a snowflake
      return message.channel.send(':x: Invalid message ID')

    if(e.code === 10008) // It's a snowflake, but not a message one
      return message.channel.send(':x: The ID supplied is not one for a message. Also, make sure that the message was sent in the exact same channel as the one you\'re using this command in')

    console.error(e)
    return message.channel.send(':x: Something went wrong while trying to move the message. See your console for more information on this error')
  })
}

exports.help = {
  name: 'move',
  info: 'Moves a message to another channel',
  usage: '<channel> <messageid>',
  unlisted: false,
}

exports.config = {
  guildOnly: true,
  ownerOnly: false,
  modOnly: true,
  aliases: [],
}
