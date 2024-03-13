import { PrismaClient } from '@prisma/client';
import { ArrayString } from '@skyra/env-utilities';
import mongoose from 'mongoose';

declare module '@skyra/env-utilities' {
	interface Env {
		TOKEN: string;
		MONGO_URL: string;

		BOT_OWNERS: ArrayString;
		DEVELOPERS: ArrayString;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		db: PrismaClient;
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		GuildOnly: never;
		DevOnly: never;
		BotOwner: never;
		Everyone: never;
		Moderator: never;
		Administrator: never;
		Staff: never;
		ServerOwner: never;
	}
}
