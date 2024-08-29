import { dirname, importx } from "@discordx/importer";
import type { Interaction, Message } from "discord.js";
import { IntentsBitField, ActivityType } from "discord.js"; // Import ActivityType
import { Client } from "discordx";

console.log(`$$\\      $$\\                     $$\\                                     $$\\ 
$$$\\    $$$ |                    \\__|                                    $$ |
$$$$\\  $$$$ | $$$$$\\\\   $$$$$\\\\  $$\\  $$$$$$$\\  $$$$$\\\\   $$$$$\\\\   $$$$$$$ |
$$\\$$\\$$ $$ | \\____$$\\ $$  __$$\\ $$ |$$  _____|$$  __$$\\ $$  __$$\\ $$  __$$ |
$$ \\$$$  $$ | $$$$$$$ |$$ /  $$ |$$ |$$ /      $$ /  $$ |$$ |  \\__|$$ /  $$ |
$$ |\\$  /$$ |$$  __$$ |$$ |  $$ |$$ |$$ |      $$ |  $$ |$$ |      $$ |  $$ |
$$ | \\_/ $$ |\\$$$$$$$ |\\$$$$$$$ |$$ |\\$$$$$$$\\ \\$$$$$$  |$$ |      \\$$$$$$$ |
\\__|     \\__| \\_______| \\____$$ |\\__| \\_______| \\______/ \\__|       \\_______|
                       $$\\   $$ |                                            
                       \\$$$$$$  |                                            
                        \\______/
                        
                        
                        Always free, Always open source`);

export const bot = new Client({
  // To use only guild command
  // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

  // Discord intents
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
  ],

  // Debug logs are disabled in silent mode
  silent: false,

  // Configuration for @SimpleCommand
  simpleCommand: {
    prefix: "!",
  },
});

bot.once("ready", async () => {
  // Make sure all guilds are cached
  // await bot.guilds.fetch();

  // Synchronize applications commands with Discord
  void bot.initApplicationCommands();

  // Set the status of the bot
  if (bot.user) {
    bot.user.setActivity('How to cast spells (FULL TUTORIAL)', { type: ActivityType.Watching });
  }

  // To clear all guild commands, uncomment this line,
  // This is useful when moving from guild commands to global commands
  // It must only be executed once
  //
  //  await bot.clearApplicationCommands(
  //    ...bot.guilds.cache.map((g) => g.id)
  //  );

  console.log("Bot started");
});

bot.on("interactionCreate", async (interaction: Interaction) => {
  try {
    await bot.executeInteraction(interaction);
  } catch (error) {
    const err = error as { code?: number };
    if (err.code === 10062) {
      console.warn("Unknown interaction detected, possibly expired:", err);
    } else {
      console.error("Error handling interaction:", err);
    }
  }
});

bot.on("messageCreate", async (message: Message) => {
  try {
    await bot.executeCommand(message);
  } catch (error) {
    console.error("Error handling message:", error);
  }
});

async function run() {
  // The following syntax should be used in the commonjs environment
  //
  // await importx(__dirname + "/{events,commands}/**/*.{ts,js}");

  // The following syntax should be used in the ECMAScript environment
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  // Let's start the bot
  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }
  // Log in with your bot token
  await bot.login(process.env.BOT_TOKEN);
}

// Global error handling
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

void run();

