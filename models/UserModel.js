// const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please input name"] },
  email: {
    type: String,
    required: [true, "Please input your Email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: { type: String, default: "default.jpg" },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Pleae Provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your Password"],
    validate: {
      //tHIS ONLY WORKS ON CREATE AND SAVE!! !
      validator: function (el) {
        return el === this.password;
      },
      //creating error message
      message: "Password are not the same",
    },
  },
  // passwordCorrect: {
  //   type: String,
  //   required: [true, "Please input a correct password"],
  //   validate: {
  //     //tHIS ONLY WORKS ON CREATE AND SAVE!!!
  //     validator: function (el) {
  //       return el === this.password;
  //     },
  //     //creating error message
  //     message: "Password are not the same",
  //   },
  // },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  //creating a boolean to deactivate and activate our user
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
// //encrypting our password
UserSchema.pre("save", async function (next) {
  //encrypting the password only if the user has changed or creating a new password.
  if (!this.isModified("password")) return next();

  //Hashing or encrypting our user password using bcrypt and hash the password with test of 12
  this.password = await bcrypt.hash(this.password, 12);
  //delte after confirmation
  this.passwordConfirm = undefined;
  next();
});
////////////-----------------
// //
// UserSchema.pre('save',function(next){
//   if(!this.isModified('password') || this.isNew) return next();
// //putting the password 1sec at the pass makes the token created after the password had being changed.
//   this.passwordChangedAt = Date.now() - 1000;
//   next();
// })
//something that will happen before a query
UserSchema.pre('/^find',function(next){
  //since this is a query middleware this point to the current query and only find data with the active set to true
  this.find({active: {$ne: false}})
  next();
})
//creating a function to check if the given password is the same as the data password

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword              
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};  

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  //if it exist then we should compare the password..
  if (this.passwordChangedAt) {
    //
    const changedTimestamp = parseInt(    
      this.passwordChangedAt.getTime() / 1000,  
      10
    );
    // console.log(changedTimestamp, JWTTimestamp);
    //false means not changed which simply means the date or time is less than the changetime
    return JWTTimestamp < changedTimestamp; // 100 < 200
  }

  return false;
};
//
UserSchema.methods.createPasswordResetToken = function () {
  //generate our token 
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    console.log({resetToken}, this.passwordResetToken)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  //sending the reset token
  return resetToken;
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
