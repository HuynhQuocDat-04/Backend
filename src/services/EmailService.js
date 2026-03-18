const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendEmailCreateOrder = async (email, orderItems) => {
    // Cấu hình transporter với tài khoản Gmail
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, 
        auth: {
            user: process.env.MAIL_ACCOUNT, 
            pass: process.env.MAIL_PASSWORD, 
        },
    });

    // Tạo nội dung danh sách sản phẩm bằng HTML
    let listItem = '';
    orderItems.forEach((order) => {
        listItem += `
        <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
            <p><b>Sản phẩm:</b> ${order.name}</p>
            <p><b>Số lượng:</b> ${order.amount}</p>
            <p><b>Giá:</b> ${order.price.toLocaleString()} VND</p>
        </div>`;
    });

    // Gửi email
    let info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT, 
        to: email, // Gửi đến email của người mua
        subject: "Xác nhận đơn hàng từ ULTRA WATCH", 
        html: `
            <h3>Xin chào, bạn đã đặt hàng thành công tại ULTRA WATCH!</h3>
            <p>Dưới đây là chi tiết đơn hàng của bạn:</p>
            ${listItem}
            <br/>
            <p>Cảm ơn bạn đã tin tưởng và mua sắm tại cửa hàng của chúng tôi!</p>
        `,
    });
};

module.exports = {
    sendEmailCreateOrder
};