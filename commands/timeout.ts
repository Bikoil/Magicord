import { Discord, Slash, SlashOption } from 'discordx';
import { CommandInteraction, GuildMember, ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';

@Discord()
export class TimeoutCommand {
    @Slash({
        name: 'timeout',
        description: "Timeout a user using Discord's timeout feature"
    })
    async timeout(
        @SlashOption({
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user you want to timeout',
            required: true,
        }) user: GuildMember,
        @SlashOption({
            name: 'reason',
            type: ApplicationCommandOptionType.String,
            description: 'The reason for the timeout',
            required: false,
        }) reason: string | null,
        @SlashOption({
            name: 'time',
            type: ApplicationCommandOptionType.String,
            description: 'The duration for which the user will be timed out (e.g., 1m, 2h)',
            required: false,
        }) time: string | null,
        interaction: CommandInteraction
    ) {