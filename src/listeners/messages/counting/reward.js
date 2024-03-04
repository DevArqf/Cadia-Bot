const { Listener } = require('@sapphire/framework');
const { Message } = require('discord.js');

class UserEvent extends Listener {
	constructor(context, options) {
		super(context, {
			...options,
			event: 'successfulCount',
			name: 'rewardCounting'
		});
	}

	/**
	 * @param {Message} message The message sent
	 * @param {number} count The count the user reached
	 */
	async run(message, count) {
		const reward = await this.container.db.countingReward.findFirst({
			where: {
				milestone: count,
				guildId: message.guild.id
			}
		});

		if (!reward) return;

		const member = await message.guild.members.fetch(message.author.id);
		if (!member) return;

		await this.container.db.user.update({
			where: {
				id: member.id
			},
			data: {
				balance: {
					increment: reward.reward
				}
			}
		});

		message.channel.send({ content: `${message.author} has been rewarded with ${reward.reward} for reaching ${count}!` });

		await this.container.db.countingReward.deleteMany({
			where: {
				milestone: count,
				guildId: message.guild.id
			}
		});
	}
}

module.exports = {
	UserEvent
};
