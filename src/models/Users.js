const {Schema, model} = require('mongoose');

const userSchema = new Schema(
    {
        userFirstName: {
            type: String,
            required: true,
        },
        userSurname: {
            type: String,
            required: true,
        },
        userId: {
            type:String,
            required: true,
            unique:true,
        },
        discordActivated: {
            type:Boolean,
            required:true,
        },
    });

module.exports = model('Users', userSchema);

