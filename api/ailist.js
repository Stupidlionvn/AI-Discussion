// /api/ailist.js
import fs from 'fs';
export default function handler(req, res) {
  const data = JSON.parse(fs.readFileSync('registrations.json', 'utf8'));
  res.status(200).json(data);
}
