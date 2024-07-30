import { Discord, Slash, SlashOption } from 'discordx';
import { CommandInteraction, GuildMember, EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';

@Discord()
export class BanCommand {
    @Slash({
        name: 'ban',
        description: 'Ban a user from the server',
    })
    async ban(
        @SlashOption({
            name: 'user',
            type: ApplicationCommandOptionType.User, 
            description: 'The user you want to ban',
            required: true,
        }) user: GuildMember,
        @SlashOption({
            name: 'reason',
            type: ApplicationCommandOptionType.String, 
            description: 'The reason for banning the user',
            required: false,
        }) reason: string | null,
        interaction: CommandInteraction
    ): Promise<void> {
        // Check if the user has administrator permissions
        if (!(interaction.member instanceof GuildMember) || !interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            await interaction.reply({
                content: "> *You don't have permission to use this command `MISSING PERMISSIONS: BAN_MEMBERS`*",
                ephemeral: true
            });
            return;
        }

        // User has BAN_MEMBERS permissions, proceed with the command execution
        const banReason = reason || 'No reason provided';

        // Check if the user is bannable
        if (!user.bannable) {
            await interaction.reply({
                content: "> *I cannot ban this user, they may be a user with ADMINISTRATOR perms, or a user with a role higher than me or higher than you*",
                ephemeral: true
            });
            return;
        }

        // Ban the user
        await user.ban({ reason: banReason });

        // Respond with confirmation embed
        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('<:Ban:1138521731003322429> USER BAN <:Ban:1138521731003322429>')
            .setDescription(`${user.user.tag} has been banned from the server.`)
            .addFields(
                { name: 'Moderator', value: interaction.user.tag, inline: true },
                { name: 'Reason', value: banReason, inline: true }
            )
            .setFooter({ text: `ID: ${user.id}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
}
