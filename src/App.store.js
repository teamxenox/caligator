const { Store } = require('svelte/store');

class _AppStore extends Store {
    constructor() {
        super({
            showModal: false
        });
    }
}

export const AppStore = window.store = new _AppStore();
