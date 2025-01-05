// import { Schema, model } from "mongoose";
// const userSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required!"],
//     },
//     // email: {
//     //   type: String,
//     //   required: [true, "Email is required!"],
//     //   lowercase: true,
//     //   validate: {
//     //     validator: function (value) {
//     //       return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
//     //     },
//     //     message: (props) => `${props.value} is not a valid email!`,
//     //   },
//     // },
//     phone: {
//       type: Number,
//       required: [true, "Phone is required!"],
//       minlength: [10, "Phone must be at least 10 characters long"],
//       maxlength: [10, "Phone cannot exceed 10 characters"],
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required!"],
//     },
//     validuser: {
//       type: Boolean,
//       default: false,
//     },
//     money: {
//       type: Number,
//       default: 0,
//     },
//     bankName: String,
//     ahn: String, //accountholderName
//     branch: String, //branch Address
//     accountNumber: Number,
//     ifsc: String,
//     paytmUpi: String,
//     googleUpi: String,
//     phonepeUpi: String,
//     account: {
//       type: Boolean,
//       default: false,
//     },
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//     status: {
//       type: String,
//       default: "Approved", // Approved, Rejected, Blocked
//     },
//     // transection: [{ type: Schema.Types.ObjectId, ref: "Transection" }],
//     referCode: String,
//     senderCode: {
//       type: String,
//       default: "2KYuafe6",
//     },
//     show: {
//       type: Boolean,
//       default: true, // true and false
//     },
//     normalPassword: {
//       type: String,
//     },
//     createdAt: {
//       type: Date,
//       default: () => {
//         let now = new Date();
//         now.setHours(now.getHours() + 5);
//         now.setMinutes(now.getMinutes() + 30);
//         return now;
//       },
//     },
//   },

// );

// const user = model("User", userSchema);

// export default user;


import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!"],
    },
    phone: {
      type: Number,
      required: [true, "Phone is required!"],
      minlength: [10, "Phone must be at least 10 characters long"],
      maxlength: [10, "Phone cannot exceed 10 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    validuser: {
      type: Boolean,
      default: false,
    },
    money: {
      type: Number,
      default: 0,
    },
    bankName: String,
    ahn: String, // accountholderName
    branch: String, // branch Address
    accountNumber: Number,
    ifsc: String,
    paytmUpi: String,
    googleUpi: String,
    phonepeUpi: String,
    account: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Approved", // Approved, Rejected, Blocked
    },
    referCode: String,
    senderCode: {
      type: String,
      default: "2KYuafe6",
    },
    show: {
      type: Boolean,
      default: true, // true and false
    },
    normalPassword: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: () => {
        let now = new Date();
        now.setHours(now.getHours() + 5);
        now.setMinutes(now.getMinutes() + 30);
        return now;
      },
    },

    // OTP Verification Fields
    otp: {
      type: String, // or Number if you prefer
    },
    otpExpires: {
      type: Date, // Expiration time for OTP
    },
    otpVerified: {
      type: Boolean,
      default: false, // Indicates if OTP is verified
    },
  },
);
// Method to set OTP and its expiration
userSchema.methods.setOtp = function (otp) {
  this.otp = otp;
  const now = new Date();
  this.otpExpires = new Date(now.getTime() + 10 * 60000); // OTP valid for 10 minutes
  console.log(`Generated OTP: ${otp}, Expires at: ${this.otpExpires}`); // Add logging for debugging
};

// Method to verify OTP
userSchema.methods.verifyOtp = function (inputOtp) {
  const now = new Date();
  console.log(`Stored OTP: ${this.otp}, Input OTP: ${inputOtp}, Expires at: ${this.otpExpires}, Now: ${now}`); // Add logging for debugging
  if (this.otp == inputOtp ) {
    this.otpVerified = true;
    return true;
  }
  return false;
};
const User = model("User", userSchema);

export default User;
