const table = require('../database/settings.js')

exports.run = async (client, message, args) => {
  const guild = client.guilds.first()

  const settings = await table.findOne({where: {serverID: guild.id}})
  const errors = []
  let failed = false

  const phrase = args.join(' ').toLowerCase()

  if(message.guild) {
    failed = true
    message.delete()
    errors.push('Not in DM')
  }

  if(phrase !== settings.verificationPhrase) {
    failed = true
    errors.push(`Wrong phrase: input was ${client.utils.escapeMarkdown(phrase)}`)
  }

  if((Date.now() - guild.members.get(message.author.id).joinedTimestamp) < 5 * 60 * 1000) {
    failed = true
    errors.push('Joined server less than 5 minutes ago')
  }

  if(failed) {
    client.logger.log('VERIFICATION_FAIL',
    `:rotating_light: ${client.utils.escapeMarkdown(message.author.tag)} (\`${message.author.id}\`) failed verification for the following reasons:

\`\`\`${errors.map(r=> '- '+r).join('\n')}\`\`\`
    `)

    return message.channel.send(':x: Please read carefully the rules and the verification instuctions channel and try again').then(m => {
      if(m.guild) m.delete(5000)
    })
  }

}

exports.help = {
  name: 'verify',
  info: 'Verifies you',
  usage: '<phrase>',
  unlisted: false,
}

exports.config = {
  guildOnly: false,
  ownerOnly: false,
  aliases: [],
}
