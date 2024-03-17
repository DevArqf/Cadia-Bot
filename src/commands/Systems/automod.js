const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config')
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Setup the AutoMod System within your server'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
            .setName('automod')
            .setDescription(this.description)
            .addSubcommand(command =>
                command.setName('flagged-words')
                    .setDescription('Block profanity, sexual content, and slurs'))
            .addSubcommand(command =>
                command.setName('spam-messages')
                    .setDescription('Block messages suspected of spam'))
            .addSubcommand(command =>
                command.setName('mention-spam')
                    .setDescription('Block messages containing a certain amount of mentions')
                    .addIntegerOption(option =>
                        option.setName('number')
                            .setDescription('The number of mentions required to block a message')
                            .setRequired(true)))
            .addSubcommand(command =>
                command.setName('keyword')
                    .setDescription('Block a given keyword in the server')
                    .addStringOption(option =>
                        option.setName('word')
                            .setDescription('The word you want to block')
                            .setRequired(true))),
        );
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const { guild, options } = interaction;
        const sub = options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator))
            return await interaction.reply({ content: `${emojis.custom.fail} You are not **authorized** to **execute** this command`, ephemeral: true });

        switch (sub) {
            case 'flagged-words':
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.loading} **Loading your automod rule...**`)] });

                const rule = await guild.autoModerationRules.create({
                    name: `Block profanity, sexual content, and slurs by Cadia`,
                    createId: '1200475110235197631',
                    enabled: true,
                    eventType: 1,
                    triggerType: 4,
                    triggerMetadata: {
                        presets: [1, 2, 3]
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                custommessage: `This message was prevented by Cadia's Auto Moderation`
                            }
                        }
                    ]
                }).catch(async (err) => {
                    setTimeout(async () => {
                        console.log(err);
                        await interaction.editReply({ content: `${err}` });
                    }, 2000);
                });

                setTimeout(async () => {
                    if (!rule) return;

                    const embed = new EmbedBuilder()
                        .setColor(`${color.success}`)
                        .setDescription(`${emojis.custom.success} **Your Automod rule has been successfully created!**\n ${emojis.custom.replyend} All **Swear Words** will be blocked by **${interaction.client.user}**`);

                    await interaction.editReply({ content: '', embeds: [embed] });
                }, 3000);

                break;

            case 'keyword':
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.loading} **Loading your automod rule...**`)] });
                const word = options.getString('word');

                const rule2 = await guild.autoModerationRules.create({
                    name: `Prevent the custom words from being used by Cadia`,
                    createId: '1200475110235197631',
                    enabled: true,
                    eventType: 1,
                    triggerType: 1,
                    triggerMetadata: {
                        keywordFilter: [` ${word}`]
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: `This message was prevented by Cadia's Auto Moderation`
                            }
                        }
                    ]
                }).catch(async (err) => {
                    setTimeout(async () => {
                        console.log(err);
                        await interaction.editReply({ content: `${err}` });
                    }, 2000);
                });

                setTimeout(async () => {
                    if (!rule2) return;

                    const embed2 = new EmbedBuilder()
                        .setColor(`${color.success}`)
                        .setDescription(`${emojis.custom.success} **Your Automod rule has been successfully created!**\n ${emojis.custom.replyend} All messages containing the word **${word}** will be blocked by **${interaction.client.user}**`);

                    await interaction.editReply({ content: '', embeds: [embed2] });
                }, 3000);

                break;

            case 'spam-messages':
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.loading} **Loading your automod rule...**`)] });

                const rule3 = await guild.autoModerationRules.create({
                    name: `Prevent spam messages by Cadia`,
                    createId: '1200475110235197631',
                    enabled: true,
                    eventType: 1,
                    triggerType: 3,
                    triggerMetadata: {
                        // mentionTotalLimit: number
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: `This message was prevented by Cadia's Auto Moderation`
                            }
                        }
                    ]
                }).catch(async (err) => {
                    setTimeout(async () => {
                        console.log(err);
                        await interaction.editReply({ content: `${err}` });
                    }, 2000);
                });

                setTimeout(async () => {
                    if (!rule3) return;

                    const embed3 = new EmbedBuilder()
                        .setColor(`${color.success}`)
                        .setDescription(`${emojis.custom.success} **Your Automod rule has been successfully created!**\n ${emojis.custom.replyend} All **Spam Messages** will be blocked by **${interaction.client.user}**`);

                    await interaction.editReply({ content: '', embeds: [embed3] });
                }, 3000);

                break;

            case 'mention-spam':
                await interaction.reply({ embeds: [new EmbedBuilder().setColor(`${color.invis}`).setDescription(`${emojis.custom.loading} **Loading your automod rule...**`)] });
                const number = options.getInteger('number');

                const rule4 = await guild.autoModerationRules.create({
                    name: `Prevent spam mentions by Cadia`,
                    createId: '1200475110235197631',
                    enabled: true,
                    eventType: 1,
                    triggerType: 5,
                    triggerMetadata: {
                        mentionTotalLimit: number
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: `This message was prevented by Cadia's Auto Moderation`
                            }
                        }
                    ]
                }).catch(async (err) => {
                    setTimeout(async () => {
                        console.log(err);
                        await interaction.editReply({ content: `${err}` });
                    }, 2000);
                });

                setTimeout(async () => {
                    if (!rule4) return;

                    const embed4 = new EmbedBuilder()
                        .setColor(`${color.success}`)
                        .setDescription(`${emojis.custom.success} **Your Automod rule has been **successfully** created!**\n ${emojis.custom.replyend} All **Spam Mentions** will be blocked by **${interaction.client.user}**`);

                    await interaction.editReply({ content: '', embeds: [embed4] });
                }, 3000);
        }
    }
};

module.exports = {
	UserCommand
};