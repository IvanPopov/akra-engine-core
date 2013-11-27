import type = require("type");

import isDef = type.isDef;

class Singleton<T> {
    private static _instance: T = null;

    constructor() {
        if (isDef(Singleton._instance))
            throw new Error("Singleton class may be created only one time.");

        Singleton._instance = <T>this;
    }

    static getInstance() {

        if (Singleton._instance === null) {
            Singleton._instance = new ((<any>this).constructor)();
        }

        return Singleton._instance;
    }
}

export = Singleton;