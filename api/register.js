// File: api/register.js
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
    // Chỉ chấp nhận yêu cầu POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const newRegistration = {
            ...req.body,
            timestamp: new Date().toISOString()
        };

        // Đổi tên file database thành registrations.json
        const dbPath = path.join(process.cwd(), 'registrations.json');
        console.log(`Đang truy cập database tại: ${dbPath}`); // Dòng log mới

        let database = { registrations: [] };
        
        try {
            const fileContent = await fs.readFile(dbPath, 'utf8');
            database = JSON.parse(fileContent);
        } catch (error) {
            console.log('registrations.json not found, creating a new one.');
        }

        database.registrations.push(newRegistration);

        await fs.writeFile(dbPath, JSON.stringify(database, null, 2));

        res.status(200).json({ message: 'Đăng ký thành công! Dữ liệu đã được lưu.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
