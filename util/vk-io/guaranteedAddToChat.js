import fetch from "node-fetch";

export default async function guaranteed_add_to_chat (
    user_id,
    chat_id,
    your_id,
    group_chat_id,
    group_id,
    hash,
    string_cookies
) {
    await this.api.groups
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

    await this.api.messages
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