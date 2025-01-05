import user from "../models/userModel.js";
import tryCatchWrapper from "../wrappers/tryCatchWrapper.js";
import { failedResponse, successResponse } from "../wrappers/response.js";
import { generateAndStoreOTP, generateOTP } from "../utils/otp.js";
import { memoryCache } from "../utils/otp.js";
import { generateToken } from "../utils/generateToken.js";
import distribute from "../models/distributeModel.js";
import transection from "../models/transectionModel.js";
import { generateUTRNumber } from "../utils/generateUTRNumber.js";
import sendOtpViaSMS from "../utils/sendOtpViaSms.js";

// =========== register ============
export const register = tryCatchWrapper(async (req, res) => {
  const { name, phone, password } = req.body;
  if (!name || !phone || !password) {
    return failedResponse(res, "Please fill up required details");
  }
  if (password.length < 4) {
    return failedResponse(res, "Password must be 4 characters long");
  }

  // Check if phone number already exists with validuser set to true
  const existingUser = await user.find({
    $and: [{ phone: phone }, { validuser: true }],
  });
  if (existingUser.length > 0) {
    return failedResponse(res, "Phone Number Already Exists");
  }

  // Create a new user with validuser set to false
  const newUser = await user.create({
    name,
    phone,
    password,
    validuser: false,  // User is not validated until OTP verification
  });

  // Generate OTP and set expiration
  const otp = generateOTP(); // Assuming generateOTP() generates a 6-digit OTP
  newUser.setOtp(otp);
  await newUser.save(); // Save user with OTP details

  // Send OTP via SMS
  await sendOtpViaSMS(phone, otp);

  // Respond with success
  return successResponse(res, "OTP sent successfully", newUser._id);
});
// export const register = tryCatchWrapper(async (req, res) => {
//   const { name, phone, password } = req.body;
//   if (!name || !phone || !password) {
//     return failedResponse(res, "Please fill up required details");
//   }
//   if (password.length < 4) {
//     return failedResponse(res, "Password must be 4 character long");
//   }
//   const existingUser = await user.find({
//     $and: [{ phone: phone }, { validuser: true }],
//   });
//   if (existingUser.length > 0) {
//     return failedResponse(res, "Phone Number Already Exists");
//   }

//   const checkUser = await user.create({
//     name,
//     phone,
//     password: password,
//     validuser: false,
//   });
//   const otp = await generateAndStoreOTP(checkUser._id);
//   await sendOtpViaSMS(phone, otp);
//   return successResponse(res, "Otp sent successfully", checkUser._id);
// });

// ======== verifyOtp ==========
export const verfiyOtp = tryCatchWrapper(async (req, res) => {
  const userId = req.query.id;
  const userOtp = req.body.otp;

  // Fetch the user from DB using user ID
  let checkUser = await user.findById(userId);
  if (!checkUser) {
    return failedResponse(res, "User expired. Please fill the registration form again!");
  }

  // Verify the OTP with expiration check
  const isOtpValid = checkUser.verifyOtp(userOtp);
  if (!isOtpValid) {
    return failedResponse(res, "Invalid or expired OTP");
  }

  // Fetch distribution settings (assumed to be related to account setup)
  const distributeSettings = await distribute.findOne();
  if (!distributeSettings) {
    return failedResponse(res, "Distribution settings are not defined");
  }
  const { nrb } = distributeSettings;

  // Create a transaction for the user
  await transection.create({
    userId: checkUser._id,
    money: nrb,
    utr: generateUTRNumber(), // Generates unique transaction reference
    type: "b",
    status: "Approved",
  });

  // Update the user's money and validuser status
  checkUser.money += nrb;
  checkUser.validuser = true;
  await checkUser.save();

  // Generate a token for the user after successful verification
  const token = generateToken(checkUser._id);

  // Respond with successful registration and token
  return successResponse(res, "Registration successful!", token);
});
// export const verfiyOtp = tryCatchWrapper(async (req, res) => {
//   const userId = req.query.id;
//   let checkUser = await user.findById(userId);
//   if (!checkUser) {
//     return failedResponse(
//       res,
//       "User Expired, Please fill the registration form again!"
//     );
//   }
//   const cacheKey = "otp_" + userId;
//   const userOtp = req.body.otp;
//   const savedOtp = await memoryCache.get(cacheKey);
//   if (!savedOtp) {
//     return failedResponse(res, "Otp Expired!");
//   }
//   if (userOtp != savedOtp) {
//     return failedResponse(res, "Invalid Otp");
//   }
//   const distributeSettings = await distribute.findOne();
//   if (!distributeSettings) {
//     return failedResponse(res, "distribute settings are not defined");
//   }
//   const { nrb } = distributeSettings;
//   await transection.create({
//     userId: checkUser._id,
//     money: nrb,
//     utr: generateUTRNumber(),
//     type: "b",
//     status: "Approved",
//   });
//   checkUser.money += nrb;
//   checkUser.validuser = true;
//   await checkUser.save();
//   const token = generateToken(checkUser._id);
//   return successResponse(res, "Registration Successfull!", token);
// });

// ========== resend otp ============
export const resendOtp = tryCatchWrapper(async (req, res) => {
  const userId = req.query.id;

  // Find the user by ID
  const checkUser = await user.findById(userId);
  if (!checkUser) {
    return failedResponse(res, "User expired. Please fill the registration form again!");
  }

  // Generate a new OTP and set expiration
  const otp = generateOTP(); // Assuming generateOTP() generates a 6-digit OTP
  checkUser.setOtp(otp);
  await checkUser.save(); // Save user with new OTP details

  // Send OTP via SMS
  const phone = checkUser.phone;
  await sendOtpViaSMS(phone, otp);

  // Respond with success message
  return successResponse(res, "OTP sent successfully!", userId);
});
// export const resendOtp = tryCatchWrapper(async (req, res) => {
//   const userId = req.query.id;
//   const checkUser = await user.findById(userId);
//   if (!checkUser) {
//     return failedResponse(
//       res,
//       "User Expired, Please fill the registration form again!"
//     );
//   }
//   const otp = await generateAndStoreOTP(userId);
//   const phone = checkUser.phone;
//   await sendOtpViaSMS(phone, otp);
//   successResponse(res, "Otp sent successfully!", userId);
// });

// ========== login ==========
export const login = tryCatchWrapper(async (req, res) => {
  const { phone, password } = req.body;
  console.log(phone, password);

  const checkUser = await user.findOne({
    $and: [{ phone: phone }, { validuser: true }],
  });
  if (!checkUser) {
    return failedResponse(res, "User Not Found!", 404);
  }
  if (password.length < 4) {
    return failedResponse(res, "Password must be 4 character long");
  }
  const verifyPassword = password === checkUser.password;
  if (!verifyPassword) {
    return failedResponse(res, "Incorrect Password!");
  }
  const token = generateToken(checkUser._id);
  successResponse(res, "login Successfull", token);
});
//  ======= forgotPasswordOtp =======
export const forgotPasswordOtp = tryCatchWrapper(async (req, res) => {
  const phone = req.body.phone;
  if (!phone) {
    return failedResponse(res, "Please Enter Phone Number");
  }
  const checkUser = await user.findOne({
    $and: [{ phone: Number(phone) }, { validuser: true }],
  });
  if (!checkUser) {
    return failedResponse(res, "User Not Found!", 404);
  }
  const otp = await generateAndStoreOTP(checkUser._id);
  await sendOtpViaSMS(phone, otp);
  return successResponse(res, "Otp sent successfully!", checkUser._id);
});
// ======= verifyforgotpasswordOtp ======
export const verifyForgotPasswordOtp = tryCatchWrapper(async (req, res) => {
  const userId = req.query.id;
  const userOtp = req.body.otp;
  const cacheKey = "otp_" + userId;
  const savedOtp = await memoryCache.get(cacheKey);
  if (!savedOtp) {
    return failedResponse(res, "Otp Expired!");
  }
  if (userOtp != savedOtp) {
    return failedResponse(res, "Invalid Otp");
  }
  return successResponse(res, "Otp verified Successfully!", userId);
});

// ======= forgotPassword ======
export const updatePassword = tryCatchWrapper(async (req, res) => {
  const userId = req.query.id;
  const { password, confirmpassword } = req.body;
  if (confirmpassword !== password) {
    return failedResponse(res, "Confirm Password and password are not same");
  }
  if (password.length < 8) {
    return failedResponse(res, "Password must be 8 character long");
  }
  const checkUser = await user.findById(userId);
  if (!checkUser) {
    return failedResponse(res, "User Not Found!", 404);
  }
  await user.findByIdAndUpdate(userId, { password: password });
  successResponse(res, "Password Updated Succesfully!");
});

// ======== changePassword =======
export const changeUserPassword = tryCatchWrapper(async (req, res) => {
  const userId = req.userId;
  const { oldPassword, password, confirmpassword } = req.body;
  if (confirmpassword !== password) {
    return failedResponse(res, "Confirm Password and password are not same");
  }
  if (password.length < 8) {
    return failedResponse(res, "Password must be 8 character long");
  }
  const checkUser = await user.findById(userId);
  if (!checkUser) {
    return failedResponse(res, "User Not Found!", 404);
  }
  const isOldPasswordCorrect = checkUser.password === oldPassword;
  if (!isOldPasswordCorrect) {
    failedResponse(res, "Old Password is Incorrect!");
    return;
  }
  await user.findByIdAndUpdate(userId, { password: password });
  successResponse(res, "Password Updated Succesfully!");
});
