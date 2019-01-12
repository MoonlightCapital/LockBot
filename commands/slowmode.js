const {TextChannel} = require('discord.js')

exports.run = async (client, message, args) => {

  /*if(!TextChannel.setRateLimitPerUser)
    return message.channel.send(':rotating_light: The running version fo Discord.js does not have support for slowmode')*/

  if(!message.member.roles.some(r=>client.serverconfig.mod_roles.includes(r.id))) return

  const timer = parseInt(args.pop())

  if(Number.isNaN(timer) || timer < 0 || timer > 120)
    return message.channel.send(':warning: Last argument (slowmode timer) must be an integer between 0 and 120 included')


  const valid = []

  args.forEach(arg => {

    let channel = client.channels.get(client.utils.parseMention(arg))

    if(channel && channel.type === 'text' && channel.permissionsFor(message.guild.me).has('MANAGE_CHANNELS'))
      valid.push(channel)
  })

  if(valid.length < 1)
    return message.channel.send(':warning: Please specify at least one channel')


  valid.forEach(c => {
    c.setRateLimitPerUser(timer, `Slowmode set by ${message.author.tag}`)
  })

  const channelList = valid.map(c=>c.toString()).join(', ')

  if(timer === 0)
    message.channel.send(`:white_check_mark: Slowmode has been turned off from the following channels: ${channelList}`)
  else
    message.channel.send(`:white_check_mark: Slowmode has been set to \`${timer}\` seconds following channels: ${channelList}`)

  let slowmodeMessage = timer === 0
  ? `:snail: ${message.author.tag} (\`${message.author.id}\`) set slowmode timer to off in the following channels: ${channelList}`
  : `:snail: ${message.author.tag} (\`${message.author.id}\`) set slowmode timer to \`${timer} seconds\` in the following channels: ${channelList}`

  client.logger.log('CHANNEL_SLOWMODE_EDIT', slowmodeMessage)

}

exports.help = {
  name: 'slowmode',
  info: 'Sets slowmode for one or more channels',
  usage: '...<channel> <timer>',
  unlisted: false,
}

exports.config = {
  guildOnly: true,
  ownerOnly: false,
  aliases: [],
}
