import { LOADING_SOURCE_CODE, NOT_BOOTSTRAPPED } from "../applications/app.helpers";

function flattenFnArray(fns) {
    fns = Array.isArray(fns) ? fns : [fns];
    // compose
    return (props) => fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve());
}


export async function toLoadPromise(app) {
    if (app.loadPromise) {
        return app.loadPromise; //缓存机制
    }
    return (app.loadPromise = Promise.resolve().then(async () => {
        app.status = LOADING_SOURCE_CODE;
        let { bootstrap, mount, unmount } = await app.loadApp(app.customProps);
        app.status = NOT_BOOTSTRAPPED;
        // promise compose
        app.bootstrap = flattenFnArray(bootstrap);
        app.mount = flattenFnArray(mount);
        app.unmount = flattenFnArray(unmount);
        delete app.loadPromise;
        return app;
    }))
}