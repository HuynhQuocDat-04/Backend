const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Đã gỡ bỏ required: true ở name và phone
    name: { type: String }, 
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    phone: { type: Number }, 
    address: { type: String }, // Thêm trường address
    avatar: { type: String },  // Thêm trường avatar
    access_token: { type: String, default: null, required: false },
    refresh_token: { type: String, default: null, required: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;