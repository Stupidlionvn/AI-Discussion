// File: api/register.js - PHIÊN BẢN SỬA LỖI
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Chỉ chấp nhận yêu cầu POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const newRegistration = {
            id: `reg_${new Date().getTime()}`,
            ...req.body,
            timestamp: new Date().toISOString()
        };

        // Lấy danh sách đăng ký cũ từ Vercel KV
        // Chúng ta lưu danh sách dưới một "key" tên là 'registrations'
        let registrations = await kv.get('registrations') || [];

        // Đảm bảo rằng 'registrations' luôn là một mảng
        if (!Array.isArray(registrations)) {
            registrations = [];
        }

        // Thêm đăng ký mới vào danh sách
        registrations.push(newRegistration);

        // Lưu lại toàn bộ danh sách mới
        await kv.set('registrations', registrations);

        // Trả về thông báo thành công
        return res.status(200).json({ message: 'Đăng ký thành công! Dữ liệu đã được lưu vào Vercel KV.' });

    } catch (error) {
        console.error('[API_ERROR]', error);
        return res.status(500).json({ message: 'Lỗi máy chủ nội bộ. Không thể lưu dữ liệu.' });
    }
}
