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
        if (!msg.member.voiceChannel) return msg.channel.send(':warning:  |  **You are not on a voice channel.**');
        if(!msg.member.voiceChannel.joinable) return msg.channel.send(":warning:  |  **I\'m unable to play music in this channel.**");
        msg.member.voiceChannel.join().then(() => {
          embed.setDescription("Successfully joined!");
          embed.setColor("#b92727");
          msg.channel.send({ embed });
        });
      }
  },
    "play": {
        process: function (msg, suffix, embed) {
			const channel = msg.member.voiceChannel;
			if (!channel) return msg.channel.send(':warning:  |  **You are not on a voice channel.**');
			if (suffix) {
				if (suffix === "rap" || suffix === "Rap") {
					msg.channel.send(":musical_note:  |  **Playing:** `Rap`");
					var radio = "A-RAP-FM-WEB";
				} else if (suffix === "jazz" || suffix === "Jazz") {
					msg.channel.send(":musical_note:  |  **Playing:** `Jazz`");
					var radio = "WineFarmAndTouristradio";
				} else if (suffix === "dubstep" || suffix === "Dubstep") {
					msg.channel.send(":musical_note:  |  **Playing:** `Dubstep`");
					var radio = "ELECTROPOP-MUSIC";
				} else {
					msg.channel.send(":warning:  |  **Enter a correct radio to play, available radios:** `Rap, jazz & dubstep`");
					return;
				}
				msg.member.voiceChannel.join().then(connection => {
					require('http').get("http://streaming.radionomy.com/"+radio, (res) => {
						connection.playStream(res);
					})
				})
				.catch(console.error);
			} else {
				msg.channel.send(":warning:  |  **Enter a correct radio to play, available radios:** `Rap, jazz & dubstep`");
			}
        }
    },
	"leave": {
		process: function (msg, suffix) {
            const voiceChannel = msg.member.voiceChannel;
            if (voiceChannel) {
                if (msg.member.hasPermission("MANAGE_GUILD") == false) {
					msg.channel.send(":warning:  |  **You do not have sufficient permissions.**");
                    return
                }
				msg.channel.send(":loudspeaker:  |  **Successfully left!**");
                msg.member.voiceChannel.leave();
            } else {
                msg.channel.send(":warning:  |  **I am not currently in a voice channel.**");
            }
		}
	},
	"invite": {
		process: function (msg, suffix) {
			msg.channel.send(":tickets:  |  **Invite link:** `https://discordapp.com/oauth2/authorize?client_id=273463982625652737&scope=bot&permissions=314497`");
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
  		const command = msg.content.split(" ")[0].substring(config.prefix.length);
      const suffix = msg.content.substring(command.length + config.prefix.length + 1);
      const embed = new Discord.RichEmbed();
      try {
        commands[command].process(msg, suffix, embed);
      } catch(err) {
        msg.channel.send({embed: {"description": "<:tick:445752370324832256> **Error:** ```\n" + err + "```", "color": 0xff0000}});
      }
    }
});

bot.login(config.token);
