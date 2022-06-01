export default async function getUsersToAdd(chat_id, user_ids) {
    let usersToAdd = [];

    let ConversationMembers = await this.api.messages.getConversationMembers({
        count: 1000,
        peer_id: 2000000000 + chat_id,
    }).then(res => res.items)

    let ConversationMembersIds = ConversationMembers.map(member => member.member_id)

    for (let user_id of user_ids) {
        if (ConversationMembersIds.indexOf(user_id) == -1) {
            usersToAdd.push(user_id)
        }
    }

    return usersToAdd;
}