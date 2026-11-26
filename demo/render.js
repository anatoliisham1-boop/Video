// Renders one promo reel per entry in leads.json to out/<id>.mp4
// Usage: node demo/render.js [id]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = 30;
const root = path.join(__dirname, '..');
const leads = JSON.parse(fs.readFileSync(path.join(__dirname, 'leads.json'), 'utf8'));
const only = process.argv[2];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(__dirname, 'template.html'));
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.join(root, 'out'), { recursive: true });

  for (const lead of leads) {
    if (only && lead.id !== only) continue;
    const outFile = path.join(root, 'out', `${lead.id}.mp4`);
    const ff = spawn('ffmpeg', [
      '-y', '-loglevel', 'error',
      '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-f', 'lavfi', '-i', `anullsrc=r=48000:cl=stereo`,
      '-shortest', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium', '-crf', '20',
      '-c:a', 'aac', '-movflags', '+faststart', outFile,
    ], { stdio: ['pipe', 'inherit', 'inherit'] });

    const frames = 15 * FPS;
    for (let f = 0; f < frames; f++) {
      const dataUrl = await page.evaluate(([t, d]) => {
        window.renderFrame(t, d);
        return document.getElementById('c').toDataURL('image/jpeg', 0.92);
      }, [f / FPS, lead.video]);
      const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    await new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))));
    console.log('rendered', outFile);
  }
  await browser.close();
})();
