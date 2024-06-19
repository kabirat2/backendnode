const {cloudinary} = require("../Config/cloudinary")
const PostprojectModel = require("../Models/PostprojectModel")

const createpostproject = async(req, res) => {
    const {
        JobName,
       JobExperience,
       AboutMe, 
       JobEducation,
       JobSalary,
       JobImage,
       JobCategory
    }=req.body;

    if ( !JobName||
         !JobExperience||
         !AboutMe|| 
         !JobEducation||
         !JobSalary||
         !JobImage||
         !JobCategory
         ) {
            res.status(400).send({ mesage: "All fields are required" });
    } else {
        try {
            const imageUpload = await cloudinary.uploader.upload(JobImage, {
              folder: "postprojectLink",
            });
      
            const postLink = imageUpload.secure_url;
            console.log("postlink:", postLink);
            const createpostproject = await PostprojectModel.create({
                JobName,
                JobExperience,
                AboutMe, 
                JobEducation,
                JobSalary,
                JobImage:postLink,
                JobCategory
            });
            if (createpostproject) {
              res
                .status(200)
                .send({ message: " you are Successfully create your postproject ", status: true });
            } else {
              res.status(400).send({ message: "Unable to post project" });
            }
          } catch (error) {
            console.error("Error creating post project:", error);
            res.status(400).send({ message: "Server error", error });
          } 
    }
}


module.exports = { createpostproject };