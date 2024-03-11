const { Listener } = require('@sapphire/framework');
const { green, yellow, magenta, cyan, red, blue, gray, magentaBright, white } = require('colorette');
const figlet = require('figlet');
const os = require('os');
const { default: mongoose } = require('mongoose');
const { envParseString } = require('@skyra/env-utilities');
const dev = process.env.NODE_ENV !== 'production';

class UserEvent extends Listener {
	style = dev ? yellow : blue;

	constructor(context, options = {}) {
		super(context, {
			...options,
			once: true
		});
	}

	async run(client) {
		this.container.client = client;

		const info = this._connectDb();

		this._printBanner(info);
		this._printStoreDebugInformation();
		this._displayAdvancedConsole();
	}

	/**
	 *
	 * @param {{error: boolean; message: string}} dbInfo Whether or nor the db was connected
	 */
	_printBanner(dbInfo) {
		const success = green('+');
		const fail = red('-');

		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;
		const db = dbInfo.error ? `[${fail}] Database Not Connected (${dbInfo.message})` : `[${success}] Database Connected`;

		const line01 = llc(String.raw`   █████████                █████  ███           `);
		const line02 = llc(String.raw`  ███░░░░░███              ░░███  ░░░            `);
		const line03 = llc(String.raw` ███     ░░░   ██████    ███████  ████   ██████  `);
		const line04 = llc(String.raw`░███          ░░░░░███  ███░░███ ░░███  ░░░░░███ `);
		const line05 = llc(String.raw`░███           ███████ ░███ ░███  ░███   ███████ `);
		const line06 = llc(String.raw`░░███     ███ ███░░███ ░███ ░███  ░███  ███░░███ `);
		const line07 = llc(String.raw` ░░█████████ ░░████████░░████████ █████░░████████`);
		const line08 = llc(String.raw`  ░░░░░░░░░   ░░░░░░░░  ░░░░░░░░ ░░░░░  ░░░░░░░░ `);
		const line09 = llc(String.raw`                                                 `);

		// Offset Pad
		const pad = ' '.repeat(7);

		console.clear();
		console.log(
			String.raw`
${line01}
${line02}
${line03} ${pad}${blc('1.0.0')}
${line04} ${pad}[${success}] Gateway
${line05} ${pad}${db}
${line06}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
${line07}
${line08}
${line09}
		`.trim()
		);
	}

	_connectDb() {
		try {
			mongoose.connect(envParseString('MONGO_URL'));
			return { error: false, message: 'Database Connected' };
		} catch (error) {
			this.container.logger.fatal('- Database Not Connected');
			this.container.logger.error(error);
			return { error: true, message: error };
		}
	}

	_displayAdvancedConsole() {
		const client = this.container.client;

		const commandCount = this.container.stores.get('commands').size;
		const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
		const totalGuilds = client.guilds.cache.size;
		const botVersion = 'Cadia Alpha 1.5.0';
		const botOwner = 'Malik & Navin';

		console.log(blue('=================================='));
		console.log(magenta(`Command Count: ${commandCount}`));
		console.log(cyan(`Total Members: ${totalMembers}`));
		console.log(green(`Total Guilds: ${totalGuilds}`));
		console.log(red(`Beemo's Launch Time: ${new Date().toLocaleString()}`));
		console.log(blue(`Beemo's Version: ${botVersion}`));
		console.log(magenta(`Storage Used: ${Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)} MB`));
		console.log(cyan(`Total RAM: ${Math.round(os.totalmem() / 1024 / 1024)} MB`));
		console.log(green(`CPU: ${os.cpus()[0].model}`));
		console.log(red(`Beemo's Founders: ${botOwner}`));
		console.log(magenta(`Beemo's Developers: Oreo, Rishaune & Rudi`));
		console.log(blue('=================================='));
	}

	_printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop();

		for (const store of stores) logger.info(this._styleStore(store, false));
		logger.info(this._styleStore(last, true));
	}

	/**
	 *
	 * @param {Store<any>} store
	 * @param {boolean} last
	 * @returns
	 */
	_styleStore(store, last) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}
}

module.exports = {
	UserEvent
};
