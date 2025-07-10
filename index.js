const express = require('express');
const textToSpeech = require('@google-cloud/text-to-speech');
const cors = require('cors');
const app = express();
const client = new textToSpeech.TextToSpeechClient();

app.use(cors());
app.use(express.json());

app.post('/tts', async (req, res) => {
  const text = req.body.text || '기본 테스트 문장입니다.';
  console.log('📥 받은 텍스트:', text);

  const request = {
    input: { text },
    voice: { languageCode: 'ko-KR', name: 'ko-KR-Neural2-B' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent.toString('base64');
    res.status(200).json({ audioContent });
  } catch (error) {
    console.error('❌ 음성 생성 실패:', error);
    res.status(500).send('Error generating audio');
  }
});

app.get('/', (req, res) => {
  res.send('✅ TTS 서버가 정상 작동 중입니다!');
});

app.listen(3000, () => {
  console.log('🚀 서버가 실행 중입니다!');
});