const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');;
const { EmbedBuilder } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: "Receive information regarding a role within the server"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('role-info')
				.setDescription(this.description)
				.addRoleOption(option =>
					option.setName("role")
						.setDescription("Choose the role to acquire the details of.")
						.setRequired(true)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const role = interaction.options.getRole('role');

        if (!role || !role.id) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${emojis.custom.warning} \`-\` The specified role does **not** exist!`)
            ],
            ephemeral: true
        })

        if (role.name === "@everyone") return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${emojis.custom.warning} \`-\` ${role.name} role is **not** available. The role **cannot** be \`@everyone\`!`)
            ],
            ephemeral: true
        }) 

		const serverIcon = interaction.guild.iconURL({ dynamic: true, format: 'png', size: 256 });
        const createdTime = parseInt(role.createdTimestamp / 1000);
        const mentionable = role.mentionable ? "true" : "false";
        const managed = role.managed ? "true" : "false";
        const hoisted = role.hoisted ? "true" : "false";
        const position = role.position
        const botrole = role.botrole ? "true" : "false";
        const permissions = role.permissions
            .toArray()
            .map((P) => `${P}`)
            .join(", ");

        const embed = new EmbedBuilder()
            .setColor(role.color)
            .addFields(
                { name: `\`👑\` \`-\` Name`, value: `${emojis.custom.replyend} **${role.name}**`, inline: true },
                { name: `\`🎨\` \`-\` Color`, value: `${emojis.custom.replyend} **${role.hexColor}**`, inline: true },
                { name: `\`👤\` \`-\` Mention`, value: `${emojis.custom.replyend} **<@&${role.id}>**`, inline: true },
                { name: `\`🔒\` \`-\` Hoisted`, value: `${emojis.custom.replyend} **${hoisted}**`, inline: true },
                { name: `\`🥇\` \`-\` Position`, value: `${emojis.custom.replyend} **${position}**`, inline: true },
                { name: `\`🔊\` \`-\` Mentionable`, value: `${emojis.custom.replyend} **${mentionable}**`, inline: true },
                { name: `\`🚨\` \`-\` Managed`, value: `${emojis.custom.replyend} **${managed}**`, inline: true },
                { name: `\`🤖\` \`-\` Bot Role`, value: `${emojis.custom.replyend} **${botrole}**`, inline: true },
                { name: `\`📅\` \`-\` Created`, value: `${emojis.custom.replyend} <t:${createdTime}:R>`, inline: true },
                { name: `\`🔑\` \`-\` Key Permissions`, value: `${permissions}`, inline: false },
            )
            .setFooter({ text: `Role ID: ${role.id}`, iconURL: interaction.user.displayAvatarURL() })
			.setThumbnail(serverIcon)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true })
    }
};

module.exports = {
	UserCommand
};