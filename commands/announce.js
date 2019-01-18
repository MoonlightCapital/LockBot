exports.run = async (client, message, args) => {

  if(args.length < 2)
    return message.channel.send(':warning: Please sullpy a valid channel as first argument')

  const channel = client.channels.get(client.utils.parseMention(args.shift()))

  if(!channel)
    return message.channel.send(':warning: Please sullpy a valid channel as first argument')

  if(!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES'))
    return message.channel.send(':no_entry: I\'m unable to send messages in tht channel')

  const args2 = args.join(' ').split(' | ')

  if(args2.length < 2)
    return message.channel.send(':warning: Please supply a role and some message content')

  const ment = args.shift().trim()
  let mention, role

  if(ment === '--everyone')
    mention = '@everyone'
  else if(ment === '--here')
    mention = '@here'
  else {
    role = message.guild.roles.get(client.utils.parseMention(ment)) || message.guild.roles.find(r=>r.name === ment)
    if(!role)
      return message.channel.send(':x: Invalid role')

    if(!role.editable)
      return message.channel.send(':no_entry: I cannot make that role mentionable')

    mention = role.toString()
  }

  if(role)
    await role.setMentionable(true, 'Announcement')

  await channel.send(`${mention} ${args2[1]}`)
  if(role)
    await role.setMentionable(false, 'Announcement posted')

  message.channel.send(':white_check_mark: The announcement has been sent')


}

exports.help = {
  name: 'announce',
  info: 'Announces something in a channel',
  usage: '<channel> (role|--everyone|--here) | <message',
  unlisted: false,
}

exports.config = {
  guildOnly: true,
  ownerOnly: false,
  modOnly: true,
  aliases: [],
}
