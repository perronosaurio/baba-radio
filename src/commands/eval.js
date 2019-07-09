const Command = require('../structures/command.js')

const { RichEmbed } = require('discord.js')
const util = require('util')
const codeBlock = (text) => `\`\`\`js\n${text}\n\`\`\``
const cleanCode = (text) => typeof text === 'string' ? text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`) : text

module.exports = class Eval extends Command {
  constructor (client) {
    super(client, {
      name: 'eval',
      aliases: ['evaluate'],
      onlyDev: true
    })
  }

  run (message, args) {
    try {
      let evaledCode = eval(args.replace(/(^`{3}(\w+)?|`{3}$)/g, ''))
      if (typeof evaledCode !== 'string') evaledCode = util.inspect(evaledCode)
      message.channel.send(
        new RichEmbed()
          .addField('Input', codeBlock(args))
          .addField('Output', codeBlock(cleanCode(evaledCode).substring(0, 1000)))
      )
    } catch (error) {
      message.channel.send(
        new RichEmbed()
          .addField('Input', codeBlock(args))
          .addField('Error output', codeBlock(cleanCode(error)))
      )
    }
  }
}
