require('./lib/util/setup');
const { envParseString } = require('@skyra/env-utilities');
const { BeemoClient } = require('./lib/BeemoClient');
const { EmbedBuilder } = require('discord.js');
const { color, emojis } = require('./config');

const client = new BeemoClient();

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login(envParseString('TOKEN'));
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();

// Level System //
const Level = require('./lib/schemas/levelSchema');

client.on('messageCreate', async message => {
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
	}
});
