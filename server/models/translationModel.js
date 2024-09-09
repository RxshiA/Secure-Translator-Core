const mongoose = require('mongoose')

const translationSchema =new mongoose.Schema({

    transID:{

        type:String,
        unique:true,
        required:true,

    },

    date:{

        type: Date,
        required:true,

    },

    inputTrans:{

        type:String,
        required:true

    },

    outputTrans:{

        type:String,
        required:true

    }


})


module.exports=mongoose.model('Translation',translationSchema)