const { Listener, Events } = require('@sapphire/framework');
const { ButtonStyle, ActionRowBuilder, ButtonBuilder, Guild } = require('discord.js');

class UserEvent extends Listener {
	/**
	 * @param {Listener.LoaderContext} context
	 */
	constructor(context) {
		super(context, {
			event: Events.GuildCreate
		});
	}

	/**
	 * @param {Guild} guild
	 */
	async run(guild) {
		try {
			const owner = await guild.fetchOwner();
			const avatarURL = guild.client.user.displayAvatarURL({ format: 'png', size: 512 });
			const topChannel = guild.channels.cache
				.filter((c) => c.type === ChannelType.GuildText)
				.sort((a, b) => a.rawPosition - b.rawPosition || a.id - b.id)
				.first();
			const embed = new EmbedBuilder()
				.setColor(`${color.default}`)
				.setTitle("`⚙️` Beemo's System Message")
				.setDescription(
					"**• Thank you for adding me to your server!**\n ┌ If you need any help, please feel free to join\n └ our support server.\n\n **• Important**\n ┌ Make sure the bot's role is at the highest position\n └ in the role hierarchy to prevent any bugs or issues."
				)
				.setThumbnail(avatarURL);

			const channel = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setEmoji(':bl_Home:')
					.setLabel('Support Server')
					.setURL('https://discord.gg/SrYexYcKZ2')
					.setStyle(ButtonStyle.Link),

				new ButtonBuilder()
					.setEmoji(':bl_person_add:')
					.setLabel('Invite bot')
					.setURL('https://discord.com/api/oauth2/authorize?client_id=1200475110235197631&permissions=70368744177655&scope=bot')
					.setStyle(ButtonStyle.Link),

				new ButtonBuilder()
					.setEmoji(':bl_Chart:')
					.setLabel('Vote')
					.setURL('https://top.gg/bot/1100445112980471889')
					.setStyle(ButtonStyle.Link)
			);

			const dmbot = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setEmoji(':bl_Home:')
					.setLabel('Support Server')
					.setURL('https://discord.gg/SrYexYcKZ2')
					.setStyle(ButtonStyle.Link),

				new ButtonBuilder()
					.setEmoji(':bl_Chart:')
					.setLabel('Vote')
					.setURL('https://top.gg/bot/1100445112980471889')
					.setStyle(ButtonStyle.Link)
			);

			owner.send({ embeds: [embed], components: [dmbot] });
			topChannel.send({ embeds: [embed], components: [channel] });
		} catch (error) {
			console.error(error);
			const errorEmbed = new EmbedBuilder()
            	.setColor(`${color.fail}`)
            	.setDescription(`${emojis.custom.fail} **I have encountered an error! Please try again later.**`)
            	.setTimestamp();
			await interaction.reply({ embeds: [errorEmbed], ephemeral: true });	
		}
	}
}

module.exports = {
	UserEvent
};
