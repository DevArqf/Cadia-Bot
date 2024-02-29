require('./lib/util/setup');
const { envParseString } = require('@skyra/env-utilities');
const { BeemoClient } = require('./lib/BeemoClient');
const axios = require('axios');

const client = new BeemoClient();

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login(envParseString('TOKEN'));
		client.logger.info('Logged in');
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

// Avatar GIF //
client.once('ready', async () => {
	try {
		const avatarUrl = 'https://cdn.discordapp.com/attachments/944809779887501374/1212903087149285426/Cadia_GIF.gif?ex=65f38706&is=65e11206&hm=98d848d926ab2db2d82136eb68280d95bc700d2dfd2a662a80d1e0e7610c72bc&';
		const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
		await client.user.setAvatar(response.data);
		console.log('Bot avatar updated successfully!');
	} catch (error) {
		console.error('❌ Beemo failed to upload animated avatar:', error);
	}
});

main();
