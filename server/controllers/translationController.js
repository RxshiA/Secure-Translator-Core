const Translation = require('../models/translationModel')
const asyncHandler = require('express-async-handler')


// @desc Get all translations
// @route GET /translations
// @access Private

const getAllTranslations = asyncHandler(async (req,res)=>{

const trans=await Translation.find().lean()

if(!trans?.length){

    return res.status(400).json({message:'No translations Found'})
}

res.json(trans)

})


const createTrans=asyncHandler(async(req,res)=>{

    const {date,inputTrans,outputTrans} =req.body

    if(!date|| !inputTrans|| !outputTrans){

        return res.status(400).json({message :'All fields are required'})

    }

    const trans =await Translation.create({date,inputTrans,outputTrans})

    if(trans){
        return res.status(201).json({message:'Translation made'})
    }else{
        return res.status(400).json({message:'Invalid Translation'})
    }
})


    const updateTranslation=  asyncHandler(async (req,res) =>{

        const {date,inputTrans,outputTrans} =req.body

        if(!date|| !inputTrans|| !outputTrans){

            return res.status(400).json({message :'All fields are required'})
    
        }

        const trans = await Translation.findById(req.params.id)

        if(!trans){

            return res.status(400).json({message:'Translation not found'})
        }

        trans.inputTrans=inputTrans
        trans.outputTrans=outputTrans

        const updateTrans=await trans.save()

        res.json(`'${updateTrans.inputTrans}' updated`)
    })

async function  deleteTranslation(req,res){

    try{
        const trans = await Translation.findById(req.params.id)

        if(trans){
            await trans.deleteOne()
            return res.json({message:'Translation Removed'})
        }else   
            return res.json({message:'Could not be found'})


    }catch(error){
        return res.status(500).json({message: error.message})
    }
}


async function getATransaltion(res,req){

    try{

        const trans = await Translation.findById(req,param.id)

        if(trans){
            res.json(trans)
        }else   
            return res.json({message:'Translation not found'})


    }catch(error){

        res.status(500).json({ message: error.message })

    }

}

module.exports={

    getAllTranslations,
    createTrans,
    updateTranslation,
    deleteTranslation,
    getATransaltion

}