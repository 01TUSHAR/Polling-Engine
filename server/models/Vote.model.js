import mongoose from "mongoose"


const voteSchema = new mongoose.Schema({
    pollId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Poll",
        required:true,
        index:true,
    },
    optionId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    deviceToken:{
        type:String,
        default:null,
        
    },
    ipAddress:{
        type:String,
        default: null,
    }
},{
    timestamps:true
})

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;