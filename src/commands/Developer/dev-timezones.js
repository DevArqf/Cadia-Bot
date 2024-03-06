const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config')
const { EmbedBuilder } = require('discord.js');

class Developers extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Get the timezones of Cadia Bot\'s Developers (DEV ONLY)'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('dev-time')
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {

		function get_time(timezone) {
			const utcTime = new Date().toUTCString();
			switch (timezone) {
				case 'GMT +5':
					const gmtPlus5Time = new Date(utcTime);
					gmtPlus5Time.setHours(gmtPlus5Time.getHours() + 13);

					const gmtPlus5_hours = gmtPlus5Time.getHours();
					const gmtPlus5_minutes = gmtPlus5Time.getMinutes().toString().padStart(2, '0');
					const gmtPlus5_ampm = gmtPlus5_hours >= 12 ? 'PM' : 'AM';
					const gmtPlus5_formattedHours = gmtPlus5_hours % 12 || 12;
					return `The current time in **GMT +5** is **${gmtPlus5_formattedHours}:${gmtPlus5_minutes} ${gmtPlus5_ampm}**\n ${emojis.custom.replyend} **Date:** ${gmtPlus5Time.toDateString()}`;

				case 'GMT +2':
					const gmtPlus2Time = new Date(utcTime);
					gmtPlus2Time.setHours(gmtPlus2Time.getHours() + 10);

					const gmtPlus2_hours = gmtPlus2Time.getHours();
					const gmtPlus2_minutes = gmtPlus2Time.getMinutes().toString().padStart(2, '0');
					const gmtPlus2_ampm = gmtPlus2_hours >= 12 ? 'PM' : 'AM';
					const gmtPlus2_formattedHours = gmtPlus2_hours % 12 || 12;
					return `The current time in **GMT +2** is **${gmtPlus2_formattedHours}:${gmtPlus2_minutes} ${gmtPlus2_ampm}**\n ${emojis.custom.replyend} **Date:** ${gmtPlus2Time.toDateString()}`;

				case 'EST':
					const estTime = new Date(utcTime);
					estTime.setHours(estTime.getHours() - -3);

					const est_hours = estTime.getHours();
					const est_minutes = estTime.getMinutes().toString().padStart(2, '0');
					const est_ampm = est_hours >= 12 ? 'PM' : 'AM';
					const est_formattedHours = est_hours % 12 || 12;
					return `The current time in **EST** is **${est_formattedHours}:${est_minutes} ${est_ampm}**\n ${emojis.custom.replyend} **Date:** ${estTime.toDateString()}`;	
				
				case 'AST':
					const astTime = new Date(utcTime);
					astTime.setHours(astTime.getHours() - -4);

					const ast_hours = astTime.getHours();
					const ast_minutes = astTime.getMinutes().toString().padStart(2, '0');
					const ast_ampm = ast_hours >= 12 ? 'PM' : 'AM';
					const ast_formattedHours = ast_hours % 12 || 12;
					return `The current time in **AST** is **${ast_formattedHours}:${ast_minutes} ${ast_ampm}**\n ${emojis.custom.replyend} **Date:** ${astTime.toDateString()}`;	

				default:
					return 'No date or time found'
			}

		}

		const embed = new EmbedBuilder()
			.setTitle(`${emojis.reg.success} Time\'s Fetched`)
			.setColor(`${color.success}`)
			.addFields(
				{ name: 'Malik\'s Time:', value: `${emojis.custom.replystart} ${get_time('AST')}`, inline: false },
				{ name: 'Navin\'s Time:', value: `${emojis.custom.replystart} ${get_time('EST')}`, inline: false },
				{ name: 'Oreo\'s Time:', value: `${emojis.custom.replystart} ${get_time('GMT +5')}`, inline: false },
                { name: 'Chaos\'s Time:', value: `${emojis.custom.replystart} ${get_time('GMT +2')}`, inline: false },
                { name: 'Rishaune\'s Time:', value: `${emojis.custom.replystart} ${get_time('EST')}`, inline: false }
			)
			.setTimestamp()
			.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() });

		return interaction.reply({ embeds: [embed] });
	}
}

module.exports = {
	Developers
};
