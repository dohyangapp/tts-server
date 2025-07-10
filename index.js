const express = require('express');
const cors = require('cors');
const app = express();

// 🔓 CORS 허용 + JSON 파싱
app.use(cors());
app.use(express.json());

// 🟢 TTS 요청을 받을 때 (테스트 응답만 보냄)
app.post('/tts', async (req, res) => {
  const text = req.body.text || '기본 테스트 문장입니다.';
  console.log('📥 받은 텍스트:', text);

  // 임시 테스트용 오디오 주소를 보내줌
  res.status(200).json({
    audioUrl: 'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3'
  });
});

// ✅ 기본 루트 페이지 (확인용)
app.get('/', (req, res) => {
  res.send('✅ TTS 테스트 서버 작동 중입니다.');
});

// 🚀 서버 실행
module.exports = app;