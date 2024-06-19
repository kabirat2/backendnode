const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {sendMail, SendOtp} = require("../Config/mailer")


let genRandomNum = ()=> {
  let six = ''

  for (let index = 0; index < 6; index++) {
      let randomNum = Math.floor(Math.random()  * 10)
      six += randomNum  
    
}
return six
 } 


const SignUp = async (req, res, next) => {
  const { FullName, Email, Password } = req.body;

  if (!FullName || !Email || !Password) {
    res.status(400);
    return next(new Error("All Fields are mandatory"));
  }

  try {
    const validateUser = await userModel.findOne({ Email });

    if (validateUser) {
      res.status(400).send({ message: "User Already Exists" });
    }

    const hashPassword = await bcrypt.hash(Password, 10);

    const createUser = await userModel.create({
      FullName,
      Email,
      Password: hashPassword,
    });

    if (createUser) {
      sendMail(FullName, Email);
      res.status(200).send({
        message: `Account Created Successfully for ${createUser.FullName}`,
         status : "success"
      });
    } else {
      res.status(400);
      return next(new Error("Unable to create user's account"));
    }
  } catch (error) {
    console.error("Error during SignUp:", error);
    res.status(500);
    return next(new Error("Internal Server Error"));
  }
};

const Login = async (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    res.status(400).send({ message: "All Fields Are Mandatory" });
  }

  try {
    const validateUser = await userModel.findOne({ Email });

    if (!validateUser) {
      res
        .status(400)
        .send({ message: "Account Does Not Exist, Try Creating one!", status: false });
    } else {
      const comparePassword = await bcrypt.compare(
        Password,
        validateUser.Password
      );
      const secretKey = process.env.SECRET_KEY;
      const generateToken = await jwt.sign(
        {
          user: {
            FullName: validateUser.FullName,
            Email: validateUser.Email,
          },
        },
        secretKey,
        { expiresIn: "1d" }
      );

      if (comparePassword) {
        res.status(200).send({
          message: `Welcome  ${validateUser.FullName}`,
          generateToken,
          status: "success",
         
        });
      }
    }
  } catch (error) {}
};

// const editPassword = async (req, res) => {
//   const user = req.user;
//   const { FullName, Email } = user;

//   if (!user) {
//       res.status(400).send({ message: "Authentication not provided" });
//       return;
//   }

//   const { Password } = req.body;
//   if (!Password) {
//       res.status(400).send({ message: "Password Field is mandatory" });
//       return;
//   }

//   try {
//       const hashedPassword = await bcrypt.hash(Password, 10);
//       const foundUser = await userModel.findOneAndUpdate({ Email }, {
//           FullName,
//           Email,
//           Password: hashedPassword
//       }, { new: true });
//       if (!foundUser) {
//           res.status(400).send({ message: "Couldn't update password" });
//       } else {
//           res.status(200).send({ message: "Password successfully updated", status: "okay" });
//       }
//   } catch (error) {
//       res.status(400).send({ message: "Internal server error" });
//   }
// }

// const editUserInfo = async (req, res) => {
//   const user = req.user;

//   if (!user) {
//       res.status(400).send({ message: "Authentication not provided" });
//       return;
//   }

//   const { FullName, Email } = req.body;
//   const validateEmail = await userModel.findOne({ Email });

//   if (!FullName || !Email) {
//       res.status(400).send({ message: "All Fields are mandatory" });
//       return;
//   } else if (FullName === user.FullName && Email === user.Email) {
//       res.status(400).send({ message: "Update at least one field to continue" });
//       return;
//   } else if (validateEmail && (validateEmail.Email !== user.Email)) {
//       res.status(400).send({ message: "This Email is already in use by another customer" });
//       return;
//   }

//   try {
//       const foundUser = await userModel.findOneAndUpdate({ Email: user.Email }, {
//           FullName,
//           Email,
//       }, { new: true });
//       if (!foundUser) {
//           res.status(400).send({ message: "Couldn't update user information" });
//       } else {
//           res.status(200).send({ message: "User information successfully updated", status: "okay" });
//           console.log("updated userinfo:", {
//               FullName,
//               Email,
//           });
//       }
//   } catch (error) {
//       console.log(error);
//       res.status(400).send({ message: "Internal server error" });
//   }
// }
const EditAcc = async (req, res) => {
  const user = req.user;
  console.log("userEmail : ", user.Email);

  console.log("User Trying To Edit Acc : ", user);

  const { FullName, Email, Password } = req.body;
  if (!FullName || !Email || !Password) {
    res.status(400).send({ message: "All Fields are mandatory" });
  } else {
    try {
      const hashPassword = await bcrypt.hash(Password, 10);
      const validateUser = await userModel.findOneAndUpdate(
        { Email: user.Email },
        { FullName, Email, Password: hashPassword },
        { new: true }
      );
      if (validateUser) {
        validateUser.save()
        res
          .status(200)
          .send({ message: "Account Updated Successfully", status: "success" });
      } else {
        res
          .status(400)
          .send({ message: "Unable to update account", status: "failed" });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
};

const deleteAccount = async(req,res)=> {
  const user = req.user
  if(!user){
      res.status(400).send({message:"Authentication not provided"})
  }else{
      try {
          const userToDelete = await userModel.findOneAndDelete({Email:user.Email})
          if(!userToDelete){
              res.status(400).send({message:"Unable to delete user at the moment" , status:"false"})
          }else{
              res.status(200).send({message:"User successfully deleted" , status:"okay"})
              console.log('deleted user', userToDelete);
          }
          
      } catch (error) {
          res.status(500).send({message:"internal server error" })
          console.log(error);
      }
  }
}


const getCurrentUser = async (req, res) => {
  const user = req.user;
  try {
    const fetchCurrentUser = await userModel.findOne({ Email: user.Email });
    if (fetchCurrentUser) {
      const userDetails = {
        FullName: fetchCurrentUser.FullName,
        Email: fetchCurrentUser.Email,
      };
      res.status(200).send({ message: "User userDetails", userDetails });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// const getOtp = async () => {
//   const user = req.user;
//   try {
//     const getUser = await userModel.findOne({ Email: user.Email });
//     if(getUser){
//       const generateRandum =  Math.floor(Math.random() * 9999)
// console.log("Random Number : ", generateRandum)
// SendOtp(generateRandum, getUser.FullName, getUser.Email)
//     }
//   } catch (error) {
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// };


let theEmail
const getOtp = async(req,res)=> {
  const {Email} = req.body
  theEmail = Email
  if (!Email){
      res.status(400).send({message:"email is mandatory"})
  }else{
      try {
     const  validateEmail = await userModel.findOne({Email})
      if(!validateEmail){
          res.status(400).send({message:"User doesnt exist , Sign up"})  
      }else{
          let userOtp = genRandomNum()
          SendOtp( userOtp ,   validateEmail.FullName , Email )
      res.status(200).send({message:"OTP has been sent Successfully" , status:"okay" ,  userOtp }) 
      }
       
      } catch (error) {
          res.status(500).send({message:"internal server error"})  
          console.log(error);
      }
  }


}


const changePassword = async(req , res) => {
  const {Password} = req.body
  if(!Password){
    res.status(400).send({message:"password is mandatory"})
  }else{
    try {
        const hashedPassword = await bcrypt.hash(Password , 10)
        const checkEmail = await userModel.findOneAndUpdate({Email:theEmail} , {
            
            Password: hashedPassword
        } , {new:true})
        if(!checkEmail){
            res.status(400).send({message:"Password Failed to Update"})    
        }else {
            res.status(200).send({message:"Password successfully updated" , status:"okay"})    
        }
    } catch (error) {
        res.status(500).send({message:"internal server error"})  
        console.log(error); 
    }
  }

}


module.exports = { SignUp, Login, EditAcc, deleteAccount };
