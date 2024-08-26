import { CommandInteraction, Guild, PermissionsBitField } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class ServerStats {
  @Slash({
    name: "serverstats",
    description: "Gathers and displays server statistics.",
  })
  async serverStats(interaction: CommandInteraction): Promise<void> {
    const guild = interaction.guild as Guild;

    if (!guild) {
      await interaction.reply("This command can only be used in a server.");
      return;
    }

    // Fetch server members and channels
    const members = await guild.members.fetch();
    const channels = await guild.channels.fetch();
    const roles = await guild.roles.fetch();

    // Calculate the statistics
    const totalMembers = members.size;
    const totalBots = members.filter((member) => member.user.bot).size;
    const totalAdminPerms = members.filter((member) =>
      member.permissions.has(PermissionsBitField.Flags.Administrator)
    ).size;
    const totalMods = members.filter((member) =>
      member.permissions.has(PermissionsBitField.Flags.ModerateMembers)
    ).size;
    const totalBoosts = guild.premiumSubscriptionCount ?? 0;
    const totalChannels = channels.size;
    

    // Respond with the collected stats
    await interaction.deferReply();
    await interaction.editReply(
      `**Server Statistics:**\n` +
      `> Total Members: ${totalMembers}\n` +
      `> Total Bots: ${totalBots}\n` +
      `> Total Admins: ${totalAdminPerms}\n` +
      `> Total Mods: ${totalMods}\n` +
      `> Total Boosts: ${totalBoosts}\n` +
      `> Total Channels: ${totalChannels}`
    );
  }
}

