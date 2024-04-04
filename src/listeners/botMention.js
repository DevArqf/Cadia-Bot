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

        if (message.content.includes("<@1200475110235197631>")) {

            const commands = this.container.stores.get('commands').size;

            await message.client.guilds.fetch();

            const members = message.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
            const servers = message.client.guilds.cache.size;

            const pingEmbed = new EmbedBuilder()
                .setColor(color.default)
                .setDescription(
                    `${emojis.custom.wave} Hey there **${message.author.username}**! Here is some **information** on how to **use** me!\n\n ${emojis.custom.info} Use the </help:1220511304771440641> command to view a list of all my existing commands!`)
                .addFields(
                    { name: `${emojis.custom.slash} \`-\` **Commands:**`, value: `${emojis.custom.replyend} **${commands}**`, inline: true },
                    { name: `${emojis.custom.community} \`-\` **Users:**`, value: `${emojis.custom.replyend} **${members}**`, inline: true },
                    { name: `${emojis.custom.compass} \`-\` **Servers:**`, value: `${emojis.custom.replyend} **${servers}**`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji(emojis.custom.link)
                        .setLabel("Invite Cadia")
                        .setURL("https://discord.com/api/oauth2/authorize?client_id=1200475110235197631&permissions=8&scope=bot")
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setEmoji(emojis.custom.home)
                        .setLabel("Support Server")
                        .setURL("https://discord.gg/qavsdVeyTZ")
                        .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                        .setEmoji(emojis.custom.trash)
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
                                .setColor(color.fail)
                                .setDescription(`${emojis.custom.fail} Oopsie, I have encountered an error. The error has been **forwarded** to the developers, so please be **patient** and try running the command again later.\n\n > ${emojis.custom.link} *Have you already tried and still encountering the same error? Then please consider joining our support server [here](https://discord.gg/2XunevgrHD) for assistance or use </bugreport:1219050295770742934>*`)
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