const { Store } = require('svelte/store');
const caligatorCore = require('../utils/main');

const theme = localStorage.getItem('caligator_theme') || 'auto';

class _AppStore extends Store {
    constructor() {
        super({
            showModal: false,
            theme,
            rawInput: '',
        });

        this.compute('inputs', ['rawInput'], rawInput => rawInput.split('\n'));
        this.compute('outputs', ['inputs'], outputs => 
            outputs.map(line => caligatorCore(line))
        );
    }
}



export const AppStore = window.store = new _AppStore();

AppStore.on('update', ({ changed, current }) => {
    if (changed.theme) {
        localStorage.setItem('caligator_theme', current.theme);
    }
});
