const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const Discord = require('discord.js')
const fs = require('fs')
const config = require('./config')

global.client = new Discord.Client()

client.config = config
client.dversion = Discord.version
client.utils = require('./utilities')

try {
  client.serverconfig = require('./serverconfig')
} catch(e) {
  console.error('ERROR: serverconfig.js file is missing or broken')
  process.exit(1)
}

client.logger = require('./includes/logger')



// Taken from an idiot's guide

// Loading events
const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'))
eventFiles.forEach(file => {

  const filename = `./events/${file}`
  const eventName = file.split('.')[0]
  const event = require(filename)
  client.on(eventName, event.bind(null, client))
})

// Loading commands
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

commandFiles.forEach(file => {

  const filename = `./commands/${file}`
  const command = require(filename)
  const commandName = file.split('.')[0]
  client.commands.set(commandName, command)
})

client.login(config.token)
delete client.config.token
