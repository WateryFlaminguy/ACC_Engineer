const cars = require('../data/cars.json')
const tracks = require('../data/tracks.json')
const { SlashCommandBuilder } = require('discord.js')

const data = new SlashCommandBuilder()
    .setName('strategymaker')
    .setDescription('Provides optimal stint strategies depending on event conditions.')
    .addStringOption((option) =>
        option
            .setName('racetime')
            .setDescription('Race length with the format in hours or hh:mm')
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('laptime')
            .setDescription('Average lap time with the format mm:ss.ms')
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName('car')
            .setDescription('Selected car')
            .setRequired(true)
            .setAutocomplete(true)
    )
    .addStringOption((option) =>
        option
            .setName('track')
            .setDescription('Selected track')
            .setRequired(true)
            .setAutocomplete(true)
    )
    .addNumberOption((option) =>
        option
            .setName('safelaps')
            .setDescription('Additional fuel to add (3%/lap)')
    );

function run({ interaction }) {
    const targetCarId = interaction.options.getString('car');
    //console.log(targetCarId)
    const car = cars.find((c) => c.id == targetCarId);

    const targetTrackId = interaction.options.getString('track');
    const track = tracks.find((t) => t.id == targetTrackId);

    //will replace with embed similar to fuelcalculator
    //need to add max fuel data to cars.json + GT4, GTC, TCX (no GT2 yet) 
    interaction.reply(`${car.name} - ${track.name}`)
}

module.exports = { data, run };