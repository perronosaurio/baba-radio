const Client = require('./src/client.js')
const client = new Client({ fetchAllMembers: true, disableEveryone: true })

client.login(process.env.TOKEN).catch(e => client.log('error', e))
