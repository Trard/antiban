import { VK } from "vk-io";
import puppeteer from "puppeteer";
import config from "../config.js";
import fetch from "node-fetch";

let {
    access_token,
    user_id,
    chat_id,
    your_id,
    group_chat_id,
    group_id,
    cookies,
    authorization,
    timeout,
} = config;

const vk = new VK({
    token: access_token,
});

var string_cookies = stringifyCookies(cookies);

var hash;

(async () => {
    hash = await getHash(cookies, authorization, group_id, group_chat_id);
})();

function stringifyCookies(cookies) {
    let string_cookies = "";

    cookies.map((cookie) => {
        string_cookies += `${cookie.name}=${cookie.value}; `;
    });

    return string_cookies;
}

async function getHash(cookies, authorization, group_id, group_chat_id) {
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
    await page.screenshot({ path: "exampl.png" });
    let regex = /IM\.init(.(?<!"hash":"))+"((.(?<!"))*)"/;
    let hash = regex.exec(content)[2];

    browser.close();

    return hash;
}

async function add_to_chat(
    user_id,
    chat_id,
    your_id,
    group_chat_id,
    group_id,
    hash
) {
    await vk.api.groups
        .unban({
            group_id: group_id,
            owner_id: user_id,
        })
        .catch((e) => {
            if (e.code != 15) {
                throw e;
            }
        });

    await fetch("https://vk.com/al_im.php?act=a_toggle_admin", {
        headers: {
            accept: "*/*",
            "accept-language": "en,ru;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua":
                '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            cookie: string_cookies,
            Referer: `https://vk.com/gim${group_id}?sel=c${group_chat_id}`,
            "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: `act=a_toggle_admin&al=1&chat=${
            2000000000 + group_chat_id
        }&gid=${group_id}&hash=${hash}&im_v=3&is_admin=1&mid=${your_id}`,
        method: "POST",
    });

    await vk.api.messages
        .addChatUser({
            chat_id: chat_id,
            user_id: user_id,
            visible_messages_count: 1000,
        })
        .catch((e) => {
            if (e.code != 15) {
                throw e;
            }
        });
}

async function isUserInChat(chat_id, user_id) {
    let res = await vk.api.messages.getConversationMembers({
        count: 1000,
        peer_id: 2000000000 + chat_id,
    });

    for (let user of res.items) {
        if (user.member_id == user_id) {
            return true;
        }
    }

    return false;
}

function main() {
    let interval = setInterval(async () => {
        try {
            if (!(await isUserInChat(chat_id, user_id))) {
                await add_to_chat(
                    user_id,
                    chat_id,
                    your_id,
                    group_chat_id,
                    group_id,
                    hash
                );
                console.log("added");
            }
        } catch (e) {
            console.log("catched");
            clearInterval(interval);

            (async () => {
                hash = await getHash(
                    cookies,
                    authorization,
                    group_id,
                    group_chat_id
                );
            })();

            setTimeout(main, 5 * 60 * 1000);
        }
    }, timeout);
}

main();
