import { Discord, Slash, SlashOption } from 'discordx';
import { CommandInteraction, EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } from 'discord.js';

@Discord()
export class MyDiscordBot {
    @Slash({
        name: 'embedmsg',
        description: 'Create an embed message',
    })
    async embedMsg(
        @SlashOption({
            name: 'title',
            description: 'The title of the embed',
            type: ApplicationCommandOptionType.String,  
            required: false,
        })
        title: string | null,

        @SlashOption({
            name: 'body',
            description: 'The body of the embed',
            type: ApplicationCommandOptionType.String,  
        })
        body: string,

        @SlashOption({
            name: 'footer',
            description: 'The footer of the embed',
            type: ApplicationCommandOptionType.String,  
            required: false,
        })
        footer: string | null,

        interaction: CommandInteraction
    ) {
        // Check if the user has administrator permissions
        const member = interaction.member as any;
        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({
                content: "You don't have permission to use this command `MISSING PERMISSIONS: ADMINISTRATOR`",
                ephemeral: true
            });
        }

        // Create Embed
        const embed = new EmbedBuilder()
            .setColor(0x228B22)
            .setTitle(title || '')
            .setDescription(body || '')
            .setFooter({ text: footer || '' })
            .setTimestamp();

        // Send Embed
        await interaction.reply({ embeds: [embed] });
    }
}
