const {inspect} = require('util')

exports.run = async (client, message, args) => {

  const content = args.join(' ').replace(/client\.token/gmi, '\'If someone tried to make you output the token, you were likely being scammed.\'')

  try {
    let result = await eval(content)
    if (typeof result !== 'string') {
      result = inspect(result, {
        depth: 0,
      })
    }

    if (result.includes(client.token)) result = result.replace(client.token, 'If someone tried to make you output the token, you were likely being scammed.')
    if (result.length > 1990) {
      console.log(result)
      result = 'Too long to be printed (content got console logged)'
    }

    message.channel.send(result, {code: 'js'})

  } catch(err) {
    console.error(err)

    const error = err.toString().replace(client.token, 'If someone tried to make you output the token, you were likely being scammed.')

    return message.channel.send(error, {code: 'js'})
  }
}

exports.help = {
  name: 'eval',
  info: 'Evalutates arbitrary JavaScript',
  usage: '[code]',
  unlisted: true,
}

exports.config = {
  guildOnly: false,
  ownerOnly: true,
  aliases: [],
}
