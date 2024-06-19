const mongoose = require("mongoose");

const PostprojectSchema = new mongoose.Schema({
    JobName: {
        type: String,
        required: true,
        trim : true
    },
    JobExperience: {
        type: String,
        required: true,
    },
    JobEducation: {
        type: String,
        required: true,
    },
    AboutMe: {
        type: String,
        required: true,
    },
    JobSalary: {
        type: Number,
        required: true,
    },
    JobImage: {
        type: String,
        required: true,
    },
   
    JobCategory: {
        type: String,
        required: true,
        enum : ["Web developer", "blogs", "Fashion", "Fragrance"]
    },
    
}, {timestamps : true})

const PostprojectModel = mongoose.model("postproject", PostprojectSchema);

module.exports = PostprojectModel;