import { Discord, Slash, SlashOption } from 'discordx';
import { CommandInteraction, GuildMember, PermissionsBitField, EmbedBuilder } from 'discord.js';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';

@Discord()
export class EchoCommand {
    @Slash({
        name: 'echo',
        description: 'Make the bot say anything',
    })
    async echo(
        @SlashOption({
            name: 'message',
            type: ApplicationCommandOptionType.String, // Correct type value
            description: 'The message you want the bot to say',
            required: true,
        }) message: string,
        interaction: CommandInteraction
    ): Promise<void> {
        // Check if the user has administrator permissions
        if (!(interaction.member instanceof GuildMember) || !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply({
                content: "You don't have permission to use this command `MISSING PERMISSIONS: ADMINISTRATOR`",
                ephemeral: true
            });
            return;
        }

        // User has administrator permissions, proceed with the command execution
        await interaction.reply(message);
    }
}
