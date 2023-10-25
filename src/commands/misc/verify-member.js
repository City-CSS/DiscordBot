const {ApplicationCommandOptionType, Client, Interaction} = require('discord.js');
const Users = require('../../models/Users');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        if(!interaction.inGuild()){
            interaction.reply({
                content: "Can only access this command in a Server!",
                ephemeral:true,
            });
            return;
        }
        
        const studentId = interaction.options.get('student-id').value;
        const firstName = interaction.options.get('first-name').value.toUpperCase();
        const secondName = interaction.options.get('surname').value.toUpperCase();
        const filter = {
                        userFirstName: firstName, 
                        userSurname: secondName, 
                        userId: studentId
                    }

        try {
            let users = await Users.findOne(filter);
            if(!users){
                interaction.reply({
                    content: "You haven't gotten a membership yet! Get it at https://www.citystudents.co.uk/getinvolved/society/css/",
                    ephemeral:true,
                });
                return;
            } else {
                console.log(users.discordActivated);
                if(users.discordActivated){
                    interaction.reply({
                        content: "You are already a member!",
                        ephemeral:true,
                    });
                    return;
                }
                const updateDoc = {
                    $set: {
                      discordActivated: true
                    },
              
                  };
                await Users.updateOne(filter, updateDoc);
                console.log("You are a member now!");
                
                await interaction.member.roles.add('1163416038558400572');
                interaction.reply({
                    content: "You are a member now!",
                    ephemeral:true,
                });


            }
            

        } catch (error) {
            console.log("I DIED IN verify-member "+error);
        }
    },
    name: 'verify-member',
    description: 'Verify your student ID and name and become a member on the CSS Discord!',
    //devOnly: Boolean,
    //testOnly: Boolean,
    options: [
        {
            name: 'student-id',
            description: 'Your student ID at City, University of London.',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'first-name',
            description: 'Your first name, as written on the Student Union website.',
            required: true,
            type: ApplicationCommandOptionType.String,
        },{
            name: 'surname',
            description: 'Your surname, as written on the Student Union website.',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],

}