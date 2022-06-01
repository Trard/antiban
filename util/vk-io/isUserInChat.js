export default async function isUserInChat(chat_id, user_id) {
    let res = await this.api.messages.getConversationMembers({
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