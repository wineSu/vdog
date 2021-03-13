import { LOADING_SOURCE_CODE, NOT_BOOTSTRAPPED } from "../applications/app.helpers";

function flattenFnArray(fns) {
    fns = Array.isArray(fns) ? fns : [fns];
    // compose
    return (props) => fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve());
}


export async function toLoadPromise(app) {

    //异步正在加载中的，不需要再加载，直到加载完毕后删除这个属性
    if (app.loadPromise) {
        return app.loadPromise; 
    }

    return (app.loadPromise = Promise.resolve().then(async () => {
        app.status = LOADING_SOURCE_CODE;
        let { bootstrap, mount, unmount } = await app.loadApp(app.customProps);
        app.status = NOT_BOOTSTRAPPED;
        // promise compose
        app.bootstrap = flattenFnArray(bootstrap);
        app.mount = flattenFnArray(mount);
        app.unmount = flattenFnArray(unmount);
        // 直到异步加载完毕，否则会重复触发
        delete app.loadPromise;
        return app;
    }))
}