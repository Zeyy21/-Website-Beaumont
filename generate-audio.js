const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_IDS = {
  // Matilda — professional, understated alto narrator.
  en: process.env.ELEVENLABS_ENGLISH_VOICE_ID || 'XrExE9yKIg1WjnnlVkGX',
  // Sarah — warm, mature, and reassuring; Eleven v3 enforces French delivery.
  fr: process.env.ELEVENLABS_FRENCH_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL',
};

if (!API_KEY) {
  throw new Error('ELEVENLABS_API_KEY is required.');
}

const englishScripts = [
  { language: 'en', file: 'public/audio/quote/step-1-property.mp3', text: "Welcome to Beaumont. First, the address. That's all we need — no measuring tape, no site visit yet." },
  { language: 'en', file: 'public/audio/quote/step-2-services.mp3', text: "Now pick what needs washing. One thing or the whole exterior — it's a wish list, not a booking." },
  { language: 'en', file: 'public/audio/quote/step-3-details.mp3', text: "Next, tell us what you're seeing. Rough answers are fine — we check every surface before a number goes on paper." },
  { language: 'en', file: 'public/audio/quote/step-4-contact.mp3', text: "Last step: where do we send the quote? A real person reads every request, usually within a day. No deposit, no pressure — the price you see is the price you pay." },
];

const frenchScripts = [
  { language: 'fr', file: 'public/audio/quote/fr/step-1-property.mp3', text: "Bienvenue chez Beaumont. D'abord, l'adresse. C'est tout ce qu'il nous faut — pas de ruban à mesurer, pas de visite pour l'instant." },
  { language: 'fr', file: 'public/audio/quote/fr/step-2-services.mp3', text: "Maintenant, choisissez ce qui a besoin d'un lavage. Une surface ou tout l'extérieur — c'est une liste de souhaits, pas une réservation." },
  { language: 'fr', file: 'public/audio/quote/fr/step-3-details.mp3', text: "Ensuite, dites-nous ce que vous voyez. Des réponses approximatives suffisent — on vérifie chaque surface avant de mettre un chiffre sur papier." },
  { language: 'fr', file: 'public/audio/quote/fr/step-4-contact.mp3', text: "Dernière étape : où envoie-t-on la soumission? Une vraie personne lit chaque demande, généralement en moins d'une journée. Sans dépôt, sans pression — le prix affiché, c'est le prix payé." },
];

const allScripts = [...englishScripts, ...frenchScripts];

function generateAudio(scriptObj) {
  return new Promise((resolve, reject) => {
    const voiceId = VOICE_IDS[scriptObj.language];
    const data = JSON.stringify({
      text: scriptObj.text,
      model_id: 'eleven_v3',
      language_code: scriptObj.language,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.78,
        use_speaker_boost: true,
        style: 0,
        speed: 0.95,
      },
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: `/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errorData = '';
        res.on('data', chunk => errorData += chunk);
        res.on('end', () => reject(new Error(`Failed to generate audio for ${scriptObj.file}: ${res.statusCode} ${errorData}`)));
        return;
      }

      const filePath = path.join(__dirname, scriptObj.file);
      const tempPath = `${filePath}.tmp`;
      const writeStream = fs.createWriteStream(tempPath);
      res.pipe(writeStream);

      writeStream.on('finish', () => {
        fs.renameSync(tempPath, filePath);
        console.log(`Generated ${scriptObj.file}`);
        resolve();
      });
      writeStream.on('error', (error) => {
        fs.rmSync(tempPath, { force: true });
        reject(error);
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  for (const script of allScripts) {
    await generateAudio(script);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
