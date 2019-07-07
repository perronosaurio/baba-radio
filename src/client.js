const { Client } = require('discord.js')
const { search, streamURL } = require('iheart')

module.exports = class Baba extends Client {
  constructor (options) {
    super(options)
    this.once('ready', this._ready.bind(this))
  }

  _ready () {
    this.user.setActivity(`${this.guilds.size} Guilds | @Baba Radio`, { type: 'WATCHING' })
    this.log('INFO', 'I\'ve already woken up!')
  }

  log (type, ...args) {
    console.log(`[${type}]`, ...args)
  }
}
