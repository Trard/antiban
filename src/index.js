import { VK } from "vk-io";
import stringifyCookies from "../util/stringifyCookies.js";
import getHash from "../util/getHash.js";
import isUserInChat from "../util/vk-io/isUserInChat.js";
import config from "../config.js";
import guaranteed_add_to_chat from "../util/vk-io/guaranteedAddToChat.js";
import attachCustomMethods from "../util/vk-io/attachCustomMethods.js"

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

attachCustomMethods(vk, {
    isUserInChat,
    guaranteed_add_to_chat
})

var string_cookies = stringifyCookies(cookies);

var hash;

(async () => {
    hash = await getHash(cookies, authorization, group_id, group_chat_id);
})();

function main() {
    let interval = setInterval(async () => {
        try {
            if (!(await vk.custom.isUserInChat(chat_id, user_id))) {
                await vk.custom.guaranteed_add_to_chat(
                    user_id,
                    chat_id,
                    your_id,
                    group_chat_id,
                    group_id,
                    hash,
                    string_cookies
                );
                console.log("added");
            }
        } catch (e) {
            console.log(e)
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
