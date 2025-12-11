// This file mocks the MapView class import
export default class MapView {
    constructor() {
        this.when = () => Promise.resolve(this);
    }
    destroy() {}
};