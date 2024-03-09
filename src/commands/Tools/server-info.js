const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');
const { EmbedBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Get information about the current server'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('server-info')
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		try {
			const server_made = new Date(String(interaction.guild.createdAt)).getTime() / 1000;
			const server_icon = interaction.guild.iconURL({ dynamic: true, format: 'png', size: 256 });

			const emoji_reg = interaction.guild.emojis.cache.filter((emoji) => !emoji.animated).size;
			const emoji_animated = interaction.guild.emojis.cache.filter((emoji) => emoji.animated).size;
			const boostLevel = interaction.guild.premiumTier;
			const maxEmojis = 50 + boostLevel * 50;

				const embed = new EmbedBuilder()
					.setColor(`${color.default}`)
					.setTitle(`\`⚙️\` Server Information`)
					.addFields(
						{ name: '**Server Name:**', value: `${emojis.custom.replyend} \`${interaction.guild.name}\`` },
						{ name: '**Owner:**', value: `${emojis.custom.replyend} ${await interaction.guild.fetchOwner()}` },
						{ name: '**Boost Tier:**', value: `${emojis.custom.replyend} \`${boostLevel}\`` },
						{ name: '**Member Count:**', value: `${emojis.custom.replyend} \`${interaction.guild.memberCount}\`` },
						{ name: '**Channel Count:**', value: `${emojis.custom.replyend} \`${interaction.guild.channels.cache.size}\`` },
						{ name: '**Role Count:**', value: `${emojis.custom.replyend} \`${interaction.guild.roles.cache.size}\`` },
						{ name: '**Regular Emojis:**', value: `${emojis.custom.replyend} \`${emoji_reg}/${maxEmojis}\`` },
						{ name: '**Animated Emojis:**', value: `${emojis.custom.replyend} \`${emoji_animated}/${maxEmojis}\`` },
						{ name: '**Server Icon:**', value: `${emojis.custom.replyend} ${server_icon ? `[Click Here](${server_icon})` : '\`None\`'}` },
						{ name: '**Server Creation:**', value: `${emojis.custom.replyend} <t:${server_made}:R>` }
					)
					.setTimestamp()
					.setThumbnail(server_icon ? server_icon : null)
					.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

				await interaction.reply({
					embeds: [embed]
				});
		} catch (error) {
			console.error(error);
        	const errorEmbed = new EmbedBuilder()
            	.setColor(`${color.fail}`)
            	.setTitle(`${emojis.custom.fail} Server Info Error`)
            	.setDescription(`${emojis.custom.fail} I have encountered an error! Please try again later.`)
            	.setTimestamp();

        	return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			
		}
	}
}

module.exports = {
	UserCommand
};
