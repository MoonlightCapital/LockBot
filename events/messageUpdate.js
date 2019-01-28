module.exports = (client, oldMessage, message) => {
  client.commands.get('automod').run(client, message)
}
