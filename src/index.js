const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cors = require('cors');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// 1. Cấu hình CORS chi tiết để nhận được Cookie từ Frontend
app.use(cors({
    origin: 'http://localhost:3000', // Địa chỉ React App của bạn
    credentials: true // Cho phép trao đổi cookie giữa client và server
}));

// 2. Sử dụng cookie-parser để đọc token từ req.cookies
app.use(cookieParser());

// 3. Tăng giới hạn dung lượng request lên 50mb để xử lý chuỗi Base64 của ảnh Avatar
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Luôn để routes(app) sau các middleware cấu hình (cors, parser)
routes(app);

mongoose.connect(`${process.env.MONGO_DB}`)
.then(() => {
    console.log("Connected to MongoDB successfully");
})
.catch((err) => {
    console.log(err);
});

app.listen(port, () => {
  console.log("Server is running in port: " + port);
});