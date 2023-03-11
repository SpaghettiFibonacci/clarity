import puppeteer from "puppeteer";

export async function getContentFromHeadlessBrowser(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);

    const contentText = await page.evaluate(() => {
        const element = document.body;
        return element.innerText;
      });

    await browser.close();
    return contentText;
}

export async function getUrlsFromDuckDuckGo(url) {
    /* encode uri/url whatever it is */
    url = encodeURI(url);

    console.log(url)
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    const textSelector = await page.waitForSelector(
        '.result__url'
    );
    const urls = await page.$$eval('.result__url', as => as.map(a => a.innerText));

    await browser.close();
    return urls;
}