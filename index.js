const { Client } = require('discord.js')

const client = new Client()

client.on('ready', async () => {
	const test = await search('reggaeton')
	console.log(test.stations[0])
	const url = await streamURL(test.stations[0])
	console.log(url)
	client.channels.get('330739726321713153').send(url)
})

client.login(process.env.TOKEN)
