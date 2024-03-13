const BeemoCommand = require('../../../lib/structures/commands/BeemoCommand');
const { EmbedBuilder, ButtonBuilder, ComponentType, ActionRowBuilder } = require('discord.js');
const { PermissionLevels } = require('../../../lib/types/Enums');
const { color, emojis } = require('../../../config');
const Guild = require('../../../lib/schemas/blacklist');

class UserCommand extends BeemoCommand {
    /**
     * @param {BeemoCommand.Context} context
     * @param {BeemoCommand.Options} options
     */
    constructor(context, options) {
        super(context, {
            ...options,
            permissionLevel: PermissionLevels.BotOwner,
            description: "View a list of all the blacklisted servers"
        });
    }

    /**
     * @param {BeemoCommand.Registry} registry
     */
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder //
            .setName('blacklist-list')
            .setDescription(this.description)
        );
    }

    /**
     * @param {BeemoCommand.ChatInputCommandInteraction} interaction
     */
    async chatInputRun(interaction) {
        try {
            const blacklistedGuilds = await Guild.find();

            if (blacklistedGuilds.length === 0) {
                return await interaction.reply(`${emojis.custom.fail} No servers have been blacklisted.`);
            }

            let currentPage = 0;
            const totalPages = Math.ceil(blacklistedGuilds.length / 5);

            const generateEmbed = () => {
                const embed = new EmbedBuilder()
                    .setTitle('Blacklisted Servers')
                    .setColor(color.default)
                    .setDescription(
                        blacklistedGuilds
                        .slice(currentPage * 5, (currentPage + 1) * 5)
                        .map(guild => `**${guild.guildName}** - ${guild.reason}`)
                        .join('\n')
                    )
                    .setFooter({ text: `Page ${currentPage + 1}/${totalPages}`, iconURL: interaction.user.displayAvatarURL() });
                return embed;
            };

            const previousButton = new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('◀️')
                .setStyle('Secondary');

            const nextButton = new ButtonBuilder()
                .setCustomId('next')
                .setLabel('▶️')
                .setStyle('Secondary');
			
            const actionRow = new ActionRowBuilder().addComponents([previousButton, nextButton]);
			const reply = await interaction.reply({ embeds: [generateEmbed()], components: [actionRow] });

			const collector = reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                filter: (i) => i.user.id === interaction.user.id,
            });

			collector.on('collect', async (interaction) => {
                if (interaction.customId === 'previous') {
                    currentPage = Math.max(currentPage - 1, 0);
                } else if (interaction.customId === 'next') {
                    currentPage = Math.min(currentPage + 1, totalPages - 1);
                }

                await interaction.update({ embeds: [generateEmbed()] });
            });

			collector.on('end', async () => {
                await reply.edit({ components: [] });
            });

            await reply.edit({ components: [actionRow] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `${emojis.custom.fail} An error occurred while processing the command.`, ephemeral: true });
        }
    }
}

module.exports = {
    UserCommand
};