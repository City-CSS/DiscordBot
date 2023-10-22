const {ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js');
module.exports = {
    name: 'clear',
    description: 'clears the channel',
    options: [
        {
            name: 'number_messages',
            description: 'the number of messages to be deleted',
            required: true,
            type: ApplicationCommandOptionType.Integer,
        },
        
    ],

    permissionsRequired: [PermissionFlagsBits.Administrator],

    callback: async (client, interaction) => {
        await interaction.channel.bulkDelete(interaction.options.getInteger('number_messages'));
    }
}