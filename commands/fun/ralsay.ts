import { Discord, Slash, SlashOption } from 'discordx';
import { CommandInteraction, ApplicationCommandOptionType } from 'discord.js';

// Function to wrap text to a specified width
function wrapText(text: string, width: number): string[] {
    const wrapped: string[] = [];
    let line = "";

    const words = text.match(/\S+/g) || [];
    for (const word of words) {
        if (line.length + word.length + 1 > width) {
            wrapped.push(line);
            line = word;
        } else {
            if (line.length > 0) {
                line += " " + word;
            } else {
                line = word;
            }
        }
    }

    if (line.length > 0) {
        wrapped.push(line);
    }

    return wrapped;
}

// Function to generate the ASCII art with a speech bubble
function generateRalsay(text: string): string {
    // Define the ASCII art
    const art = `
        -^-
    _/\\/\  \\/\\_
   (____ ))____)
    / -     - \\
   / ( ^)-(^ ) \\
  / ____v-v____ \\
  \\(-    _-  __)/
    \\-  -__---/
    /  / V \\   \\
   /  \\   /    \\
  =      V       =
_=_=              _=_
  -=---______---=-
     _| | | |_
    (___- -___)
    `;

    // Set a reasonable initial maximum width for wrapping
    const initialWidth = 20;

    // Wrap the text and find the maximum line length
    const wrappedText = wrapText(text, initialWidth);
    let maxLength = 0;

    for (const line of wrappedText) {
        if (line.length > maxLength) {
            maxLength = line.length;
        }
    }

    // Adjust the box width based on the longest line
    const boxWidth = maxLength + 2; // Add padding for borders

    // Build the speech bubble
    let result = " " + "_".repeat(boxWidth) + "\n";
    result += "/" + " ".repeat(boxWidth) + "\\\n";

    // Add the wrapped text inside the speech bubble
    for (const line of wrappedText) {
        result += "| " + line + " ".repeat(boxWidth - line.length - 2) + " |\n";
    }

    // Bottom of the bubble and the tail
    result += "\\" + "_".repeat(boxWidth) + "/\n";
    result += " \\ / \n";
    result += "  v \n";

    // Add the ASCII art below the bubble
    result += art;

    return result;
}

// Create the command class
@Discord()
export class RalsayCommand {

    @Slash({ name: "ralsay", description:"Make ralsei from deltarune say anything!" })
    async ralsay(
        @SlashOption({ name: "text", 
        type: ApplicationCommandOptionType.String, 
        description: "The text for ralsei to say" })
        text: string,
        required: true,
        interaction: CommandInteraction
    ): Promise<void> {
        const asciiArt = generateRalsay(text);
	
	await interaction.deferReply();
        await interaction.editReply("```" + asciiArt + "```");
    }
}

