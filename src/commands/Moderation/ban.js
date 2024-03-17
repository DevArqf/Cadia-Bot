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
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('Reason for the banning the user')
                        .setRequired(true))
				.addUserOption(option => 
                    option.setName('user')
                        .setDescription('The user to ban')
                        .setRequired(false))
                .addAttachmentOption(option =>
                    option.setName('picture')
                        .setDescription('Attach a picture related to the ban')
                        .setRequired(false))
                .addStringOption(option =>
                    option.setName('userid')
                        .setDescription('Ban a user using their user id')
                        .setRequired(false)),
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Defining Things
        const reason = interaction.options.getString('reason');
        const picture = interaction.options.getAttachment('picture');
        const userid = interaction.options.getString('userid');
        if (userid) {
            try {
            if (Number.isNaN(userid)) {
                return await interaction.reply(`${emojis.custom.fail} You have entered an **Invalid** user ID`);
            }
            if (interaction.member.id === userid) {
                return interaction.reply({content: `${emojis.custom.fail} You **cannot** ban yourself!`, ephemeral: true});
            }

            const user = await interaction.client.users.fetch(userid);
            if (!user) {
                return await interaction.reply(`${emojis.custom.fail} You have entered an **Invalid** user ID`)
            } else {
                const banConfirmationEmbed = new EmbedBuilder()
                .setColor(`${color.success}`)
                .setDescription(`${emojis.custom.success} **${user.tag}** has been successfully **Banned**! \n\n**• Reason:**\n ${emojis.custom.replyend} \`${reason}\``)
                .setTimestamp()
                .setFooter({ text: `Moderated by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

                await interaction.guild.members.ban(user, { reason: `Moderated by ${interaction.user.tag}: ${reason}` })
                return await interaction.reply({ content: '', embeds: [banConfirmationEmbed] });
                
            }

            } catch (error) {
                console.error(error);
                const errorEmbed = new EmbedBuilder()
                    .setColor(`${color.fail}`)
                    .setTitle(`${emojis.custom.fail} Ban Command Error`)
                    .setDescription(`${emojis.custom.fail} I have encountered an error! Please try again later.`)
                    .setTimestamp();
    
                return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            };
            return;
        }
        const userToBan = interaction.options.getUser('user');
        const banMember = await interaction.guild.members.fetch(userToBan.id);



        // Permissions
        // if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            //    return await interaction.reply({ content: `${emojis.custom.fail} You are not **authorized** to **execute** this command!`, ephemeral: true});
            // }
        
            
            if (!banMember) {
                return await interaction.reply({ content:`${emojis.custom.fail} The **user** mentioned is no longer within the **server**!`, ephemeral: true});
            }

            if (banMember.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({content: `${emojis.custom.fail} You **cannot** ban **staff** members or people with the **Administrator** permission!`, ephemeral: true});
            }

        if (!banMember.kickable) {
            return await interaction.reply({ content: `${emojis.custom.fail} I **cannot** ban this user because they are either **higher** than me or you!`, ephemeral: true});
        }

        if (interaction.member.id === banMember.id) {
            return interaction.reply({content: `${emojis.custom.fail} You **cannot** ban yourself!`, ephemeral: true});
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
                .setDescription(`**${userToBan.tag}** has been **Banned**! \n\n**• Reason:**\n ${emojis.custom.replyend} \`${reason}\``)
                .setTimestamp()
                .setFooter({ text: `Moderated by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

            //Ban Failed
            await interaction.guild.members.ban(userToBan, { reason: `Moderated by ${interaction.user.tag}: ${reason}` });
            await interaction.reply({ content: '', embeds: [banConfirmationEmbed] });
        } catch (error) {
            console.error(error);
        	const errorEmbed = new EmbedBuilder()
            	.setColor(`${color.fail}`)
            	.setTitle(`${emojis.custom.fail} Ban Command Error`)
            	.setDescription(`${emojis.custom.fail} I have encountered an error! Please try again later.`)
            	.setTimestamp();

        	await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
			return;
        }
    }
};


module.exports = {
	UserCommand
};
