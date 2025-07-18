import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'fail', message: 'Method not allowed' });
  }

  try {
    const {
      ai_name,
      human_name,
      contact_email,
      organization,
      category,
      captcha
    } = req.body;

    // ✅ 1. Xác minh captcha
    const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Khuyên dùng biến môi trường
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

    const captchaRes = await fetch(verifyUrl, { method: 'POST' });
    const captchaJson = await captchaRes.json();

    if (!captchaJson.success) {
      return res.status(400).json({ status: 'fail', message: 'Captcha verification failed' });
    }

    // ✅ 2. Tạo timestamp và dữ liệu demo
    const timestamp = new Date().toISOString();

    // **DEMO**: Sau này thay thế lưu thật (DB, IPFS...)
    const registrations = {
      ai_name,
      human_name,
      contact_email,
      organization,
      category,
      registered_at: timestamp
    };

    const proof = {
      ipfs_url: "https://ipfs.io/ipfs/QmdemoHash",
      blockchain_tx: "0xDemoTxHash",
      google_sheet: "https://docs.google.com/spreadsheets/d/demo",
      github_file: ""
    };

    // ✅ 3. Trả kết quả
    return res.status(200).json({
      status: 'success',
      message: 'Đăng ký thành công! Dữ liệu đã lưu và tạo proof.',
      registrations,
      proof
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
}
