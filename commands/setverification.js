function getLabel(lv) {
  switch(lv) {
    case 0:
      return '0 (Unrestricted)'
    case 1:
      return '1 (Verifed email required)'
    case 2:
      return '2 (Account must have been registered for longer than 5 minutes)'
    case 3:
      return '3 (10 minutes wait)'
    case 4:
      return '4 (Phone verification required)'
  }
}

exports.run = async (client, message, args) => {


  if(!message.guild.me.hasPermission('MANAGE_GUILD'))
    return message.channel.send(':no_entry: I\'m missing permissions to manage this server')

  const level = parseInt(args[0])
  const levelLabel = getLabel(level)

  if(Number.isNaN(level) || level < 0 || level > 4)
    return message.channel.send(':warning: Level must be an integer between 0 and 4 included')

  const minLevel = client.serverconfig.min_verification_level
  const minLevelLabel = getLabel(minLevel)

  if(level < minLevel)
    return message.channel.send(`:no_entry: The server owner has specified that the minumum level for this server must be \`${minLevelLabel}\``)

  await message.guild.setVerificationLevel(level)

  message.channel.send(`:white_check_mark: Server's verification level has been set to \`${levelLabel}\``)

  client.logger.log('SERVER_VERIFICATION_EDIT', `:closed_lock_with_key: ${message.author.tag} (\`${message.author.id}\`) Set server's verification level to \`${levelLabel}\``)


}

exports.help = {
  name: 'setverification',
  info: 'Sets verification level for this server',
  usage: '<level>',
  unlisted: false,
}

exports.config = {
  guildOnly: true,
  ownerOnly: false,
  modOnly: true,
  aliases: [],
}
