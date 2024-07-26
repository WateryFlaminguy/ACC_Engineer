const { SlashCommandBuilder } = require('discord.js')

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!');

function run({ interaction }) {
    interaction.reply('Pong!');
}

module.exports = { data, run };