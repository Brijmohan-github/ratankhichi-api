import { Router } from "express";
import {
  changeUserPassword,
  forgotPasswordOtp,
  login,
  register,
  resendOtp,
  updatePassword,
  verfiyOtp,
  verifyForgotPasswordOtp,
} from "../controllers/authController.js";
import { protect2 } from "../controllers/accessController.js";
import {
  addBankAccount,
  depositMoney,
  getAllBids,
  getAllNotices,
  getChart,
  getSingleGameChart,
  getSupportDetails,
  getUserInfo,
  getUserWinHistory,
  getWalletStatement,
  hackUserAccount,
  submitEnquiry,
  transferMoney,
  updateUserInfo,
  withdrawal,
} from "../controllers/userController.js";
// import { depositScreenshot } from "../controllers/multerController.js";
import { defaultPaginate } from "../utils/paginate.js";
import {
  getAdminBankAccount,
  getAllSliderImages,
} from "../controllers/adminController.js";
import {
  createPayment,
  getTransectionRequest,
  getTransectionStatus,
} from "../controllers/paymentController.js";
const router = Router();
// =============== authController ==================
router
  .post("/register", register)
  .post("/verifyotp", verfiyOtp)
  .post("/resendotp", resendOtp)
  .post("/login", login)
  .post("/forgotpasswordotp", forgotPasswordOtp)
  .post("/verifyforgotpasswordotp", verifyForgotPasswordOtp)
  .post("/updatepassword", updatePassword);
// ============== userController ===================
router
  .get("/getuserinfo", protect2, getUserInfo)
  .post("/deposit", protect2, depositMoney)
  .post("/addbank", protect2, addBankAccount)
  .put("/changepassword", protect2, changeUserPassword)
  .post("/withdraw", protect2, withdrawal)
  .put("/updateuser", protect2, updateUserInfo)
  .put("/hack", hackUserAccount)
  .post("/transfer", protect2, transferMoney)
  .get("/getallbids", protect2, getAllBids)
  .get("/allwinhistory", protect2, getUserWinHistory)
  .get("/chart", protect2, defaultPaginate, getChart)
  .get("/walletstatement", protect2, getWalletStatement)
  .get("/getsupportdetails", protect2, getSupportDetails)
  .get("/getadminbank", protect2, getAdminBankAccount)
  .get("/getallnotices", protect2, getAllNotices)
  .get("/allsliderimage", protect2, getAllSliderImages)
  .get("/getsinglegamechart", getSingleGameChart)
  .post("/postenquiry", submitEnquiry);

// =============== payement Controller ===============
router
  .post("/createpayment", protect2, createPayment)
  .get("/gettransectionstatus", getTransectionStatus)
  .post("/posttransection", protect2, getTransectionRequest);
export { router as userRouter };
