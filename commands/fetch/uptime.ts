import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import fs from "fs-extra";
import path from "path";
import { format } from 'date-fns-tz';
import { fileURLToPath } from 'url';

@Discord()
export class UptimeCommand {
  private readonly startTime = Date.now();

  @Slash({
    name: "uptime",
    description: "Shows the bot's uptime and the last change to its source code",
  })
  async uptime(interaction: CommandInteraction): Promise<void> {
    const uptimeMilliseconds = Date.now() - this.startTime;
    const uptimeSeconds = Math.floor(uptimeMilliseconds / 1000);

    const days = Math.floor(uptimeSeconds / (24 * 60 * 60));
    const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);
    const seconds = uptimeSeconds % 60;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const projectFolder = path.resolve(__dirname, "../../");
    const { lastChangeTime, timeZone } = await this.getLastModifiedTime(projectFolder);

    await interaction.deferReply();
    await interaction.editReply(
      `> 🕒 **Uptime:** ${days}d ${hours}h ${minutes}m ${seconds}s\n` +
      `> 📅 **Last change to the source code:** ${lastChangeTime} \`(${timeZone})\``
    );
  }

  private async getLastModifiedTime(dir: string): Promise<{ lastChangeTime: string; timeZone: string }> {
    const files = await fs.readdir(dir);
    let latestTime = 0;

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        const nestedTime = await this.getLastModifiedTime(filePath);
        latestTime = Math.max(latestTime, new Date(nestedTime.lastChangeTime).getTime());
      } else {
        latestTime = Math.max(latestTime, stats.mtime.getTime());
      }
    }

    const timeZone = 'Africa/Cairo'; 
    const lastChangeTime = format(new Date(latestTime), 'MMM dd, yyyy hh:mm:ss a', { timeZone });

    return { lastChangeTime, timeZone };
  }
}
