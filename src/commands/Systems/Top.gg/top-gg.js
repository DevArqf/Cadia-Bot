const BeemoCommand = require('../../../lib/structures/commands/BeemoCommand');
const { PermissionLevels } = require('../../../lib/types/Enums');
const { color, emojis } = require('../../../config');
const { AutoPoster } = require('topgg-autoposter');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			permissionLevel: PermissionLevels.Developer,
			description: 'Posts Cadia statistics to top.gg (DEV ONLY)'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('top-gg')
				.setDescription(this.description)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {

		await interaction.deferReply();

        const ap = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMDA0NzUxMTAyMzUxOTc2MzEiLCJib3QiOnRydWUsImlhdCI6MTcxMDk3NDk5OH0.hq1lxyZqvSXf2CUULuX26ni6DuJbyNQFi81FtFZsZc0', interaction.client);

        ap.on('posted', () => {
            interaction.editReply({ content: `${emojis.custom.success} I have **successfully** posted the stats to **Top.gg**`});
        })

        ap.on('error', () => {
            interaction.editReply({ content: `${emojis.custom.fail} **I have encountered an error! Please try again later.**`});
        })
	}
};

module.exports = {
	UserCommand
};
