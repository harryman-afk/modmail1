import Client from "./client";
import { TextChannel, User, Collection, MessageAttachment } from "discord.js";
import { Guild } from "discord.js";
import { GuildMember } from "discord.js";
import { exec } from "child_process";
import { join } from "path";

export default class util {
	public constructor(private client: Client) {}

	// public functions
	public emojiFinder(name: string): string {
		return (
			this.client.guilds.cache
				.get("746536046275198997")
				.emojis.cache.find((e) => e.name === name)
				?.toString() || "emoji"
		);
	}

	public formatPerms(perms: string[]): string {
		if (!Array.isArray(perms) || perms.length === 0) return "`―`";

		const formattedPerms = perms.map(
			(str) =>
				`\`${str
					.replace(/_/g, " ")
					.replace(/GUILD/g, "SERVER")
					.toLowerCase()
					.replace(/\b(\w)/g, (char) => char.toUpperCase())}\``
		);

		return formattedPerms.length > 1
			? `\`${formattedPerms.slice(0, -1).join("`, `")}\` and \`${formattedPerms.slice(-1)[0]}\``
			: `\`${formattedPerms[0]}\``;
	}

	public async getChannel(id: string): Promise<TextChannel> {
		return (this.client.channels.cache.get(id) ||
			(await this.client.channels.fetch(id).catch((e) => null))) as TextChannel;
	}

	public async fetchUser(id: string): Promise<User> {
		let user: User = null;

		if (!isNaN(Number(id))) user = await this.client.users.fetch(id, true).catch((e) => null);
		else user = this.client.util.resolveUser(id, this.client.users.cache, false, false);

		return user || null;
	}

	public async fetchMember(id: string, guild: Guild): Promise<GuildMember> {
		let member: GuildMember = null;

		if (!isNaN(Number(id))) member = await guild.members.fetch(id).catch((e) => null);
		else member = this.client.util.resolveMember(id, guild.members.cache, false, false);

		return member || null;
	}

	public trimArray(arr: Array<string>, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}

	public formatBytes(bytes: number) {
		if (bytes === 0) return "0 Bytes";
		const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
	}

	public getAttachments(attachments: Collection<string, MessageAttachment>) {
		const valid = /^.*(gif|png|jpg|jpeg|mp4|mp3|pdf|psd)$/g;

		return attachments
			.array()
			.filter((attachment) => valid.test(attachment.url))
			.map((attachment) => attachment.url);
	}
}
