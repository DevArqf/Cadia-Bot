const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionFlagsBits } = require('discord.js');
const { color, emojis } = require('../../config');;
const { EmbedBuilder } = require('discord.js');
const { UserSettingsSchema } = require('../../lib/schemas/usersettingSchema');

class UserCommand extends BeemoCommand {
    /**
     * @param {BeemoCommand.Context} context
     * @param {BeemoCommand.Options} options
     */
    constructor(context, options) {
        super(context, {
            ...options,
            description: "Send a Anonymous DM to a user within the server"
        });
    }

    /**
     * @param {BeemoCommand.Registry} registry
     */
    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder //
                .setName('dm')
                .setDescription(this.description)
                .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                .addSubcommand((subcommand) =>
                    subcommand //
                        .setName('send')
                        .setDescription('Send a direct message to a user')
                        .addUserOption(option =>
                            option
                                .setName('user')
                                .setDescription('The user that should receive a DM')
                                .setRequired(true))
                        .addStringOption(option =>
                            option
                                .setName('message')
                                .setDescription('The message that the user should receive')
                                .setRequired(true)))
                .addSubcommand((subcommand) =>
                    subcommand //
                        .setName('toggle')
                        .setDescription('Toggle to receive DMs or not')
                        .addStringOption(option =>
                            option
                                .setName('action')
                                .setDescription('Choose to opt-in or opt-out of receiving DMs')
                                .setRequired(true)
                                .addChoices(
                                    { name: "opt-out", value: "opt-out" },
                                    { name: "opt-in", value: "opt-in" }
                                )
                        )
                )
        );
    }

    /**
     * @param {BeemoCommand.ChatInputCommandInteraction} interaction
     */
    async chatInputRun(interaction) {
        const subcommand = interaction.options.getSubcommand();
    
        if (subcommand === 'send') {
            const user = interaction.options.getUser('user');
            const message = interaction.options.getString('message');
            
            // Check if the user has opted out
            const userId = user.id;
            const userSettings = await UserSettingsSchema.findOne({ userId });
            if (userSettings && !userSettings.receiveDMs) {
                interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} **${user.tag}** has **opted out** and can **no longer** receive DMs.`)], ephemeral: true });
                return;
            }
    
            const embed = new EmbedBuilder()
                .setTitle(`${emojis.custom.mail} DM Received`)
                .setColor(color.default)
                .addFields(
                    { name: `${emojis.custom.pencil} Message`, value: `${emojis.custom.replyend} ${message}` },
                    { name: `${emojis.custom.home} Server`, value: `${emojis.custom.replyend} ${interaction.guild.name}` },
                    { name: `${emojis.custom.person} Author`, value: `${emojis.custom.replyend} <@${interaction.user.id}>` },
                )
                .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();
    
            await user.send({ embeds: [embed] })
                .then(() => {
                    interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.success} The message has been **successfully** sent to **${user.tag}**!`)], ephemeral: true });
                })
                .catch(() => {
                    interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} **${user.tag}** has Direct Messages **disabled**!`)], ephemeral: true });
                });
    
        } else if (subcommand === 'toggle') {
            const action = interaction.options.getString('action');

            if (action === 'opt-out') {
                // Opt-out: Set receiveDMs to false
                const userId = interaction.user.id;
                let userSettings = await UserSettingsSchema.findOne({ userId });

                if (!userSettings) {
                    userSettings = new UserSettingsSchema({ userId, receiveDMs: false });
                } else {
                    userSettings.receiveDMs = false;
                }

                await userSettings.save();
                interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.success} You have **opted out**. You can **no longer** receive Direct Messages from the command!`)], ephemeral: true });
            } else if (action === 'opt-in') {
                // Opt-in: Set receiveDMs to true
                const userId = interaction.user.id;
                let userSettings = await UserSettingsSchema.findOne({ userId });

                if (!userSettings) {
                    userSettings = new UserSettingsSchema({ userId, receiveDMs: true });
                } else {
                    userSettings.receiveDMs = true;
                }

                await userSettings.save();
                interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription( `${emojis.custom.success} You have **opted in**. You can now **receive** Direct Messages once again!`)], ephemeral: true });
            } else {
                // Invalid action
                interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.fail} Invalid action. Please choose either "opt-out" or "opt-in".`)], ephemeral: true });
            }
        }
    }
}

module.exports = {
    UserCommand
};
