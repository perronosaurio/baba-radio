module.exports = class Event {
  constructor (client, options = {}) {
    this.client = client
    this.name = options.name
  }

  _run (...args) {
    return this.run(...args)
  }
}
