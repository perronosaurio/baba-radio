const Command = require('../structures/command.js')

const { RichEmbed } = require('discord.js')
const { search, streamURL } = require('iheart')

module.exports = class Search extends Command {
  constructor (client) {
    super(client, {
      name: 'search',
      aliases: ['find', 'play']
    })
  }

  async run (message, args) {
    const matches = await search(args)
    //console.log(matches.stations)
    const description = []
    for (let i = 0; i < 5; i++) description.push(`\`${i + 1}.\` ${matches.stations[i].name}`)
    message.channel.send(
      new RichEmbed()
        .setTitle('Choose a station to continue or say cancel! (10 seconds left)')
        .setDescription(description.join('\n'))
        .setAuthor(`Results for "${args}"`)
        .setFooter(message.author.tag)
        .setTimestamp()
    ).then(() => {
      const filter = m => m.author.id === message.author.id && ['1', '2', '3', '4', '5'].includes(m.content) || m.content.trim() === 'cancel'
      message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
        .then(collected => {
          const numberResult = Array.from(collected)[0][1].content
          if (numberResult === 'cancel') return message.channel.send('<:tick:445752370324832256> Searching canceled.')

          message.channel.send(numberResult)
        })
        .catch(collected => {
          if (collected.toString().match(/error|Error|TypeError|RangeError|Uncaught/)) return message.channel.send(`<:tick:445752370324832256> Searching canceled (Error: \`${collected}\`).`)
          return message.channel.send('<:tick:445752370324832256> Searching canceled (timeout).')
        })
    })
  }
}
