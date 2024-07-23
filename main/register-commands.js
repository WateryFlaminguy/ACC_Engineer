require("dotenv/config");
const { REST, Routes, ApplicationCommandOptionType } = require("discord.js");
const { describe } = require("node:test");

const commands = [
  {
    name: "help",
    description: "A help menu.",
  },
  {
    name: "fuelcalculator",
    description: "Allows you to calculate the necessary amount of fuel for a race.",
    options: [
      {
        name: 'race-time',
        description: 'Race length with the format hh:mm',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'laptime',
        description: 'Average lap time with the format mm:ss.ms',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'fuel-usage',
        description: 'Average fuel consumption per lap',
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
      {
        name: 'safe-laps',
        description: 'Additional fuel to add (3%/lap)',
        type: ApplicationCommandOptionType.Number,
      },
    ],
  },
  {
    name: "strategymaker",
    description: "Provides optimal stint strategies depending on event conditions.",
  },
  {
    name: "setupengineer",
    description: "Access the Setup Engineer AI to improve your setup.",
  },
  {
    name: "credits",
    description: "Credits and donations page.",
  },
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  /*{
    name: "context",
    description: "Give the AI context.",
    options: [
        {
            name: "Car-Class",
            description: "GT3, GT4, GT2, GTC, TCX",
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: ''
                }
            ],
            required: true,
        }
    ]
  },*/
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    
    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID), 
        { body: commands }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(`Command register error: ${error}`);
  }
})();
