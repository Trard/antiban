export default function stringifyCookies(cookies) {
    let string_cookies = "";

    cookies.map((cookie) => {
        string_cookies += `${cookie.name}=${cookie.value}; `;
    });

    return string_cookies;
}