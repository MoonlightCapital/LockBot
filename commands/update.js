const {execSync} = require('child_process')

exports.run = async (client, message) => {
  execSync('git fetch origin')

  message.channel.send(':white_check_mark: Bot updated successfully')
}

exports.help = {
  name: 'update',
  info: 'Updates the bot',
  usage: '',
  unlisted: true,
}

exports.config = {
  guildOnly: false,
  ownerOnly: true,
  aliases: [],
}
