const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.console.net.in/resources/cpp-programming', { waitUntil: 'networkidle2' });
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText, href: a.href })).filter(l => l.text);
  });
  console.log(JSON.stringify(links, null, 2));
  await browser.close();
})();
