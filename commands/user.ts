import { Discord, Slash } from 'discordx';
import { CommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js';

@Discord()
export class UserDiscord {
    @Slash(new SlashCommandBuilder()
        .setName('user')
        .setDescription('Provides information about the user.')
    )
    async user(interaction: CommandInteraction): Promise<void> {
        // Ensure interaction.member is of type GuildMember
        const member = interaction.member as GuildMember;

        const username = interaction.user.username;
        const joinedAt = member.joinedAt?.toLocaleDateString() || 'Unknown';

        await interaction.reply(`This command was run by ${username}, who joined on ${joinedAt}.`);
    }
}
