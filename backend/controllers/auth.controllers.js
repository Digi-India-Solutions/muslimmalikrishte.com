const UserModel = require("../Model/UserModel.js");
const EmailVerifyModelSigUP = require("../Model/EmailModel.js");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");

const sentResetPasswordMail = async (name, email, myToken) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAILHOST,
      port: Number(process.env.EMAILPORT),
      secure: true,
      auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAILUSER,
      to: email,
      subject: "Reset Your Password",
      html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 400px; background-color: #f9f9f9;">
                    <h2 style="color: #333;">Hello ,</h2>
                    <p style="font-size: 16px; color: #555;">
                        You requested to reset your password. Please use the following OTP to proceed:
                    </p>
                    <div style="font-size: 22px; font-weight: bold; color: #007bff; text-align: center; padding: 10px; background: #e9ecef; border-radius: 5px;">
                        ${myToken}
                    </div>
                    <p style="font-size: 14px; color: #777;">
                        If you didn't request this, please ignore this email or contact support.
                    </p>
                    <p style="font-size: 14px; color: #777;">Best Regards,<br> <strong>Team Muslimmalikrishte.com</strong> </p>
                </div>
            `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent: ", info.response);
      }
    });
  } catch (error) {
    console.error("Error while sending email: ", error);
  }
};

const sentResetPasswordMail2 = async (email, myToken) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAILHOST,
      port: Number(process.env.EMAILPORT),
      secure: true,
      auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAILUSER,
      to: email,
      subject: "Email Verification - Muslim Malik Rishte",
      html: `
        <p>Dear User</p>
        <p>Thank you for joining <strong>Muslim Malik Rishte</strong>. To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
        <h2 style="color: #007BFF;">${myToken}</h2>
        <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone for your account’s security.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Warm regards,<br><strong>Team Muslim Malik Rishte</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Mail has been sent");
  } catch (error) {
    console.error("Error while sending email: ", error);
  }
};

// const RegisterUser = async (req, res) => {
//   try {
//     let image;
//     if (req.files && req.files.image) {
//       const result = await cloudinary.uploader.upload(
//         req.files.image.tempFilePath,
//         {
//           use_filename: true,
//           folder: "file-upload",
//         }
//       );
//       fs.unlinkSync(req.files.image.tempFilePath);
//       image = result.secure_url;
//     } else {
//       if (req.body.gender == "Male")
//         image =
//           "https://res.cloudinary.com/dazh79fvz/image/upload/v1740128471/file-upload/tmp-3-1740128469153_umetps.jpg";
//       else {
//         image =
//           "https://res.cloudinary.com/ddik6bul3/image/upload/v1758708251/WhatsApp_Image_2025-09-24_at_3.02.20_PM_1_omakup.jpg";
//         // "https://res.cloudinary.com/dazh79fvz/image/upload/v1740128414/file-upload/tmp-2-1740128411962_bhl0fy.jpg";

//       }
//     }
//     const {
//       fullName,
//       age,
//       gender,
//       fatherName,
//       motherName,
//       GrandFatherName,
//       height,
//       dob,
//       maritalstatus,
//       FamilyHead,
//       FamilyHeadOccupation,
//       siblings,
//       Sistersiblings,
//       marriedSister,
//       marriedBrother,
//       pehchan,
//       education,
//       working,
//       annualIncome,
//       house,
//       password,
//       phone,
//       email,
//       area,
//       city,
//       state,
//       pin,
//       country,
//       weddingBudget,
//       weddingStyle,
//       role,
//     } = req.body;
//     // Create a new user
//     console.log("BODY:==>",req.body);
//     const user = await UserModel.create({
//       fullName,
//       email,
//       password,
//       age,
//       gender,
//       fatherName,
//       motherName,
//       GrandFatherName,
//       height,
//       dob,
//       maritalstatus,
//       FamilyHead,
//       FamilyHeadOccupation,
//       siblings,
//       Sistersiblings,
//       marriedSister,
//       marriedBrother,
//       pehchan,
//       education,
//       working,
//       annualIncome,
//       house,
//       phone,
//       area,
//       city,
//       state,
//       pin,
//       country,
//       weddingBudget,
//       weddingStyle,
//       role,
//       image,
//     });

//     console.log(req.body)
//     res.status(201).json({ message: "user created" });
//   } catch (error) {
//     return res.status(500).json({
//       msg: " register failed",
//       error: error.message,
//     });
//   }
// };

const RegisterUser = async (req, res) => {
  try {
    let image;

    // ================================
    // 1. HANDLE IMAGE UPLOAD
    // ================================
    if (req.files?.image) {
      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          use_filename: true,
          folder: "file-upload",
        }
      );

      // safely delete temp file
      fs.unlink(req.files.image.tempFilePath, () => { });
      image = result.secure_url;
    } else {
      const gender = req.body.gender?.toLowerCase();

      if (gender === "male") {
        image =
          "https://res.cloudinary.com/dazh79fvz/image/upload/v1740128471/file-upload/tmp-3-1740128469153_umetps.jpg";
      } else {
        image =
          "https://res.cloudinary.com/ddik6bul3/image/upload/v1758708251/WhatsApp_Image_2025-09-24_at_3.02.20_PM_1_omakup.jpg";
      }
    }

    // ================================
    // 2. CHECK USER EXISTS
    // ================================
    const { email, password } = req.body;

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // ================================
    // 3. HASH PASSWORD
    // ================================
    // const hashedPassword = await bcrypt.hash(password, 10);

    // ================================
    // 4. CREATE USER
    // ================================
    const userData = {
      ...req.body,
      image,
      password: password,
    };

    await UserModel.create(userData);

    return res.status(201).json({ message: "user created" });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      msg: "register failed",
      error: error.message,
    });
  }
};


const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Enter complete fields" });
    }

    const checkuser = await UserModel.findOne({ email });
    // console.log(checkuser)
    if (!checkuser) {
      return res.status(400).json({ message: "Enter correct email" });
    }

    const check = await checkuser.comparePassword(password);
    if (!check) {
      return res.status(400).json({ message: "Enter correct password" });
    }

    const token = checkuser.createToken();
    if (!token) {
      return res.status(500).json({ message: "Token problem" });
    }

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2592000000, // 30 days in milliseconds
      sameSite: "None",
    });

    return res
      .status(200)
      .json({ user: "Login successful", checkuser: checkuser.unqId });
  } catch (error) {
    console.error("Error during login:", error); // Log error for debugging
    res.status(500).json({ message: "Login failed. Please try again later." });
  }
};

const LogoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error, message: "Logout failed" });
  }
};

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
};

const forgotPasswordUser = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const userData = await UserModel.findOne({
      email: { $regex: new RegExp(`^${userEmail}$`, "i") }
    });
    if (!userData) return res.status(400).json({ msg: "email not registered" });
    const otp = generateOTP();
    const data = await UserModel.updateOne(
      { email: userEmail },
      { $set: { myToken: otp } }
    );
    sentResetPasswordMail(userData.name, userData.email, otp);
    res.status(200).json({ msg: "please check your Email" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
const verifyEmailUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const otp = generateOTP();
    console.log("DDDD:==>", otp, email);
    // Upsert: If email exists, update OTP; otherwise, create a new entry
    await EmailVerifyModelSigUP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true } // Create if not exists, return updated document
    );

    await sentResetPasswordMail2(email, otp);

    res
      .status(200)
      .json({ msg: `${email}, please check your email for the OTP` });
  } catch (error) {
    console.error("Error verifying email:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyTokenOTP = async (req, res) => {
  try {
    const { email, myToken } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user.myToken != myToken) {
      return res.status(400).json({ msg: "enter correct otp" });
    }
    user.myToken = 2911200429112004;
    await user.save();
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(email, otp);
    const user = await EmailVerifyModelSigUP.findOne({ email: email });
    if (user.otp != otp) {
      return res.status(400).json({ msg: "enter correct otp" });
    }
    user.myToken = "verified";
    await user.save();
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePasswordOTP = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user.myToken != 2911200429112004) {
      return res
        .status(400)
        .json({ msg: "please verify yourself or try again" });
    }
    user.password = password;
    user.myToken = "";
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  RegisterUser,
  LoginUser,
  LogoutUser,
  forgotPasswordUser,
  verifyTokenOTP,
  updatePasswordOTP,
  verifyEmailUser,
  verifyEmailOTP,
};
