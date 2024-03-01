const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { color, emojis } = require('../../config')


class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Mute a user within the server, revoking their permission to speak.'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('mute')
				.setDescription(this.description)
				.addUserOption(option =>
					option.setName('user')
						.setDescription('The user to mute')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('time')
						.setDescription('The duration to mute the user (e.g., 1m, 1h, 1d)')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('reason')
						.setDescription('Reason for the mute')
						.setRequired(false)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		try {
            // Defining Things
            const userToMute = interaction.options.getUser('user');
            const muteMember = await interaction.guild.members.fetch(userToMute.id);
            const reason = interaction.options.getString('reason') || 'No Reason Provided';
            const timeString = interaction.options.getString('time');

            // Permissions
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
                return await interaction.reply({ content: "<:bl_x_mark:1206436599794241576> You are not **authorized** to **execute** this command!", ephemeral: true });
            }
            if (!muteMember) {
                return await interaction.reply({ content: '<:bl_x_mark:1206436599794241576> The user **mentioned** is no longer within the **server**!', ephemeral: true });
            }
            if (interaction.member.id === muteMember.id) {
                return interaction.reply({ content: "<:bl_x_mark:1206436599794241576> You **cannot** mute yourself!", ephemeral: true });
            }
            if (muteMember.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: "<:bl_x_mark:1206436599794241576> You **cannot** mute **staff members** or people with the **Administrator** permission!", ephemeral: true });
            }

            // Check if the member is already unmuted
            const mutedRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
            if (muteMember.roles.cache.has(mutedRole?.id)) {
                return interaction.reply({ content: "<:bl_x_mark:1206436599794241576> This user is already **muted!**", ephemeral: true });
            }

            // Convert time string to milliseconds
            const totalMilliseconds = parseTimeStringToMilliseconds(timeString);

            // Mute Logic
            await muteMember.timeout(totalMilliseconds, reason);

            // Reply with confirmation
            const muteConfirmationEmbed = new EmbedBuilder()
            .setColor(`${color.success}`)
            .setTitle(`${emojis.reg.success} Successfully Muted User`)
            .setDescription(`**${userToMute.tag}** has been **Muted**! \n\n**• Reason:**\n > \`${reason}\``)
            .setTimestamp()
            .setFooter({ text: `Muted by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
    
            return interaction.reply({ embeds: [muteConfirmationEmbed], ephemeral: false });

        } catch (error) {
            console.error(error);

            const errorEmbed = new EmbedBuilder()
            .setColor(`${color.fail}`)
            .setTitle(`${emojis.reg.fail} Error Muting User'`)
            .setDescription('I have encountered an **error** while trying to **mute** the user.')
            .setTimestamp()
            .setFooter({ text: 'Uh Oh... I have encountered an error', iconURL: interaction.user.displayAvatarURL() })
            
        return interaction.reply({ embeds: [errorEmbed] });
        }
    }
};

function parseTimeStringToMilliseconds(timeString) {
    const regex = /^(\d+)([mhd])$/; // Matches digits followed by 'm', 'h', or 'd'
    const match = timeString.match(regex);
    if (!match) throw new Error('Invalid time string format.');

    const amount = parseInt(match[1]);
    const unit = match[2];
    let milliseconds;
    switch (unit) {
        case 'm':
            milliseconds = amount * 60 * 1000; // Convert minutes to milliseconds
            break;
        case 'h':
            milliseconds = amount * 60 * 60 * 1000; // Convert hours to milliseconds
            break;
        case 'd':
            milliseconds = amount * 24 * 60 * 60 * 1000; // Convert days to milliseconds
            break;
        default:
            throw new Error('Invalid time unit.');
    }
    return milliseconds;
}


module.exports = {
	UserCommand
};