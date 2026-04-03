import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const W = 1290, H = 2796;

const screenshots = [
  { id: 'ss1', file: 'appstore_ss1.png' },
  { id: 'ss2', file: 'appstore_ss2.png' },
  { id: 'ss3', file: 'appstore_ss3.png' },
];

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.goto(`file://${path.join(__dirname, 'appstore-screenshots.html')}`, { waitUntil: 'networkidle0' });

// Remove preview scaling + info boxes, render each screenshot at native 1290x2796
await page.evaluate(() => {
  document.querySelectorAll('.info, .label').forEach(el => el.remove());
  document.querySelectorAll('.preview-wrapper').forEach(el => {
    el.style.transform = 'none';
    el.style.marginBottom = '60px';
  });
  document.body.style.padding = '0';
  document.body.style.gap = '0';
  document.body.style.background = '#fff';
});

for (const ss of screenshots) {
  const el = await page.$(`#${ss.id}`);
  const outPath = path.join(__dirname, 'screenshots', ss.file);
  await el.screenshot({ path: outPath, type: 'png' });
  console.log(`✅ ${ss.file} → ${W}x${H}`);
}

await browser.close();
console.log('Done!');
