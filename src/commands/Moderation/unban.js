const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { color, emojis } = require('../../config')


class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
         requiredUserPermissions: ['BanMembers'],
			description: 'Unbans a user, allowing them to join the server again.'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('unban')
				.setDescription(this.description)
				.addStringOption(option => 
                    option.setName('user')
                        .setDescription('The user ID to unban')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for unbanning the user')
                        .setRequired(false)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Defining Things
        const userToUnban = interaction.options.getString('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        // Permissions
        // if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        //    return await interaction.reply({ content: `${emojis.custom.fail} You are not **authorized** to **execute** this command!`, ephemeral: true });
        // }
        
        if (Number.isNaN(userToUnban)) {
            return await interaction.reply({ content: `${emojis.custom.fail} You have entered something that is **not** a number!`, ephemeral: true });
        }
        
        const user = interaction.client.user.fetch(userToUnban);
        
        // Unban the user
        interaction.guild.bans.remove(userToUnban, reason)
            .then(() => {
                const embed = new EmbedBuilder()
                    .setColor(`${color.success}`)   
                    .setDescription(`${emojis.custom.success} **${user.username}** has been successfully **Unbanned**! \n\n**• Reason**\n ${emojis.custom.replyend} \`${reason}\``)
                    .setFooter({ text: `${userToUnban}` })
                    .setTimestamp();

                interaction.reply({ content: '', embeds: [embed] });
            })
            .catch(error => {
                console.error(error);
        	    const errorEmbed = new EmbedBuilder()
            	    .setColor(`${color.fail}`)
            	    .setDescription(`${emojis.custom.fail} **I have encountered an error! Please try again later.**`)
            	    .setTimestamp();

        	    interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			    return;
            });
        
    }
};

module.exports = {
	UserCommand
};