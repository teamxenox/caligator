const { Store } = require('svelte/store');
const main = require('../utils/main');

class _AppStore extends Store {
    constructor() {
        super({
            showModal: false,
            rawInput: '',
        });

        this.compute('inputs', ['rawInput'], rawInput => rawInput.split('\n'));
        this.compute('outputs', ['inputs'], outputs => 
            outputs.map(line => main(line))
        );
    }
}

export const AppStore = window.store = new _AppStore();
