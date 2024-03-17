const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis, ClientConfig } = require('../../config');
const { EmbedBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: "View information of a user within the server"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('whois')
				.setDescription(this.description)
                .addUserOption((option) => option
                    .setName('user')
                    .setDescription('The user you want to view information of')
                    .setRequired(false)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {

		const user = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild.members.cache.get(user.id)
        if (!member) {
            const embed = new EmbedBuilder()
            .setColor(`${color.fail}`)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`I can not get this users information as they have **left** the server.`)
            .setTimestamp();
            
            return await interaction.reply({ embeds: [embed] });
        };
        
        const icon = user.displayAvatarURL();
        const tag = user.tag;

        const embed = new EmbedBuilder()
        .setColor(`${color.default}`)
        .setAuthor({ name: tag, iconURL: icon })
        .setThumbnail(icon)
        .addFields(
            { name: `**• Member:**`, value: `${emojis.custom.replyend} ${user}`, inline: false},
            { name: `**• Roles:**`, value: `${emojis.custom.replyend} ${member.roles.cache.map(r => r).join(' ')}`, inline: false},
            { name: `**• Joined Server:**`, value: `${emojis.custom.replyend} <t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true},
            { name: `**• Joined Discord:**`, value: `${emojis.custom.replyend} <t:${parseInt(user.createdAt / 1000)}:R>`, inline: true}
        )
        .setFooter({ text: `User ID: ${user.id}` })
        .setTimestamp();

        await interaction.reply({ embeds: [embed] });

    }
}


module.exports = {
	UserCommand
};


