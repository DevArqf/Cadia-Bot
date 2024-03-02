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
			description: 'Ban a user from the server, revoking access for them to join again.'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('ban')
				.setDescription(this.description)
				.addUserOption(option => 
                    option.setName('user')
                        .setDescription('The user to ban')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for the banning the user')
                        .setRequired(true))
                .addAttachmentOption(option =>
                    option.setName('picture')
                        .setDescription('Attach a picture related to the ban')
                        .setRequired(false)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Defining Things
        const userToBan = interaction.options.getUser('user');
        const banMember = await interaction.guild.members.fetch(userToBan.id);
        const reason = interaction.options.getString('reason');
        const picture = interaction.options.getAttachment('picture');

        // Permissions
        // if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        //    return await interaction.reply({ content: "<:bl_x_mark:1206436599794241576> You are not **authorized** to **execute** this command!", ephemeral: true});
        // }

        if (!banMember) {
            return await interaction.reply({ content: '<:bl_x_mark:1206436599794241576> The **user** mentioned is no longer within the **server**!', ephemeral: true});
        }

        if (!banMember.kickable) {
            return await interaction.reply({ content: "<:bl_x_mark:1206436599794241576> I **cannot** ban this user because they are either **higher** than me or you!", ephemeral: true});
        }

        if (interaction.member.id === banMember.id) {
            return interaction.reply({content: "<:bl_x_mark:1206436599794241576> You **cannot** ban yourself!", ephemeral: true});
        }

        if (banMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({content: "<:bl_x_mark:1206436599794241576> You **cannot** ban **staff** members or people with the **Administrator** permission!", ephemeral: true});
        }

        // DM Message
        try {
            const dmEmbed = new EmbedBuilder()
                .setColor(`${color.fail}`)
                .setTitle(`\`🚫\` You have been banned from **${interaction.guild.name}**`)
                .setDescription(`**• Server:**\n > \`${interaction.guild.name}\`\n**• Reason:**\n > \`${reason}\``)
                .setThumbnail(interaction.guild.iconURL())
                .setTimestamp()
                .setFooter({ text: `Banned by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            if (picture) {
                dmEmbed.setImage(picture.url);
                dmEmbed.addFields({ name: 'Related Image:', value: '`👇` See below `👇`' });
            }

            await userToBan.send({ embeds: [dmEmbed] }).catch(error => console.error(`I **couldn\'t** send a DM to ${userToBan.tag}.`, error));
            
            // Ban Successful
            const banConfirmationEmbed = new EmbedBuilder()
                .setColor(`${color.success}`)
                .setTitle(`${emojis.reg.success} Ban Successful`)
                .setDescription(`**${userToBan.tag}** has been **banned** from the server.`)
                .addFields({ name: '**• Reason:**', value: reason })
                .setTimestamp()
                .setFooter({ text: `Banned by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            //Ban Failed
            await interaction.guild.members.ban(userToBan, { reason: `Banned by ${interaction.user.tag}: ${reason}` });
            await interaction.reply({ content: '', embeds: [banConfirmationEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor(`${color.fail}`)
                .setTitle(`${emojis.reg.fail} Error Banning User`)
                .setDescription(`I have **Failed** to ban **${userToBan.tag}** from the server.`)
                .setTimestamp()
                .setFooter({ text: 'Uh Oh... I have encountered an error', iconURL: interaction.user.displayAvatarURL() });
            await interaction.reply({ content: '', embeds: [errorEmbed] });
        }
    }
};


module.exports = {
	UserCommand
};
