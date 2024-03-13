const { Listener } = require('@sapphire/framework');
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { color, emojis } = require('../config');

class UserEvent extends Listener {

    constructor(context, options = {}) {
        super(context, {
            ...options,
            event: 'messageCreate',
            once: false
        });
    }

    async run(message) {
        if (message.author.bot) return;

        if (message.mentions.has(message.client.user)) {

            const commands = this.container.stores.get('commands').size;

            await message.client.guilds.fetch();

            const members = message.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
            const servers = message.client.guilds.cache.size;

            const pingEmbed = new EmbedBuilder()
                .setColor(`${color.default}`)
                .setTitle("`❓` Someone mentioned me!")
                .setDescription(
                    `Hey there **${message.author.username}**! Here is some **information** on how to **use** me!\n\n \`🔑\` **Commands**\nUse the </help:1206974259528728677> command to view a list of all my existing commands!`)
                .addFields(
                    { name: "`💡` **Total Commands:**", value: `${emojis.custom.replyend} **${commands}**`, inline: true },
                    { name: "`👤` **Total Users:**", value: `${emojis.custom.replyend} **${members}**`, inline: true },
                    { name: "`🌐` **Total Servers:**", value: `${emojis.custom.replyend} **${servers}**`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji("1206441060494999592")
                        .setLabel("Invite")
                        .setURL("https://discord.com/api/oauth2/authorize?client_id=1200475110235197631&permissions=8&scope=bot")
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setEmoji("1206440941335089153")
                        .setLabel("Support")
                        .setURL("https://discord.gg/qavsdVeyTZ")
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setEmoji("1208592226918080514")
                        .setLabel("Delete")
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId("deleteEmbed")
                );

            const reply = await message.reply({ embeds: [pingEmbed], components: [buttons] });

            message.client.on('interactionCreate', async (interaction) => {
                if (!interaction.isButton() || interaction.message.id !== reply.id) return;

                const { customId } = interaction;

                if (customId === 'deleteEmbed') {
                    try {
                        await interaction.message.delete();
                    } catch (error) {
                        console.error(error);
                            const errorEmbed = new EmbedBuilder()
                                .setColor(`${color.fail}`)
                                .setTitle(`${emojis.custom.fail} Bot Mention Error`)
                                .setDescription(`${emojis.custom.fail} I have encountered an error! Please try again later.`)
                                .setTimestamp();

                            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                                    return;
                    }
                }   
            });
        }
    }
}

module.exports = {
    UserEvent
};