const { SapphireClient, container } = require('@sapphire/framework');
const { ClientConfig } = require('../config');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class BeemoClient extends SapphireClient {
	constructor() {
		super(ClientConfig);
	}

	/**
	 *
	 * @param {string} token The token to login with
	 * @returns {Promise<string>} The token used to login
	 */
	async login(token) {
		container.db = prisma;

		return super.login(token);
	}
	destroy() {
		return super.destroy();
	}
}

module.exports = {
	BeemoClient
};
