import NodeCache from 'node-cache';

/**
 * Cache Factory to create a single instance of node-cache
 */

let cache = null;

/**
 * Instantiates the cache
 */
const init = function() {
    cache = new NodeCache();
};

/**
 * Returns the instance of the cache
 */
const instance = function() {
    return cache;
};

export default {
    init,
    instance
};