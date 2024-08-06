import { Discord, Slash, SlashOption } from 'discordx';
import { CommandInteraction, GuildMember, EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';

@Discord()
export class UnmuteCommand {
    @Slash({
        name: 'unmute',
        description: 'Unmute a user in the server',
    })
    async unmute(
        @SlashOption({
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user you want to unmute',
            required: true,
        }) user: GuildMember,
        interaction: CommandInteraction
    ): Promise<void> {
        // Check if the user has administrator permissions
        if (!(interaction.member instanceof GuildMember) || !interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            await interaction.reply({
                content: "> *You don't have permission to use this command `MISSING PERMISSIONS: MANAGE_ROLES`*",
                ephemeral: true
            });
            return;
        }

        // Get the mute role
        const muteRole = interaction.guild?.roles.cache.find(role => role.name === 'Muted');
        if (!muteRole) {
            await interaction.reply({
                content: '> *Mute role does not exist.*',
                ephemeral: true
            });
            return;
        }

        // Remove the mute role from the user
        await user.roles.remove(muteRole);

        // Respond with confirmation embed
        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('🔊 USER UNMUTED 🔊')
            .setDescription(`${user.user.tag} has been unmuted.`)
            .addFields(
                { name: 'Moderator', value: interaction.user.tag, inline: true }
            )
            .setFooter({ text: `ID: ${user.id}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
}
