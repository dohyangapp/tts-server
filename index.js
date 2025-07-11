const textToSpeech = require('@google-cloud/text-to-speech');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ✅ 환경변수에서 자격증명 가져오기
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
const client = new textToSpeech.TextToSpeechClient({ credentials });

// ✅ TTS 엔드포인트
app.post('/tts', async (req, res) => {
  const text = req.body.text || '기본 테스트 문장입니다.';
  console.log('📥 받은 텍스트:', text);

  try {
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode: 'ko-KR', name: 'ko-KR-Neural2-B' },
      audioConfig: { audioEncoding: 'MP3' },
    });

    const audioBase64 = response.audioContent.toString('base64');
    const audioUrl = `data:audio/mp3;base64,${audioBase64}`;
    res.status(200).json({ audioUrl });
  } catch (err) {
    console.error('❌ TTS 처리 오류:', err);
    res.status(500).json({ error: 'TTS 처리 중 오류 발생' });
  }
});

// 기본 라우터
app.get('/', (req, res) => {
  res.send('✅ TTS 서버 작동 중');
});

// ✅ ✅ ✅ 마지막 줄 추가 (Vercel용 필수!)
module.exports = app;
