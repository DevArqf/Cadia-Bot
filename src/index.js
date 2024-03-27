require('./lib/util/setup');
const { envParseString } = require('@skyra/env-utilities');
const { BeemoClient } = require('./lib/BeemoClient');
const { EmbedBuilder } = require('discord.js');
const { color, emojis } = require('./config');

const client = new BeemoClient();

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
