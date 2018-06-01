/*==========DISCORD.JS===========*/
const Discord = require('discord.js');
const bot = new Discord.Client();
/*==============================*/
const config = bot.config = require('./config.json'); // Global config file
console.log("[!] Starting bot...");
/*==============================*/

// Commands
const commands = {
	"help": {
		process: function (msg, suffix, embed) {
			const list = ["```perl",
			"br!help #Sends this help message",
			"br!join #Join to your voice channel",
			"br!leave #Exit the voice channel",
			"br!play <rap/jazz/dubstep> #Play a specific radio",
			"br!invite #Generate an invitation link to invite me to your server```",
			"Hi! I'm **Baba Radio**, a simple bot focused on play music. I'm developed by `perronosaurio (Waxtz)#1767`"]
			embed.setDescription(list);
			embed.setAuthor("Command list!", "https://cdn.discordapp.com/attachments/330739726321713153/451061091322298378/jajajaxdxdxd.png");
			embed.setColor("#b92727");
			msg.channel.send({ embed });
		}
  	},
	"join": {
		process: function (msg, suffix, embed) {
			if (!msg.member.voiceChannel) return msg.channel.send('<:tick:445752370324832256> You are not on a voice channel.');
			if (!msg.member.voiceChannel.joinable) return msg.channel.send("<:tick:445752370324832256> I\'m unable to play music in this channel.");
			msg.member.voiceChannel.join().then(() => {
				embed.setDescription("<:tick2:445752599631888384> Successfully joined!");
				embed.setColor("#b92727");
				msg.channel.send({ embed });
        		});
		}
	},
	"leave": {
		process: function (msg, suffix) {
			if (!msg.member.hasPermission("MANAGE_GUILD")) return msg.channel.send("<:tick:445752370324832256> You do not have sufficient permissions.");
			msg.member.voiceChannel.leave().then(() => {
				embed.setDescription("<:tick2:445752599631888384> Successfully joined!");
				embed.setColor("#b92727");
				msg.channel.send({ embed });
			}).catch(() => "<:tick:445752370324832256> I'm not in a voice channel.");
		}
	},
	"play": {
		process: function (msg, suffix, embed) {
			if (!msg.member.voiceChannel) return msg.channel.send('<:tick:445752370324832256> You are not on a voice channel.');
			if (!msg.member.voiceChannel.joinable) return msg.channel.send("<:tick:445752370324832256> I\'m unable to play music in this channel.");
			if (!suffix) {
				embed.setDescription("• Insert a correct radio to play.\n\n`[-]` **Available radios:** `Rap, jazz & dubstep`");
				embed.setColor("#b92727");
				return msg.channel.send({ embed });
			}
			let radio; // Empty Variable
			if (suffix.toLowerCase() == "rap") {
				radio = "A-RAP-FM-WEB";
			} else if (suffix.toLowerCase() == "jazz") {
				radio = "WineFarmAndTouristradio";
			} else if (suffix.toLowerCase() == "dubstep") {
				radio = "ELECTROPOP-MUSIC";
			} else {
				embed.setDescription("• Insert a correct radio to play.\n\n`[-]` **Available radios:** `Rap, jazz & dubstep`");
				embed.setColor("#b92727");
				return msg.channel.send({ embed });
			}
			msg.member.voiceChannel.join().then(connection => {
				require('http').get("http://streaming.radionomy.com/" + radio, (res) => {
					connection.playStream(res);
					embed.setColor("#b92727");
					embed.setDescription("<:tick2:445752599631888384> Playing correctly!");
					msg.channel.send({ embed });
				});
			}).catch(err => "<:tick:445752370324832256> **Error:** ```\n" + err + "```");
			}
	},
	"invite": {
		process: function (msg, suffix) {
			embed.setDescription("**Invite link:** `https://discordapp.com/oauth2/authorize?client_id=273463982625652737&scope=bot&permissions=314497");
      			embed.setColor("#b92727");
     			msg.channel.send({ embed });
		}
	}
};

// Ready Event
bot.on("ready", function () {
	console.log("[*] Logged in " + bot.guilds.array().length + " servers!");
	setInterval(function() {
  		bot.user.setActivity(config.prefix + "help | " + bot.guilds.array().length + " servers!");
  	}, 100000)
});

// Command System
bot.on('message', function (msg) {
	if (msg.content.indexOf(config.prefix) === 0) {
		console.log(`(${msg.guild.name}) ${msg.author.tag}: ${msg.content}`); // Command logger

      		const command = msg.content.split(" ")[0].substring(config.prefix.length); // Command
      		const suffix = msg.content.substring(command.length + config.prefix.length + 1); // Arguments
      		const embed = new Discord.RichEmbed(); // Gets Rich Embed

      		if (!commands[command]) return; // Return if the command doesn't exists
      		try {
			commands[command].process(msg, suffix, embed); // Execute the command
      		} catch(err) { // Catch an error
        		msg.channel.send({embed: {"description": "<:tick:445752370324832256> **Error:** ```\n" + err + "```", "color": 0xff0000}});
      		}
	}
});

bot.login(config.token);
