const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../lib/types/Enums');
const { color, emojis } = require('../../config');;
const { EmbedBuilder } = require('discord.js');
const reminderSchema = require("../../lib/schemas/reminderSchema");

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: "Get reminded so you don't have to yourself"
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
            .setName("remind")
            .setDescription(this.description)
            .addSubcommand(command => command
                .setName("set")
                .setDescription("Sets up a reminder for you.")
                .addStringOption(option => option
                    .setName("reminder")
                    .setDescription("Specified reminder will be your reminder's reason.")
                    .setRequired(true))
                .addIntegerOption(option => option
                    .setName("minutes")
                    .setDescription("Specify in how many minutes you want your reminder to be in.")
                    .setRequired(true)
                    .setMinValue(0)
                    .setMaxValue(59))
                .addIntegerOption(option => option
                    .setName("hours")
                    .setDescription("Specify in how many hours you want your reminder to be in.")
                    .setMinValue(0)
                    .setMaxValue(23)
                    .setRequired(false))
                .addIntegerOption(option => option
                    .setName("days")
                    .setDescription("Specify in how many days you want your reminder to be in.")
                    .setMinValue(0)
                    .setMaxValue(30)
                    .setRequired(false)))
                .addSubcommand(command => command.setName('cancel').setDescription('Specified reminder will be cancelled.').addStringOption(option => option.setName('id').setDescription(`Specified reminder will be cancelled. You must know the reminder's ID to do this.`).setMinLength(1).setMaxLength(30).setRequired(true)))
                .addSubcommand(command => command.setName('cancel-all').setDescription('Cancels all currently active reminders.')),
	        );
        }

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const sub = await interaction.options.getSubcommand();
 
        switch (sub) {
            case 'set':
 
        const { options } = interaction;
        const reminder = options.getString("reminder");
        const minute = options.getInteger("minutes") || 0;
        const hour = options.getInteger("hours") || 0;
        const days = options.getInteger("days") || 0;
 
        let letter = ['0','1','2','3','4','5','6','7','8','9','a','A','b','B','c','C','d','D','e','E','f','F','g','G','h','H','i','I','j','J','f','F','l','L','m','M','n','N','o','O','p','P','q','Q','r','R','s','S','t','T','u','U','v','V','w','W','x','X','y','Y','z','Z',]
        let result = Math.floor(Math.random() * letter.length);
        let result2 = Math.floor(Math.random() * letter.length);
        let result3 = Math.floor(Math.random() * letter.length);
        let result4 = Math.floor(Math.random() * letter.length);
        let result5 = Math.floor(Math.random() * letter.length);
        let result6 = Math.floor(Math.random() * letter.length);
        let result7 = Math.floor(Math.random() * letter.length);
        let result8 = Math.floor(Math.random() * letter.length);
        let result9 = Math.floor(Math.random() * letter.length);
        let result10 = Math.floor(Math.random() * letter.length);
        let result11 = Math.floor(Math.random() * letter.length);
        let result12 = Math.floor(Math.random() * letter.length);
        let result13 = Math.floor(Math.random() * letter.length);
        let result14 = Math.floor(Math.random() * letter.length);
        let result15 = Math.floor(Math.random() * letter.length);
        let result16 = Math.floor(Math.random() * letter.length);
 
        let time = Date.now() + (days * 1000 * 60 * 60 *24) + (hour * 1000 * 60 * 60) + (minute * 1000 * 60);
 
        await reminderSchema.create({
            User: interaction.user.id,
            Time: time,
            Remind: reminder,
            ID: letter[result] + letter[result2] + letter[result3] + letter[result4] + letter[result5] + letter[result6] + letter[result7] + letter[result8] + letter[result9] + letter[result10] + letter[result11] + letter[result12] + letter[result13] + letter[result14] + letter[result15] + letter[result16]
        })
 
        const embed = new EmbedBuilder()
        .setColor(color.default)
        .setTitle(`${emojis.custom.success} Reminder Set`)
        .addFields({ name: `${emojis.custom.calendar} \`-\` Time`, value: `<t:${Math.floor(time/1000)}:R>`})
        .addFields({ name: `${emojis.custom.mail} \`-\` Reminder`, value: `**${reminder}**`})
        .addFields({ name: `${emojis.custom.pencil} \`-\` Reminder ID`, value: `${letter[result] + letter[result2] + letter[result3] + letter[result4] + letter[result5] + letter[result6] + letter[result7] + letter[result8] + letter[result9] + letter[result10] + letter[result11] + letter[result12] + letter[result13] + letter[result14] + letter[result15] + letter[result16]}`})
        .setFooter({ text: `Requested by ${interaction.user.displayName}`, IconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();
 
        await interaction.reply({ embeds: [embed]});
 
        break;
        case 'cancel':
 
        const id = await interaction.options.getString('id');
        const data = await reminderSchema.findOne({ User: interaction.user.id, ID: id });
 
        if (!data) 
            return await interaction.reply({ content: `${emojis.custom.fail} No **reminder** found with the **ID:** **${id}**!`, ephemeral: true});
        else {
            await interaction.reply({ content: `${emojis.custom.success} Your **reminder** with the **ID:** **${id}** has been **cancelled**!`, ephemeral: true});
 
            await reminderSchema.deleteMany({
                User: interaction.user.id,
                ID: id
            })
        }
 
        break;
        case 'cancel-all':
 
        const alldata = await reminderSchema.find({ User: interaction.user.id });
 
        if (!alldata) 
            return await interaction.reply({ content: `${emojis.custom.fail} You **have not** set up any **reminders** yet!`, ephemeral: true });
        else {
 
            await interaction.reply({ content: `${emojis.custom.success} **All** your **reminders** have been **cancelled**!`, ephemeral: true});
 
            await reminderSchema.deleteMany({ User: interaction.user.id });
            }
        }
    }
};

module.exports = {
	UserCommand
};
