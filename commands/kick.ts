import { Discord, Slash, SlashOption } from 'discordx';
import { CommandInteraction, GuildMember, PermissionResolvable, EmbedBuilder, ApplicationCommandOptionType } from 'discord.js';

@Discord()
export class KickCommand {
    @Slash({
        name: 'kick',
        description: 'Kick a user from the server',
    })
    async kick(
        @SlashOption({
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user you want to kick',
            required: true,
        }) user: GuildMember,
        @SlashOption({
            name: 'reason',
            type: ApplicationCommandOptionType.String,
            description: 'The reason for kicking the user',
            required: false,
        }) reason: string | null,
        interaction: CommandInteraction
    ): Promise<void> {
        // Check if the user has kick permissions
        if (!(interaction.member instanceof GuildMember) || !interaction.member.permissions.has('KICK_MEMBERS' as PermissionResolvable)) {
            await interaction.reply({
                content: "> *You don't have permission to use this command `MISSING PERMISSIONS: KICK_MEMBERS`*",
                ephemeral: true
            });
            return;
        }

        // User has KICK_MEMBERS permissions, proceed with the command execution
        const kickReason = reason || 'No reason provided';

        // Check if the user is kickable
        if (!user.kickable) {
            await interaction.reply({
                content: "> *I cannot kick this user, they may be a user with ADMINISTRATOR perms, or a user with a role higher than me or higher than you*",
                ephemeral: true
            });
            return;
        }

        // Kick the user
        await user.kick(kickReason);

        // Respond with confirmation embed
        const embed = new EmbedBuilder()
            .setColor('#e04700')
            .setTitle('<:kick:1130774030291587162> USER KICK <:kick:1130774030291587162>')
            .setDescription(`${user.user.tag} has been kicked from the server.`)
            .addFields(
                { name: 'Moderator', value: interaction.user.tag, inline: true },
                { name: 'Reason', value: kickReason, inline: true }
            )
            .setFooter({ text: `ID: ${user.id}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
}
