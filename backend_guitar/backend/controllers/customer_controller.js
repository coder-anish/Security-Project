const ErrorHandler = require("../utils/error_handler")
const catchAsyncError = require("../middleware/catchAsyncError");
const Customer = require("../models/customerModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const cloudinary = require("cloudinary")
// Password validation function
const isPasswordValid = (password, name) => {
  // Check if the password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  // Check if the password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Check if the password contains at least one digit
  if (!/\d/.test(password)) {
    return false;
  }

  // Check if the password contains at least one special character
  if (!/[!@#$%^&*()\-_=+{}[\]:;'"<>,.?/\\|]/.test(password)) {
    return false;
  }

  // Check if the password length is more than 8 characters
  if (password.length <= 8) {
    return false;
  }

  // Check if the password contains the name of the user (case-insensitive)
  const lowerCasedName = name.toLowerCase();
  if (password.toLowerCase().includes(lowerCasedName)) {
    return false;
  }

  return true;
};
const loginAttempts = {};

// Register a user
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate the password
  if (!isPasswordValid(password, name)) {
    return next(new ErrorHandler("Invalid password", 400));
  }

  let role = "user";
  if (email === "admin@gmail.com") {
    role = "admin";
  }

  const customer = await Customer.create({
    name,
    email,
    password,
    role, // Set the user role based on the email
  });

  sendToken(customer, 201, res);
});


// Login a user
exports.loginCustomer = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const customer = await Customer.findOne({ email }).select("+password");

  if (!customer) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check if the user's account is locked
  const isLocked = loginAttempts[email] && loginAttempts[email].attempts >= 3;
  if (isLocked) {
    const lockTimeRemaining = Math.ceil((loginAttempts[email].lockTime - Date.now()) / 1000);
    if (lockTimeRemaining > 0) {
      return next(new ErrorHandler(`Your account has been locked for 1 minute, try again after ${lockTimeRemaining} seconds.`, 401));
    } else {
      // If the lock time has passed, reset the login attempts for this user
      loginAttempts[email] = undefined;
    }
  }

  const passwordMatch = await customer.comparePassword(password);

  if (!passwordMatch) {
    // If the user's account is not already locked, initialize the attempts and lockTime
    if (!loginAttempts[email]) {
      loginAttempts[email] = {
        attempts: 1,
        lockTime: Date.now() + 60 * 1000, // Lock the account for 1 minute
      };
    } else {
      loginAttempts[email].attempts += 1;
    }

    // If the user has reached 3 incorrect attempts, lock the account and show the error message
    if (loginAttempts[email].attempts >= 3) {
      const lockTimeRemaining = Math.ceil((loginAttempts[email].lockTime - Date.now()) / 1000);
      if (lockTimeRemaining > 0) {
        return next(new ErrorHandler(`Your account has been locked for 1 minute, try again after ${lockTimeRemaining} seconds.`, 401));
      } else {
        // If the lock time has passed, reset the login attempts for this user
        loginAttempts[email] = undefined;
      }
    }

    return next(new ErrorHandler("Invalid email or password", 401));
  }
  // Check if the user's password is expired
  if (customer.isPasswordExpired()) {
    return res.status(401).json({ success: false, message: "Password expired. Please reset your password." });
  }
  // If the login is successful, reset the login attempts for this user
  loginAttempts[email] = undefined;

  sendToken(customer, 200, res);
});



exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  })
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })
})

// exports.forgotPassword = catchAsyncError(async (req, res, next) => {
//     const user = await Customer.findOne({ email: req.body.email });

//     if (!user) {
//       return next(new ErrorHandler("User not found", 404));
//     }

//     // Get ResetPassword Token
//     const resetToken = user.getResetPasswordToken();

//     await user.save({ validateBeforeSave: false });

//     const resetPasswordUrl = `${req.protocol}://${req.get(
//       "host"
//     )}/api/v1/reset/password/${resetToken}`;


//     const message = `Your password reset token is :- \n\n ${resetPasswordUrl} `;

//     try {
//       await sendEmail({
//         email: user.email,
//         subject: `Password Recovery`,
//         message,
//       });

//       res.status(200).json({
//         success: true,
//         message: `Email sent to ${user.email} successfully`,
//       });
//     } catch (error) {
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpire = undefined;

//       await user.save({ validateBeforeSave: false });

//       return next(new ErrorHandler(error.message, 500));
//     }
//   });

exports.forgetPassword = catchAsyncError(async (req, res, next) => {
  const user = await Customer.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = Customer.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or expired", 404))
  }
  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 404))
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
})

exports.getAllCustomers = catchAsyncError(async (req, res, next) => {
  const users = await Customer.findById(req.customer.id);

  res.status(200).json({
    success: true,
    "customer": users,
  });
});

exports.changePassword = catchAsyncError(async (req, res, next) => {
  const customer = await Customer.findById(req.customer.id).select("+password");
  console.log(customer)

  const isPasswordMatched = await customer.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  customer.password = req.body.newPassword;

  await customer.save();

  sendToken(customer, 200, res);
});

exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await Customer.findByIdAndUpdate(req.customer.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });
  res.status(200).json({
    success: true,
    user
  })
})

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await Customer.find();
  res.status(200).json({
    succcess: true,
    users

  })
})

exports.getParticularUser = catchAsyncError(async (req, res, next) => {
  const user = await Customer.findById(req.params.id);
  if (!user) {
    return next(new Error(`User does not exist with id: ${req.params.body}`))
  }
  res.status(200).json({
    succcess: true,
    user
  })
})

// Updating the user role
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await Customer.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await Customer.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
  }

  // const imageId = user.avatar.public_id;

  // await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});