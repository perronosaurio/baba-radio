const { Client } = require('discord.js')
const { readdirSync } = require('fs')

module.exports = class Baba extends Client {
  constructor (options) {
    super(options)
    this.commands = []
    this.once('ready', this._ready.bind(this))
    this.initCommands('./src/commands')
    this.initEvents('./src/events')
  }

  _ready () {
    this.user.setActivity(`${this.guilds.size} Guilds · ${process.env.PREFIX}help`, { type: 'WATCHING' })
    this.log('info', 'I\'ve already woken up!')
  }

  log (type, ...args) {
    console.log(`[${type}]`, ...args)
  }

  initCommands (dir) {
    readdirSync(dir).forEach(file => {
      if (file.endsWith('.js')) {
        try {
          const Command = require(`./commands/${file}`)
          this.commands.push(new Command(this))
          delete require.cache[require.resolve(`./commands/${file}`)]
        } catch (err) {
          this.log('error', err)
        } finally {
          this.log('commands', `${file} loaded.`)
        }
      }
    })
  }

  initEvents (dir) {
    readdirSync(dir).forEach(file => {
      if (file.endsWith('.js')) {
        try {
          const Event = require(`./events/${file}`)
          const event = new Event(this)
          super.on(event.name, (...args) => event._run(...args))
          delete require.cache[require.resolve(`./events/${file}`)]
        } catch (err) {
          this.log('error', err)
        } finally {
          this.log('events', `${file} loaded.`)
        }
      }
    })
  }
}
