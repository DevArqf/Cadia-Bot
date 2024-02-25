const { SapphireClient } = require('@sapphire/framework');
const { ClientConfig } = require('../config');

class BeemoClient extends SapphireClient {
	constructor() {
		super(ClientConfig);
	}
}

module.exports = {
	BeemoClient
};
