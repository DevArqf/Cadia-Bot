import { ArrayString } from '@skyra/env-utilities';

declare module '@skyra/env-utilities' {
	interface Env {
		TOKEN: string;
		MONGO_URL: string;

		BOT_OWNERS: ArrayString;
		DEVELOPERS: ArrayString;
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		GuildOnly: never;
		BotOwner: never;
		Everyone: never;
		Moderator: never;
		Administrator: never;
		Staff: never;
		ServerOwner: never;
	}
}
