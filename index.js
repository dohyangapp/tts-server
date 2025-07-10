// ✅ 필요한 라이브러리 가져오기
const express = require('express');
const cors = require('cors');
const textToSpeech = require('@google-cloud/text-to-speech'); // 🔸 추가
const app = express();

// ✅ 환경변수에서 인증 정보 가져오기
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
const client = new textToSpeech.TextToSpeechClient({ credentials }); // 🔸 인증 방식 수정

// ✅ 기본 설정
app.use(cors());               // 모든 요청 허용 (CORS)
app.use(express.json());       // JSON 형식 요청 파싱

// ✅ TTS 요청 처리
app.post('/tts', async (req, res) => {
  const text = req.body.text || '기본 테스트 문장입니다.';
  console.log('📥 받은 텍스트:', text);

  const request = {
    input: { text },
    voice: { languageCode: 'ko-KR', name: 'ko-KR-Neural2-B' }, // 🔸 AI 여자 목소리
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent.toString('base64'); // base64로 인코딩
    res.status(200).json({ audioContent }); // 프론트에서 이걸 audio로 플레이
  } catch (error) {
    console.error('❌ 음성 생성 실패:', error);
    res.status(500).send('TTS 처리 중 오류 발생');
  }
});

// ✅ 상태 확인용 루트 페이지
app.get('/', (req, res) => {
  res.send('✅ TTS 서버가 정상 작동 중입니다.');
});

// ✅ Vercel용 내보내기
module.exports = app;