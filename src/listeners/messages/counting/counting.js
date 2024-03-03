const { Listener, Events } = require('@sapphire/framework');
const { Message } = require('discord.js');

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

		const data = await this.container.db.guild.findUnique({
			where: {
				id: guild.id
			}
		});

		if (!data) return;
		if (!data.countChannel) return;

		const channel = guild.channels.cache.get(data.counting.channel);

		if (!channel || !channel.isTextBased()) return;
		if (channel.id !== message.channel.id) return;

		const lastNumber = data.count;
		const currentNumber = Number(message.content);

		if (currentNumber - lastNumber !== 1) {
			channel.send({ content: `${message.author} ruined the count at ${lastNumber}!` });

			await this.container.db.guild.update({
				where: {
					id: guild.id
				},
				data: {
					count: 0,
					countLastUser: null,
					countHighscore: newHighscore,
					countLastScore: data.count
				}
			});

			channel.send({ content: `The count has been reset to 0` });
			return;
		}

		if (isNaN(currentNumber) || data.countLastUser === message.author.id) {
			message.delete();
			return;
		}

		const oldHighscore = data.countHighscore;
		const newHighscore = data.count > oldHighscore ? data.count : oldHighscore;

		this.container.db.guild.update({
			where: {
				id: guild.id
			},
			data: {
				count: currentNumber,
				countLastUser: message.author.id,
				countHighscore: newHighscore
			}
		});

		this.container.client.emit('successfulCount', message, currentNumber);
	}
}

module.exports = {
	UserEvent
};
