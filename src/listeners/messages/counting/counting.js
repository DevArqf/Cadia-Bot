const { Listener, Events } = require('@sapphire/framework');
const { Message } = require('discord.js');
const { GuildSchema } = require('../../../lib/schemas/guild');
const { CountActivity } = require('../../../lib/schemas/count');

class UserEvent extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			event: Events.PreMessageParsed,
			name: 'counting'
		});
	}

	/**
	 * @param {Message} message The message sent
	 */
	async run(message) {
		const guild = message.guild;
		if (!guild) return;

		const data = await GuildSchema.findOne({ id: guild.id });

		// const data = await this.container.db.guild.findUnique({
		// 	where: {
		// 		id: guild.id
		// 	}
		// });

		if (!data) return;
		if (!data.countChannel) return;

		const channel = guild.channels.cache.get(data.countChannel);

		if (!channel || !channel.isTextBased()) return;
		if (channel.id !== message.channel.id) return;

		if (data.count === 0 && message.content !== '1') {
			if (message.deletable) message.delete();
			return;
		}

		const lastNumber = data.count;
		const currentNumber = Number(message.content);

		if (currentNumber - lastNumber !== 1) {
			channel.send({ content: `${message.author} ruined the count at **${lastNumber}**!` });

			await GuildSchema.updateOne(
				{ id: guild.id },
				{
					$set: {
						count: 0,
						countLastUser: null,
						countLastScore: data.count
					}
				}
			);

			// await this.container.db.guild.update({
			// 	where: {
			// 		id: guild.id
			// 	},
			// 	data: {
			// 		count: 0,
			// 		countLastUser: null,
			// 		countLastScore: data.count
			// 	}
			// });

			channel.send({ content: `The count has been reset to **0**` });
			return;
		}

		if (isNaN(currentNumber)) {
			message.delete();
			return;
		}

		message.react('✅');
		this.container.client.emit('successfulCount', message, currentNumber);

		const oldHighscore = data.countHighscore;
		const newHighscore = data.count > oldHighscore ? data.count : oldHighscore;

		await GuildSchema.updateOne(
			{ id: guild.id },
			{
				$set: {
					count: currentNumber,
					countLastUser: message.author.id,
					countHighscore: newHighscore
				}
			}
		);

		// await this.container.db.guild.update({
		// 	where: {
		// 		id: guild.id
		// 	},
		// 	data: {
		// 		count: currentNumber,
		// 		countLastUser: message.author.id,
		// 		countHighscore: newHighscore
		// 	}
		// });

		// await this.container.db.countActivity.upsert({
		// 	where: {
		// 		userId_guildId: {
		// 			guildId: guild.id,
		// 			userId: message.author.id
		// 		}
		// 	},
		// 	update: {
		// 		count: {
		// 			increment: 1
		// 		}
		// 	},
		// 	create: {
		// 		guildId: guild.id,
		// 		userId: message.author.id,
		// 		count: 1
		// 	}
		// });

		await CountActivity.findOneAndUpdate(
			{
				userId: message.author.id,
				guildId: guild.id
			},
			{
				$inc: {
					count: 1
				}
			},
			{
				upsert: true
			}
		);

		if (data.countGoal === currentNumber) {
			message.reply({ content: `Congratulations! You reached the goal of **${currentNumber}**!` });
			message.pinnable && message.pin();
		}
	}
}

module.exports = {
	UserEvent
};
