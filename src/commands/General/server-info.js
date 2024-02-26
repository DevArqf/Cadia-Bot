const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config')
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
            const server_made = new Date(String(interaction.guild.createdAt)).getTime()/1000;
            const server_icon = interaction.guild.iconURL({ dynamic: true, format: 'png', size: 256 });
            
            const emoji_reg = interaction.guild.emojis.cache.filter(emoji => !emoji.animated).size;
            const emoji_animated = interaction.guild.emojis.cache.filter(emoji => emoji.animated).size;
            const boostLevel = interaction.guild.premiumTier;
            const maxEmojis = 50 + boostLevel * 50;
            
            if (server_icon === null) {
                const embed = new EmbedBuilder()
        	.setColor(`${color.default}`)
            .setTitle(`\`⚙️\` Server Information`)
            .addFields(
                { name: '• **Server Name:**', value: `> \`${interaction.guild.name}\``},
                { name: '• **Owner:**', value: `> ${await interaction.guild.fetchOwner()}` },
                { name: '• **Boost Tier:**', value: `> \`${boostLevel}\`` },
                { name: '• **Member Count:**', value: `> \`${interaction.guild.memberCount}\`` },
                { name: '• **Channel Count:**', value: `> \`${interaction.guild.channels.cache.size}\`` },
                { name: '• **Role Count:**', value: `> \`${interaction.guild.roles.cache.size}\`` },
                { name: '• **Emoji count:**', value: `> **Regular emojis:**\n > \`${emoji_reg}/${maxEmojis}\`\n\n > **Animated emojis:**\n > \`${emoji_animated}/${maxEmojis}\`` },
                { name: '• **Server Icon:**', value: `> \`None\``},
                { name: '• **Server Creation:**', value: `> <t:${server_made}:R>` }
                )
       		.setTimestamp()
            .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
            
        await interaction.reply({
            embeds: [embed]
        });
            } else {

        const embed_with_icon = new EmbedBuilder()
        	.setColor(`${color.default}`)
            .setTitle(`\`⚙️\` Server Information`)
            .addFields(
                { name: '• **Server Name:**', value: `> \`${interaction.guild.name}\``},
                { name: '• **Owner:**', value: `> ${await interaction.guild.fetchOwner()}` },
                { name: '• **Boost Tier:**', value: `> \`${boostLevel}\`` },
                { name: '• **Member Count:**', value: `> \`${interaction.guild.memberCount}\`` },
                { name: '• **Channel Count:**', value: `> \`${interaction.guild.channels.cache.size}\`` },
                { name: '• **Role Count:**', value: `> \`${interaction.guild.roles.cache.size}\`` },
                { name: '• **Emoji count:**', value: `> **Regular emojis:**\n > \`${emoji_reg}/${maxEmojis}\`\n\n > **Animated emojis:**\n > \`${emoji_animated}/${maxEmojis}\`` },
                { name: '• **Server Icon:**', value: `> [Click Here](${server_icon})`},
                { name: '• **Server Creation:**', value: `> <t:${server_made}:R>` }
                )
       		.setTimestamp()
            .setThumbnail(server_icon)
            .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
            
        await interaction.reply({
            embeds: [embed_with_icon]
        });
    };

        } catch (error) {
        console.error(error);
        const errorEmbed = new EmbedBuilder()
            .setColor(`${color.fail}`)
            .setTitle(`${emojis.default.fail} Error Getting Information`)
            .setDescription(`${emojis.custom.fail} I have **encountered** an **error** while getting Information`)
            .setTimestamp()
            .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() });
        await interaction.reply({ content: '', embeds: [errorEmbed] });
        }
    }

};

module.exports = {
	UserCommand
};