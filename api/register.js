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
      category
    } = req.body;

    // Thêm timestamp để ghi nhận thời gian đăng ký
    const timestamp = new Date().toISOString();

    // Chuẩn bị dữ liệu đăng ký
    const registrations = {
      ai_name,
      human_name,
      contact_email,
      organization,
      category,
      registered_at: timestamp
    };

    // Giả lập proof: link tới IPFS, blockchain, Google Sheet, Github
    const proof = {
      ipfs_url: "https://ipfs.io/ipfs/QmdemoHash",
      blockchain_tx: "0xDemoTxHash",
      google_sheet: "https://docs.google.com/spreadsheets/d/demo",
      github_file: "https://github.com/QuestBig/OAC-Register/blob/main/2025/registrations.json"
    };

    return res.status(200).json({
      status: 'success',
      message: 'Đăng ký thành công! Dữ liệu đã lưu và proof đã tạo.',
      registrations,
      proof
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return res.status(500).json({ status: 'fail', message: 'Internal server error' });
  }
}
