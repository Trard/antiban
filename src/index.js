import { VK } from "vk-io";
import stringifyCookies from "../util/stringifyCookies.js";
import getHash from "../util/getHash.js";
import getUsersToAdd from "../util/vk-io/getUsersToAdd.js";
import config from "../config.js";
import appointAdmin from "../util/vk-io/appointAdmin.js"
import attachCustomMethods from "../util/vk-io/attachCustomMethods.js"

let {
    access_token,
    user_ids,
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
    getUsersToAdd,
    appointAdmin
})

var string_cookies = stringifyCookies(cookies);

var hash;

(async () => {
    hash = await getHash(cookies, authorization, group_id, group_chat_id);
})();

function main() {
    let interval = setInterval(async () => {
        try {
            let usersToAdd = await vk.custom.getUsersToAdd(chat_id, user_ids)
            if (usersToAdd.length != 0) {
                await vk.custom.appointAdmin({
                    "user_id": your_id,
                    group_chat_id,
                    group_id,
                    hash,
                    string_cookies
                });

                for (let user_id of usersToAdd) {
                    await vk.api.groups
                    .unban({
                        group_id,
                        owner_id: user_id,
                    })
                    .catch((e) => {
                        if (e.code != 15) {
                            throw e;
                        }
                    });

                    await vk.api.messages
                        .addChatUser({
                            chat_id,
                            user_id,
                            visible_messages_count: 1000,
                        })
                        .catch((e) => {
                            if (e.code != 15) {
                                throw e;
                            }
                        })
                    
                    console.log("added", user_id);
                }
            }
        } catch (e) {
            console.log("catched", e);
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
