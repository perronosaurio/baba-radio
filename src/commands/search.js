const Command = require('../structures/command.js')

const { RichEmbed } = require('discord.js')
const { search, streamURL } = require('iheart')

module.exports = class Search extends Command {
  constructor (client) {
    super(client, {
      name: 'search',
      aliases: ['find', 'play', 'iheart']
    })
  }

  async run (message, args) {
    const voiceChannel = this.client.voiceConnections.find(v => v.channel.guild.id === message.member.guild.id)
    const matches = await search(args)
    const description = []

    if (message.member.voiceChannel === undefined) return message.channel.send('<:tick:445752370324832256> You\'re not in a voice channel.')
    if (!message.member.voiceChannel.joinable) return message.channel.send('<:tick:445752370324832256> I can\'t join this voice channel.')
    if (voiceChannel && voiceChannel.channel.id !== message.member.voiceChannel.id) return message.channel.send('<:tick:445752370324832256> You must be in the same voice channel as me.')
    if (matches.length === 0) return message.channel.send('<:tick:445752370324832256> No stations found.')
    for (let i = 0; i < 5; i++) description.push(`\`${i + 1}.\` ${matches.stations[i].name}`)

    message.channel.send(
      new RichEmbed()
        .setTitle('Choose a station to continue or say cancel! (10 seconds left)')
        .setDescription(description.join('\n'))
        .setAuthor(`Search results for "${args}"`, 'https://cdn.discordapp.com/attachments/330739726321713153/598282410349690890/kisspng-iheartradio-iheartmedia-app-store-internet-radio-hibiki-radio-station-5b3d78199a0fb4.png')
        .setFooter(message.author.tag)
        .setColor('b92727')
        .setTimestamp()
    ).then(() => {
      const filter = m => m.author.id === message.author.id && (['1', '2', '3', '4', '5'].includes(m.content) || m.content.trim() === 'cancel')
      message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
        .then(async c => {
          const result = Array.from(c)[0][1].content
          const station = matches.stations[result - 1]
          const stationURL = await streamURL(station)
          console.log(stationURL)
          if (result === 'cancel') return message.channel.send('<:tick:445752370324832256> Searching canceled.')

          message.member.voiceChannel.join().then(connection => {
            connection.playStream(stationURL)
            message.channel.send(
              new RichEmbed()
                .setColor('b92727')
                .setDescription([
                  `<:iheart:598282706970738711> Now playing station **${station.name}**`,
                  '',
                  `• **Frequency:** ${station.frequency} ${station.band}`,
                  `• **City:** ${station.city}`,
                  `• **Score:** ${station.score.toFixed(1)}`
                ].join('\n'))
                .setThumbnail(station.newlogo)
                .setFooter('If the station doesn\'t listen, try search another')
            )
          }).catch(e => this.client.log('error', e))
        })
        .catch(c => {
          if (c.toString().match(/error|Error|TypeError|RangeError|Uncaught/)) return message.channel.send(`<:tick:445752370324832256> Searching canceled (Error: \`${c}\`).`)
          return message.channel.send('<:tick:445752370324832256> Searching canceled (timeout).')
        })
    })
  }
}
