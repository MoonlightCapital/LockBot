const invitePattern = /(?:https?:\/\/)?discord(\.gg|app\.com\/invite)\/([A-Za-z0-9-_]+)/gmi
const everyonePattern = /@(everyone|here)/gmi
const linkPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/gmi

exports.run = async (client, message) => {

  if(!message.guild) return
  if(message.author.bot) return
  if(message.member.roles.some(r=>client.serverconfig.mod_roles.includes(r.id))) return

  const content = message.content
  const conf = client.serverconfig.automod

  const reasons = []
  let del = false
  let caught = false
  let gravity = 0

  const inviteTest = invitePattern.exec(content)
  if(inviteTest && conf.delete_invites) {
    caught = true
    del = true
    gravity += 2
    reasons.push('Invite links')
  }

  if(content.match(everyonePattern) && conf.infraction_on_everyone) {
    caught = true
    gravity += 1
    reasons.push('Everyone/here ping attempt')
  }

  if(message.mentions.users.size > conf.max_user_pings) {
    caught = true
    gravity += 3
    reasons.push('Pinged too many users in a single message')
  }

  if(message.mentions.roles.size > conf.max_role_pings) {
    caught = true
    gravity += 3
    reasons.push('Pinged too many roles in a single message')
  }

  if(content.match(linkPattern) && !message.member.roles.has(client.serverconfig.verified_role)) {
    caught = true
    del = true
    reasons.push('Sent a link without being verified')

    message.reply('only verified users are allowed to send links. To discover how to verify yourself, read this server\'s rules channel')
      .then(m=>m.delete(10000))
  }

  if(caught) {
    client.logger.log('AUTOMOD_TRIGGER',
    `:rotating_light: A message sent in ${message.channel} by ${client.utils.escapeMarkdown(message.author.tag)} (\`${message.author.id}\`) was caught by automod for the following reasons:

\`\`\`${reasons.map(r=> '- '+r).join('\n')}\`\`\`
    `)
    console.log(gravity)
    if(gravity >= 5) {
      message.guild.ban(message.author.id, 'Automatic: automod caught a message with a gravity of 5 or above')
    } else if(gravity >= 3) {
      message.member.addRole(client.serverconfig.mute_role, 'Automatic: automod caught a message with a gravity of 3 or above')
    }

    if(del) message.delete()
  }



}

exports.help = {
  name: 'automod',
  info: 'Manages automod',
  usage: '',
  category: 'Security',
  unlisted: true,
}

exports.config = {
  guildOnly: true,
  ownerOnly: true,
  modOnly: true,
  aliases: [],
}
