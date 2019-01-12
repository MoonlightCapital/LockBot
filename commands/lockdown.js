const {Permissions} = require('discord.js')

exports.run = async (client, message, args) => {

  if(!message.member.roles.some(r=>client.serverconfig.mod_roles.includes(r.id))) return

  if(!message.guild.me.hasPermission('MANAGE_ROLES'))
    return message.channel.send(':no_entry: I do not have permission to manage roles')

  const everyone = message.guild.roles.get(message.guild.id)

  if(!everyone.editable)
    return message.channel.send(':no_entry: I need an higher role than `@everyone` in order to lock the server down')

  const newPerms = new Permissions(everyone.permissions).remove(['SEND_MESSAGES', 'ADD_REACTIONS'])

  await everyone.setPermissions(newPerms.toArray(), `Lockdown requested by ${message.author.tag}`)

  message.channel.send(':white_check_mark: I removed send messages and add reaction permissions to the everyone role. Be careful that other roles may override this')

  client.logger.log('SERVER_LOCKDOWN', `:lock: ${message.author.tag} (\`${message.author.id}\`) locked the server down`)

}

exports.help = {
  name: 'lockdown',
  info: 'Locks the server down in case of emergency',
  usage: '',
  unlisted: false,
}

exports.config = {
  guildOnly: true,
  ownerOnly: false,
  aliases: [],
}
