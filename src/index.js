require('./lib/util/setup');
const { envParseString } = require('@skyra/env-utilities');
const { BeemoClient } = require('./lib/BeemoClient');
const { EmbedBuilder } = require('discord.js');
const { color, emojis } = require('./config');

const client = new BeemoClient();

// Reminder System //
const reminderSchema = require('./lib/schemas/reminderSchema');
setInterval(async () => {

    const reminders = await reminderSchema.find();

    if (!reminders) return;

    else {
        reminders.forEach(async (reminder) => {

            if (reminder.Time > Date.now()) return;

            const user = await client.users.fetch(reminder.User);
            
            user?.send({
                embeds: [new EmbedBuilder().setColor(`${color.default}`).setDescription(`${emojis.custom.wave} You asked me to **remind** you about "\`${reminder.Remind}\`"`)]
            }).catch(err => {return;});

            await reminderSchema.deleteMany({
                Time: reminder.Time,
                User: user.id,
                Remind: reminder.Remind
            });
        })
    }
}, 1000 * 5);

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login(envParseString('TOKEN'));
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();
