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
        index: true
    },
    ipAddress:{
        type:String,
        default: null,
        index: true
    }
},{
    timestamps:true
})

voteSchema.index({ pollId: 1, deviceToken: 1 });
voteSchema.index({ pollId: 1, ipAddress: 1 });

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;