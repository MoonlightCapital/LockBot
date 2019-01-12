module.exports.log = function(action, message) {
  if(!action || !message) return
  const config = client.serverconfig

  const channel = client.channels.get(config.log_channel)
  if(!channel || channel.type !== 'text') return console.log('Tried to log an action, but the channel was not found')

  const shouldLog = config.logged_actions.includes(action) || config.logged_actions.includes('*')
  if(!shouldLog) return

  channel.send(message).then(() => {
    //
  }).catch((err) => {
    console.error('Something went wrong with logging an action: ', err)
  })

}

module.exports.announce = function(message) {
  if(!message) return

  const channel = client.channels.get(client.serverconfig.announcement_channel)
  if(!channel || channel.type !== 'text') return console.log('Tried to send an announcement, but the channel was not found')


  channel.send(message, {mentionEveryone: true}).then(() => {
    //
  }).catch((err) => {
    console.error('Something went wrong with sending an announcement: ', err)
  })
}
