const BeemoCommand = require('../../lib/structures/commands/BeemoCommand');
const { color, emojis } = require('../../config');
const { EmbedBuilder } = require('discord.js');
const profileschema = require('../../lib/schemas/interactionSchema');
const hug = require('../../lib/data/hug.json');
const slap = require('../../lib/data/slap.json');
const kill = require('../../lib/data/kill.json');
const kiss = require('../../lib/data/kiss.json');

class UserCommand extends BeemoCommand {
	/**
	 * @param {BeemoCommand.Context} context
	 * @param {BeemoCommand.Options} options
	 */
	constructor(context, options) {
		super(context, {
			...options,
			description: 'Interact with a buddy of yours!'
		});
	}

	/**
	 * @param {BeemoCommand.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName('interact')
				.setDMPermission(false)
				.setDescription(this.description)
				.addSubcommand((command) =>
					command
						.setName('hug')
						.setDescription('Hug specified user.')
						.addUserOption((option) => option.setName('user').setDescription('Specified user will be hugged.').setRequired(true))
				)
				.addSubcommand((command) =>
					command
						.setName('slap')
						.setDescription('Slap specified user.')
						.addUserOption((option) => option.setName('user').setDescription('Specified user will be slapped.').setRequired(true))
				)
				.addSubcommand((command) =>
					command
						.setName('kill')
						.setDescription('Kill specified user.')
						.addUserOption((option) => option.setName('user').setDescription('Specified user will be killed.').setRequired(true))
				)
				.addSubcommand((command) =>
					command
						.setName('kiss')
						.setDescription('Kiss specified user.')
						.addUserOption((option) => option.setName('user').setDescription('Specified user will be kissed.').setRequired(true))
				)
				.addSubcommand((command) =>
					command
						.setName('profile')
						.setDescription(`Lists specified user's profile.`)
						.addUserOption((option) =>
							option.setName('user').setDescription('Specified user will have their profile listed.').setRequired(false)
						)
				)
		);
	}

	/**
	 * @param {BeemoCommand.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const user = (await interaction.options.getMember('user')) || interaction.member;
		const displayuser = (await interaction.options.getUser('user')) || interaction.user;

		if (!user)
			return await interaction.reply({
				content: `${emojis.custom.fail} The user \`${displayuser}\` **does not** exist within the server!`,
				ephemeral: true
			});

		const sub = interaction.options.getSubcommand();
		let data = await profileschema.findOne({ User: interaction.user.id });
		let interactdata = await profileschema.findOne({ User: displayuser.id });

		switch (sub) {
			case 'hug':
				if (interaction.user.id === displayuser.id) {
					await interaction.reply({
						content: `${emojis.custom.fail} You tried **giving yourself** a **hug**, it **didn't** work \`💔\``,
						ephemeral: true
					});
					await interaction.channel.send({
						content: `${interaction.user} tried **giving themselves** a **hug**, but they were **too** fat to do so \`💔\``
					});

					if (!data) {
						data = await profileschema.create({
							User: interaction.user.id,
							HugGive: 0,
							Hug: 0,
							Fail: 1,
							Slap: 0,
							SlapGive: 0,
							Kill: 0,
							KillGive: 0,
							Err: 0,
							Kiss: 0,
							KissGive: 0
						});
					} else {
						await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 } });
					}
				} else {
					const randomizer = Math.floor(Math.random() * hug.length);

					const hugembed = new EmbedBuilder()
						.setColor(`${color.default}`)
						.setTimestamp()
						.setTitle('`🤗` Gave a Hug!')
						.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
						.setImage(hug[randomizer])
						.addFields({ name: `**• Hug Given**`, value: `${emojis.custom.replystart} ${interaction.user} has given \n${emojis.custom.replyend} ${displayuser} a hug! \`❤️\`` });

					await interaction.reply({ embeds: [hugembed], content: `${displayuser}` });

					if (!data) {
						data = await profileschema.create({
							User: interaction.user.id,
							HugGive: 0,
							Hug: 0,
							Fail: 0,
							Slap: 0,
							SlapGive: 0,
							Kill: 0,
							KillGive: 0,
							Err: 0,
							Kiss: 0,
							KissGive: 0
						});
					} else {
						await profileschema.updateOne({ User: interaction.user.id }, { $set: { HugGive: data.HugGive + 1 } });
					}

					if (!interactdata) {
						interactdata = await profileschema.create({
							User: displayuser.id,
							HugGive: 0,
							Hug: 1,
							Fail: 0,
							Slap: 0,
							SlapGive: 0,
							Kill: 0,
							KillGive: 0,
							Err: 0,
							Kiss: 0,
							KissGive: 0
						});
					} else {
						await profileschema.updateOne({ User: displayuser.id }, { $set: { Hug: interactdata.Hug + 1 } });
					}
				}

				break;
			case 'profile':
				if (!interactdata)
					return await interaction.reply({
						content: `${emojis.custom.fail} That user **has not** been given any **statistics** yet!`,
						ephemeral: true
					});
				else {
					const statembed = new EmbedBuilder()
						.setColor(`${color.default}`)
						.setTimestamp()
						.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
						.setTitle(`${emojis.custom.right} ${displayuser.username}'s Profile ${emojis.custom.left}`)
						.addFields(
							{
								name: `**Statistics Received**`,
								value: `${emojis.custom.replystart} • **Hugs**: \`${interactdata.Hug}\` \n${emojis.custom.replycontinue} **Slaps**: \`${interactdata.Slap}\` \n${emojis.custom.replycontinue} **Kills**: \`${interactdata.Kill}\` \n${emojis.custom.replyend} **Kisses**: \`${interactdata.Kiss}\``,
								inline: false
							},
							{
								name: `**Statistics Given**`,
								value: `${emojis.custom.replystart} **Hugs**: \`${interactdata.HugGive}\` \n${emojis.custom.replycontinue} **Slaps**: \`${interactdata.SlapGive}\` \n${emojis.custom.replycontinue} **Kills**: \`${interactdata.KillGive}\` \n${emojis.custom.replyend} **Kisses**: \`${interactdata.KissGive}\``,
								inline: true
							},
							{
								name: `**Failures**`,
								value: `${emojis.custom.replystart} **Fails**: \`${interactdata.Fail}\` \n${emojis.custom.replyend} **Real Errors**: \`${interactdata.Err}\``,
								inline: false
							}
						);

					await interaction.reply({ embeds: [statembed] });
				}

				break;
			case 'slap':
				if (interaction.user.id === displayuser.id) {
					await interaction.reply({
						content: `${emojis.custom.fail} You tried **slapping yourself**, you are weird.. \`👋\``,
						ephemeral: true
					});
					await interaction.channel.send({ content: `${interaction.user} tried **slapping themselves**, for some reason.. \`👋\`` });

					if (!data) {
						data = await profileschema.create({
							User: interaction.user.id,
							HugGive: 0,
							Hug: 0,
							Fail: 1,
							Slap: 0,
							SlapGive: 0,
							Kill: 0,
							KillGive: 0,
							Err: 0,
							Kiss: 0,
							KissGive: 0
						});
					} else {
						await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 } });
					}
				} else {
					const results = [
						{ name: `${interaction.user} **slapped** ${displayuser}!`, result: `s` },
						{
							name: `${interaction.user} **slapped** ${displayuser}, \n${emojis.custom.replystart} but ${displayuser} responded with an \n${emojis.custom.replyend} **explosive** punch!`,
							result: `f`
						},
						{
							name: `${interaction.user} triggered raging mode, \n${emojis.custom.replystart} ${displayuser}'s **attempts** to avoid \n${emojis.custom.replyend} the **slap** went unoticed.`,
							result: `s`
						},
						{
							name: `${interaction.user} tried to **slap** ${displayuser} but \n${emojis.custom.replystart} ${displayuser} dodged the **attack**, \n${emojis.custom.replycontinue} what a fail! (oh yeah, ${displayuser} slapped \n${emojis.custom.replyend} you back)`,
							result: `f`
						},
						{
							name: `${interaction.user} **couldn't** slap ${displayuser} at \n${emojis.custom.replystart} first, but **Cadia Bot** helped \n${emojis.custom.replyend} them out! **What a save :o**`,
							result: `s`
						},
						{
							name: `${interaction.user} tried to **slap** ${displayuser}, \n${emojis.custom.replystart} but **Cadia Bot** felt mercy and \n${emojis.custom.replyend} **slapped** ${interaction.user} instead :(`,
							result: `f`
						},
						{ name: `${interaction.user} **slapped** ${displayuser}, \n> they will **remember** that..`, result: `s` },
						{ name: `${interaction.user} **slapped** ${displayuser}, \n> how rudeful!`, result: `s` },
						{
							name: `Looks like an **error** occured, hm.. \n${emojis.custom.replystart} perhaps the **GIF** generator is in \n${emojis.custom.replyend} another **castle**!`,
							result: `e`
						},
						{ name: `${interaction.user} **slapped** ${displayuser}, \n> lol.. **W** play \`😎\``, result: `s` },
						{ name: `${interaction.user} **slapped** ${displayuser}, \n> will they take their **revenge**?`, result: `s` }
					];

					const randomizer = Math.floor(Math.random() * slap.length);
					const failchance = Math.floor(Math.random() * results.length);

					const slapembed = new EmbedBuilder()
						.setColor(`${color.default}`)
						.setTimestamp()
						.setTitle('`👋` Ooo, a SLAP!')
						.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
						.setImage(slap[randomizer]);

					if (results[failchance].result === 'f') {
						slapembed.addFields({ name: `**• Slap Given**`, value: `\n > ${results[failchance].name}` });
					}

					if (results[failchance].result === 's') {
						slapembed.addFields({ name: `**• Slap Given**`, value: `\n > ${results[failchance].name}` });
					}

					if (results[failchance].result === 'e') {
						slapembed.addFields({ name: `**• Slap Error?**`, value: `\n > ${results[failchance].name}` });
						slapembed.setImage('https://cdn.discordapp.com/icons/1078641070180675665/c3ee76cdd52c2bba8492027dfaafa15d.webp?size=1024');

						if (!data) {
							data = await profileschema.create({
								User: interaction.user.id,
								HugGive: 0,
								Hug: 0,
								Fail: 0,
								Slap: 0,
								SlapGive: 0,
								Kill: 0,
								KillGive: 0,
								Err: 1,
								Kiss: 0,
								KissGive: 0
							});
						} else {
							await profileschema.updateOne({ User: interaction.user.id }, { $set: { Err: data.Err + 1 } });
						}
					}

					await interaction.reply({ embeds: [slapembed], content: `${displayuser}` });

					if (results[failchance].result === 'e') return;
					else {
						if (results[failchance].result === 's') {
							if (!data) {
								data = await profileschema.create({
									User: interaction.user.id,
									HugGive: 0,
									Hug: 0,
									Fail: 0,
									Slap: 0,
									SlapGive: 1,
									Kill: 0,
									KillGive: 0,
									Err: 0,
									Kiss: 0,
									KissGive: 0
								});
							} else {
								await profileschema.updateOne({ User: interaction.user.id }, { $set: { SlapGive: data.SlapGive + 1 } });
							}

							if (!interactdata) {
								interactdata = await profileschema.create({
									User: displayuser.id,
									HugGive: 0,
									Hug: 0,
									Fail: 0,
									Slap: 1,
									SlapGive: 0,
									Kill: 0,
									KillGive: 0,
									Err: 0,
									Kiss: 0,
									KissGive: 0
								});
							} else {
								await profileschema.updateOne({ User: displayuser.id }, { $set: { Slap: interactdata.Slap + 1 } });
							}
						} else if (results[failchance].result === 'f') {
							if (!data) {
								data = await profileschema.create({
									User: interaction.user.id,
									HugGive: 0,
									Hug: 0,
									Fail: 1,
									Slap: 0,
									SlapGive: 0,
									Kill: 0,
									KillGive: 0,
									Err: 0,
									Kiss: 0,
									KissGive: 0
								});
							} else {
								await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 } });
								await profileschema.updateOne({ User: interaction.user.id }, { $set: { Slap: data.Slap + 1 } });
							}

							if (!interactdata) {
								interactdata = await profileschema.create({
									User: displayuser.id,
									HugGive: 0,
									Hug: 0,
									Fail: 0,
									Slap: 0,
									SlapGive: 1,
									Kill: 0,
									KillGive: 0,
									Err: 0,
									Kiss: 0,
									KissGive: 0
								});
							} else {
								await profileschema.updateOne({ User: displayuser.id }, { $set: { SlapGive: interactdata.SlapGive + 1 } });
							}
						}
					}
				}

				break;
			case 'kill':
				if (interaction.user.id === displayuser.id) {
					await interaction.reply({
						content: `${emojis.custom.fail} You tried **killing yourself**, emotional damage? \`🔪\``,
						ephemeral: true
					});
					await interaction.channel.send({ content: `${interaction.user} tried **killing themselves**, give them some support.. \`🔪\`` });

					if (!data) {
						data = await profileschema.create({
							User: interaction.user.id,
							HugGive: 0,
							Hug: 0,
							Fail: 1,
							Slap: 0,
							SlapGive: 0,
							Kill: 0,
							KillGive: 0,
							Err: 0,
							Kiss: 0,
							KissGive: 0
						});
					} else {
						await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 } });
					}
				} else {
					const results = [
						{ name: `${interaction.user} **killed** ${displayuser}!`, result: `s` },
						{
							name: `${interaction.user} **tried to kill** ${displayuser}, \n${emojis.custom.replystart} but ${displayuser} responded with an \n${emojis.custom.replyend} **explosive** punch!`,
							result: `f`
						},
						{
							name: `${interaction.user} triggered raging mode, \n${emojis.custom.replystart} ${displayuser}'s **attempts** to avoid \n${emojis.custom.replyend} the **knife** went unoticed.`,
							result: `s`
						},
						{
							name: `${interaction.user} tried to **kill** ${displayuser} but \n${emojis.custom.replystart} ${displayuser} dodged the **attack**, \n${emojis.custom.replycontinue} what a fail! (oh yeah, ${displayuser} killed \n${emojis.custom.replyend} you)`,
							result: `f`
						},
						{
							name: `${interaction.user} **couldn't** kill ${displayuser} at \n${emojis.custom.replystart} first, but **Cadia Bot** helped \n${emojis.custom.replyend} them out! **Group murder babbyyy!**`,
							result: `s`
						},
						{
							name: `${interaction.user} tried to **kill** ${displayuser}, \n${emojis.custom.replystart} but **Cadia Bot** felt mercy and \n${emojis.custom.replyend} **killed** ${interaction.user} instead :(`,
							result: `f`
						},
						{ name: `${interaction.user} **killed** ${displayuser}, \n> they will **remember** that..`, result: `s` },
						{ name: `${interaction.user} **killed** ${displayuser}, \n> how evil!`, result: `s` },
						{ name: `${interaction.user} **killed** ${displayuser}, \n> lol.. **skill issue** \`😎\``, result: `s` },
						{
							name: `${interaction.user} **killed** ${displayuser}, \n${emojis.custom.replystart} will they take their **revenge** (they won't, \n${emojis.custom.replyend} they are dead)`,
							result: `s`
						}
					];

					const randomizer = Math.floor(Math.random() * kill.length);
					const failchance = Math.floor(Math.random() * results.length);

					const killembed = new EmbedBuilder()
						.setColor('DarkRed')
						.setTimestamp()
						.setTitle('`🔪` A murder!')
						.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
						.setImage(kill[randomizer]);

					if (results[failchance].result === 'f') {
						killembed.addFields({ name: `**• Kill Confirmed**`, value: `\n > ${results[failchance].name}` });
					}

					if (results[failchance].result === 's') {
						killembed.addFields({ name: `**• Murder Failed**`, value: `\n > ${results[failchance].name}` });
					}

					await interaction.reply({ embeds: [killembed], content: `${displayuser}` });

					if (results[failchance].result === 's') {
						if (!data) {
							data = await profileschema.create({
								User: interaction.user.id,
								HugGive: 0,
								Hug: 0,
								Fail: 0,
								Slap: 0,
								SlapGive: 0,
								Kill: 0,
								KillGive: 1,
								Err: 0,
								Kiss: 0,
								KissGive: 0
							});
						} else {
							await profileschema.updateOne({ User: interaction.user.id }, { $set: { KillGive: data.KillGive + 1 } });
						}

						if (!interactdata) {
							interactdata = await profileschema.create({
								User: displayuser.id,
								HugGive: 0,
								Hug: 0,
								Fail: 0,
								Slap: 0,
								SlapGive: 0,
								Kill: 1,
								KillGive: 0,
								Err: 0,
								Kiss: 0,
								KissGive: 0
							});
						} else {
							await profileschema.updateOne({ User: displayuser.id }, { $set: { Kill: interactdata.Kill + 1 } });
						}
					} else if (results[failchance].result === 'f') {
						if (!data) {
							data = await profileschema.create({
								User: interaction.user.id,
								HugGive: 0,
								Hug: 0,
								Fail: 1,
								Slap: 0,
								SlapGive: 0,
								Kill: 0,
								KillGive: 0,
								Err: 0,
								Kiss: 0,
								KissGive: 0
							});
						} else {
							await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 } });
							await profileschema.updateOne({ User: interaction.user.id }, { $set: { Slap: data.Kill + 1 } });
						}

						if (!interactdata) {
							interactdata = await profileschema.create({
								User: displayuser.id,
								HugGive: 0,
								Hug: 0,
								Fail: 0,
								Slap: 0,
								SlapGive: 0,
								Kill: 0,
								KillGive: 1,
								Err: 0,
								Kiss: 0,
								KissGive: 0
							});
						} else {
							await profileschema.updateOne({ User: displayuser.id }, { $set: { KillGive: interactdata.KillGive + 1 } });
						}
					}
				}

				break;
			case 'kiss':
				if (interaction.user.id === displayuser.id) {
					await interaction.reply({
						content: `${emojis.custom.fail} You tried **kissing yourself**, feel lonely? \`💋\``,
						ephemeral: true
					});
					await interaction.channel.send({
						content: `${interaction.user} tried **kissing themselves**, they feel lonely, please befriend them. \`💋\``
					});

					if (!data) {
						data = await profileschema.create({
							User: interaction.user.id,
							HugGive: 0,
							Hug: 0,
							Fail: 1,
							Slap: 0,
							SlapGive: 0,
							Kill: 0,
							KillGive: 0,
							Err: 0,
							Kiss: 0,
							KissGive: 0
						});
					} else {
						await profileschema.updateOne({ User: interaction.user.id }, { $set: { Fail: data.Fail + 1 } });
					}
				} else {
					const results = [
						{ name: `${interaction.user} **kissed** ${displayuser}!`, result: `s` },
						{
							name: `${interaction.user} **tried to kiss** ${displayuser}, \n${emojis.custom.replystart} but ${displayuser} responded with an \n${emojis.custom.replyend} **explosive** slap to the face!`,
							result: `f`
						},
						{
							name: `${interaction.user} triggered raging mode, \n${emojis.custom.replystart} ${displayuser}'s **attempts** to avoid \n${emojis.custom.replyend} the **kiss** went unnoticed.`,
							result: `s`
						},
						{
							name: `${interaction.user} tried to **kiss** ${displayuser} but \n${emojis.custom.replystart} ${displayuser} dodged their **mouth**, \n${emojis.custom.replycontinue} what a fail! (oh yeah, ${displayuser} reported \n${emojis.custom.replyend} you for sexual harassment)`,
							result: `f`
						},
						{
							name: `${interaction.user} **couldn't** kiss ${displayuser} at \n${emojis.custom.replystart} first, but **Cadia Bot** helped \n${emojis.custom.replyend} them out! **We all need a little help!**`,
							result: `s`
						},
						{
							name: `${interaction.user} tried to **kiss** ${displayuser}, \n${emojis.custom.replystart} but **Cadia Bot** felt mercy and \n${emojis.custom.replyend} **kissed** ${interaction.user} instead, what`,
							result: `f`
						},
						{ name: `${interaction.user} **kissed** ${displayuser}, \n> they **liked** that..`, result: `s` },
						{ name: `${interaction.user} **kissed** ${displayuser}, \n> how romantic!`, result: `s` },
						{ name: `${interaction.user} **kissed** ${displayuser}, \n> lol.. **W** rizz \`😎\``, result: `s` },
						{ name: `${interaction.user} **kissed** ${displayuser}, \n> will they do it back?`, result: `s` }
					];

					const randomizer = Math.floor(Math.random() * kill.length);
					const failchance = Math.floor(Math.random() * results.length);

					const kissembed = new EmbedBuilder()
						.setColor('DarkRed')
						.setTimestamp()
						.setTitle('`💋` A wonderful kiss!')
						.setFooter({ text: `Requested by ${interaction.user.displayName}`, iconURL: interaction.client.user.displayAvatarURL() })
						.setThumbnail(interaction.client.user.displayAvatarURL())
						.setImage(kiss[randomizer]);

					if (results[failchance].result === 'f') {
						kissembed.addFields({ name: `**• You were rejected**`, value: `\n > ${results[failchance].name}` });
					}

					if (results[failchance].result === 's') {
						kissembed.addFields({ name: `**• You kissed someone**`, value: `\n > ${results[failchance].name}` });
					}

					await interaction.reply({ embeds: [kissembed], content: `${displayuser}` });

					if (results[failchance].result === 's') {
						if (!data) {
							data = await profileschema.create({
								User: interaction.user.id,
								HugGive: 0,
								Hug: 0,
								Fail: 0,
								Slap: 0,
								SlapGive: 0,
								Kill: 0,
								KillGive: 0,
								Err: 0,
								Kiss: 0,
								KissGive: 1
							});
						} else {
							await profileschema.updateOne({ User: interaction.user.id }, { $set: { KissGive: data.KissGive + 1 } });
						}

						if (!interactdata) {
							interactdata = await profileschema.create({
								User: displayuser.id,
								HugGive: 0,
								Hug: 0,
								Fail: 0,
								Slap: 0,
								SlapGive: 0,
								Kill: 0,
								KillGive: 0,
								Err: 0,
								Kiss: 1,
								KissGive: 0
							});
						} else {
							await profileschema.updateOne({ User: displayuser.id }, { $set: { Kiss: interactdata.Kiss + 1 } });
						}
					}
				}
		}
	}
}

module.exports = {
	UserCommand
};
