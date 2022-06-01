# AntiBan for VK

# Prepare

You must have admin rights in group that owns the conversation to run this.

## Clone repo

```sh
git clone https://github.com/Trard/antiban
```

## Install packages

```sh
npm install
```

## Create and fill the ./config.js

[Example of config](./config.example.js)

- access_token - [user access token](https://vk.com/dev/implicit_flow_user)
- your_id - your vk page id
- user_ids - array of user ids that you want protect from ban
- group_id - id of group that owns the conversation
- chat_id - your chat id
- group_chat_id - chat id on the group side
- authorization - authorization header
    - Example: "Basic XzvbhjikoljkjHakjlkqprpurGyrthzgfGhdFabmnaHDSSbFjgkjdaoiHGFHJdkjhfauefkjdloijdk5"
- cookies - vk cookies in JSON format
    - Example: "[{"domain":".vk.com","expirationDate":1685356250,"hostOnly":false,"httpOnly":false,"name":"remixcolor_scheme_mode","path":"/","sameSite":"no_restriction","secure":true,"session":false,"storeId":"0","value":"auto","id":1}, {"domain":".vk.com","expirationDate":1685356250,"hostOnly":false......}]")
- timeout - timeout between checks that user in conversation
- ninja - auto join and leave

# Run
```js
npm run start
```
