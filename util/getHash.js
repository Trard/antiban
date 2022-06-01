import puppeteer from "puppeteer";

export default async function getHash(cookies, authorization, group_id, group_chat_id) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setCookie(...cookies);
    await page.setExtraHTTPHeaders({
        "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0",
        Authorization: authorization,
    });
    await page.goto(`https://vk.com/gim${group_id}?sel=c${group_chat_id}`);

    let content = await page.content();

    let regex = /IM\.init(.(?<!"hash":"))+"((.(?<!"))*)"/;
    let hash = regex.exec(content)[2];

    browser.close();

    return hash;
}