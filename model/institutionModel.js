const mongoose = require('mongoose');   


const InstituionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    }
})



const Institution = mongoose.model('Institution', InstituionSchema);
module.exports = Institution;