process.env.GOOGLE_APPLICATION_CREDENTIALS = './aroma-tts-credentials.json';
const express = require('express');
const fs = require('fs');
const textToSpeech = require('@google-cloud/text-to-speech');
const cors = require('cors');
const ip = require('ip');
const path = require('path');

const app = express();
const port = 3000;
const client = new textToSpeech.TextToSpeechClient();

app.use(cors());
app.use(express.json());
app.use('/audio', express.static(path.join(__dirname, 'audio'))); // audio 폴더 공개

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

    // output.mp3를 audio 폴더에 저장
    const audioPath = path.join(__dirname, 'audio', 'output.mp3');
    fs.writeFileSync(audioPath, response.audioContent, 'binary');
    console.log('✅ 음성 파일 생성 완료! 🎵');

    // 앱에서 접근 가능한 URL 보내기
    const audioUrl = `http://${ip.address()}:${port}/audio/output.mp3`;
    res.status(200).json({ audioUrl });
  } catch (error) {
    console.error('❌ 음성 생성 실패:', error);
    res.status(500).send('Error generating audio');
  }
});

app.listen(port, () => {
  console.log(`🚀 서버 실행 중! 주소: http://${ip.address()}:${port}`);
});