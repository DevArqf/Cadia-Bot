const { Listener } = require('@sapphire/framework');
const { EmbedBuilder } = require("discord.js");
const { color, emojis } = require('../config');
const Level = require('../lib/schemas/levelSchema');

class UserEvent extends Listener {

    constructor(context, options = {}) {
        super(context, {
            ...options,
            event: 'messageCreate',
            once: false
        });
    }

async run (message) {
	try {
		const guildId = message.guild.id;
		const existingLevel = await Level.findOne({ guildId });

		if (!existingLevel) return;

		const userId = message.author.id;

		existingLevel.userXp += 1;
		await existingLevel.save();

		if (existingLevel.userXp >= 100) {
			existingLevel.userXp -= 100;
			existingLevel.userLevel += 1;

		const guild = client.guilds.cache.get(guildId);
		const channel = guild.channels.cache.get(existingLevel.channelId);

		let levelUpMessage = existingLevel.messages.length > 0 ?
			existingLevel.messages[0].content
				.replace('{userName}', message.author.username)
				.replace('{userMention}', `<@${userId}>`)
				.replace('{userLevel}', existingLevel.userLevel) : 
				`${emojis.custom.tada} **Congratulations** ${message.author}! You have **leveled up** to level **${existingLevel.userLevel}**!`;

		if (existingLevel.userEmbed) {
			const userAvatar = message.author.displayAvatarURL({ format: 'png', dynamic: true });
			const serverName = message.guild.name;

			const embed = new EmbedBuilder()
				.setDescription(levelUpMessage)
				.setThumbnail(userAvatar)
				.setTimestamp()
				.setTitle(serverName)
				.setColor(`${color.random}`)
				
				channel.send({ embeds: [embed] })
			} else {
				channel.send(levelUpMessage);
			}
		}
		await existingLevel.save();

	} catch (error) {
		console.error(error)
            const errorEmbed = new EmbedBuilder()
                .setColor(color.fail)
                .setDescription(`${emojis.custom.fail} **Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.**\n\n > ${emojis.custom.link} \`-\` *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
                .setTimestamp();

                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                return;
        }
    }
};

module.exports = {
    UserEvent
};