import { chromium } from '@playwright/test';
import path from 'path';
import { pathToFileURL } from 'url';
import fs from 'fs';

const html = path.resolve('playwright-walkthrough.html');
const pdf = path.resolve('Playwright-Testing-Walkthrough.pdf');

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.goto(pathToFileURL(html).href, { waitUntil: 'load' });
await page.pdf({
  path: pdf,
  format: 'A4',
  printBackground: true,
  margin: { top: '16mm', bottom: '18mm', left: '16mm', right: '16mm' },
});
await browser.close();

const downloads = path.join(process.env.USERPROFILE || '', 'Downloads', 'Playwright-Testing-Walkthrough.pdf');
try {
  fs.copyFileSync(pdf, downloads);
  console.log('Copied to', downloads);
} catch (err) {
  console.log('Could not copy to Downloads:', err.message);
}
console.log('Wrote', pdf);
console.log('Size', fs.statSync(pdf).size);
