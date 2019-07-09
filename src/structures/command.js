module.exports = class Command {
  constructor (client, options = {}) {
    this.client = client
    this.name = options.name
    this.aliases = options.aliases
    this.onlyDev = options.onlyDev
  }

  _run (message, args) {
    if (!this.onlyDev && message.author.id !== process.env.OWNER) return
    return this.run(message, args)
  }

  canRun () {
    return true
  }
}
