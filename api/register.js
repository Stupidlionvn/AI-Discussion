// File: api/register.js
const { createClient } = require('@vercel/kv');

async function handler(req, res) {
    // Chỉ chấp nhận yêu cầu POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Kết nối đến Vercel KV bằng các "chìa khóa" mà Vercel đã tự thêm
        const kvClient = createClient({
            url: process.env.KV_REST_API_URL,
            token: process.env.KV_REST_API_TOKEN,
        });

        // Dữ liệu đăng ký mới từ người dùng
        const newRegistration = {
            id: `reg_${new Date().getTime()}`, // Tạo ID duy nhất
            ...req.body,
            timestamp: new Date().toISOString()
        };

        // Lấy danh sách đăng ký cũ từ database
        // Chúng ta sẽ lưu toàn bộ danh sách dưới một "key" tên là 'registrations'
        let registrations = await kvClient.get('registrations') || [];

        // Thêm đăng ký mới vào danh sách
        registrations.push(newRegistration);

        // Lưu lại toàn bộ danh sách mới vào database
        await kvClient.set('registrations', registrations);

        // Trả về thông báo thành công
        return res.status(200).json({ message: 'Đăng ký thành công! Dữ liệu đã được lưu vào Vercel KV.' });

    } catch (error) {
        console.error('Lỗi từ Vercel KV hoặc server:', error);
        return res.status(500).json({ message: 'Lỗi máy chủ nội bộ. Không thể lưu dữ liệu.' });
    }
}

module.exports = handler;
