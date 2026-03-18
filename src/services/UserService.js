const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, phone } = newUser;
    try {
      const checkUser = await User.findOne({ email });
      if (checkUser !== null) {
        return resolve({ status: "ERR", message: "The email is already in use" });
      }
      const hash = bcrypt.hashSync(password, 10);
      const createdUser = await User.create({ name, email, password: hash, phone });
      if (createdUser) {
        resolve({ status: "OK", message: "SUCCESS", data: createdUser });
      }
    } catch (e) { reject(e); }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({ email });
      if (checkUser === null) {
        return resolve({ status: "ERR", message: "The user is not defined" });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (!comparePassword) {
        return resolve({ status: "ERR", message: "The password or user is incorrect" });
      }
      const payload = { id: checkUser.id, isAdmin: checkUser.isAdmin };
      const access_token = await genneralAccessToken(payload);
      const refresh_token = await genneralRefreshToken(payload);

      resolve({
        status: "OK", message: "SUCCESS", access_token, refresh_token,
        data: {
          name: checkUser.name, email: checkUser.email, isAdmin: checkUser.isAdmin,
          phone: checkUser.phone, address: checkUser.address, avatar: checkUser.avatar, _id: checkUser.id
        }
      });
    } catch (e) { reject(e); }
  });
};

const getDetailUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || userId === 'undefined') {
        return resolve({ status: "ERR", message: "Invalid User ID" });
      }
      const user = await User.findOne({ _id: userId });
      if (user === null) {
        return resolve({ status: "ERR", message: "The user is not defined" });
      }
      resolve({ status: "OK", message: "SUCCESS", data: user });
    } catch (e) { reject(e); }
  });
};

const updateUser = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || userId === "undefined") {
        return resolve({ status: "ERR", message: "The userId is required" });
      }
      const checkUser = await User.findOne({ _id: userId });
      if (checkUser === null) {
        return resolve({ status: "ERR", message: "The user is not defined" });
      }
      const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });
      resolve({ status: "OK", message: "SUCCESS", data: updatedUser });
    } catch (e) { reject(e); }
  });
};

const deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || userId === "undefined") {
        return resolve({ status: "ERR", message: "The userId is required" });
      }
      const checkUser = await User.findOne({ _id: userId });
      if (checkUser === null) {
        return resolve({ status: "ERR", message: "The user is not defined" });
      }
      await User.findByIdAndDelete(userId);
      resolve({ status: "OK", message: "Delete user success" });
    } catch (e) { reject(e); }
  });
};

// Hàm mới: Thực thi xóa hàng loạt người dùng trong Database
const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: ids });
      resolve({ status: "OK", message: "Delete user success" });
    } catch (e) { reject(e); }
  });
};

const getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUsers = await User.find();
      resolve({ status: "OK", message: "SUCCESS", data: allUsers });
    } catch (e) { reject(e); }
  });
};

module.exports = {
  createUser, loginUser, updateUser, deleteUser, getAllUsers, getDetailUser,
  deleteManyUser // Export hàm mới
};