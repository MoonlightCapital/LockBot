const {RichEmbed} = require('discord.js')

exports.run = async (client, message, args) => {

  if(!client.serverconfig.selfroles.enabled) return

  if(args.length < 1)
    return message.channel.send(':warning: Please specify an option between `join`, `leave` or `list`')

  const option = args.shift()

  switch(option) {

    case 'join': {
      if(args.length < 1)
        return message.channel.send(':warning: Please specify the role name or ID')

      const role = message.guild.roles.get(client.utils.parseMention(args[0])) || message.guild.roles.find(r=>r.name === args.join(' '))

      if(!role || !client.serverconfig.selfroles.roles.includes(role.id))
        return message.channel.send(`:x: That role does not exist or it's not listed as selfrole. To see a full list of self-assignable roles, please do \`${client.config.prefix}selfroles list\``)

      if(!role.editable)
        return message.channel.send(':no_entry: I couldn\'t assign you that role, please contact server staff')

      if(message.member.roles.has(role.id))
        return message.channel.send(':warning: You already have that role')

      await message.member.addRole(role.id)

      message.channel.send(`:white_check_mark: ${message.author}, you assigned yourself the \`${client.utils.escapeMarkdown(role.name)}\` role`)

      break;
    }

    case 'leave': {
      if(args.length < 1)
        return message.channel.send(':warning: Please specify the role name or ID')

      const role = message.guild.roles.get(client.utils.parseMention(args[0])) || message.guild.roles.find(r=>r.name === args.join(' '))

      if(!role || !client.serverconfig.selfroles.roles.includes(role.id))
        return message.channel.send(`:x: That role does not exist or it's not listed as selfrole. To see a full list of self-assignable roles, please do \`${client.config.prefix}selfroles list\``)

      if(!role.editable)
        return message.channel.send(':no_entry: I couldn\'t remove you that role, please contact server staff')

      if(!message.member.roles.has(role.id))
        return message.channel.send(':warning: You don\'t have that role')

      await message.member.removeRole(role.id)

      message.channel.send(`:white_check_mark: ${message.author}, you removed from yourself the \`${client.utils.escapeMarkdown(role.name)}\` role`)

      break;
    }

    case 'list': {
      const embed = new RichEmbed()
      .setTitle('Listing all self-assignable roles')
      .setDescription(client.serverconfig.selfroles.roles.map(r=>`<@&${r}> (${r})`).join('\n'))
      .setFooter('Do not put the "@" sign when assigning yourself a role. Alternatively, you can use the ID in the parentheses')

      message.channel.send(embed)

      break;
    }

    default: {
      return message.channel.send(':x: Invalid option')
    }
  }

}

exports.help = {
  name: 'selfroles',
  info: 'Adds, removes or lists all the possible self-assignable roles',
  usage: '(join|leave|list) [role]',
  category: 'Security',
  unlisted: false,
}

exports.config = {
  guildOnly: true,
  ownerOnly: false,
  modOnly: false,
  aliases: [],
}
