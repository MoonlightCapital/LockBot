const {RichEmbed} = require('discord.js')

exports.run = async (client, message, args) => {

  if(!message.member.roles.some(r=>client.serverconfig.mod_roles.includes(r.id))) return

  if(client.serverconfig.lock_regexban_to_guild_owner && message.author.id !== message.guild.ownerID)
    return message.channel.send(':no_entry: To prevent abuse, this command has been set so only the server owner may use it. Please contact them for assistance')

  const data = args.join()
  let pattern

  try {
    pattern = new RegExp(data)
  } catch(e) {
    return message.channel.send(':rotating_light: You provided an invalid pattern')
  }
  console.log(pattern)

  const found = message.guild.members.filter(m=>m.bannable && m.user.username.match(pattern))

  const embed = new RichEmbed()
  .setTitle('The following users are about to be banned')
  .setDescription(found.map(f=>f.user.tag).join(', '))

  if(found.size < 1)
    return message.channel.send(':warning: No user found matching that pattern')

  message.channel.send(`
:bangbang: This will ban **${found.size}** users matching the following pattern:
\`\`\`
${pattern}
\`\`\`

**This action is irreversible.** Think carefully before taking a decision.

*insert reaction confirmation here*
    `, embed)
}

exports.help = {
  name: 'regexban',
  info: 'Bans multiple users providing a regular expression to match their usernames',
  usage: '<pattern>',
  unlisted: false,
}

exports.config = {
  guildOnly: true,
  ownerOnly: false,
  aliases: [],
}
