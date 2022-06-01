export default function attachCustomMethods (vk, methods) {
    vk.custom = {};
    for (let method of Object.entries(methods)) {
        vk.custom[method[0]] = method[1].bind(vk)
    }
}