const axios = require('axios');
const fs = require('fs');

async function dl(userId, serverId) {
    /*const data = await axios.post('https://sc.snapfirecdn.com/soundcloud',{ target: url, gsc: 'x' });
    
    
    fs.writeFileSync('result.json', JSON.stringify(data.data, null, 2), 'utf-8');*/
    
    const res = await axios.get('https://cekidml.caliph.dev/api/validasi?id=' + userId + '&serverid=' + serverId);
    
    const data = res.data;
    
    let nickName;
    let country;
    
    if (data.status === 'success') {
        nickName = data.result.nickname;
        country = data.result.country;
    } else if (data.data.status === 'failed') {
        throw new Error("Data tidak ditemukan!");
    }
    return {NickName: data.result.nickname || '-', Country: data.result.country || '-' }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { userId, serverId } = req.body;
  if (!userId || !serverId) return res.status(400).json({ error: 'UserId & ServerId is required' });


  try {
    let result = await dl(userId, serverId);
    return res.status(200).json({ success: true, ...result });

  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Gagal memproses. Coba lagi.' });
  }
};