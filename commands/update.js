const {execSync} = require('child_process')

exports.run = async (client, message) => {
  execSync('git fetch origin && git reset --hard origin/lockbot')

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
