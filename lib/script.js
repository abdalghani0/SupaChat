const checkPermission = () => {
    if(!('serviceWorker' in navigator))
        throw new Error("no support for service worker")
}

const registerSW = async() => {
    const registration = await navigator.serviceWorker.register("sw.js");
    return registration;
}

checkPermission()
registerSW();
console.log("worked")