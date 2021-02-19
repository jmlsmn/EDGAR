import cacheFactory from '../util/cacheFactory';
import config from '../config';

/**
 * Middleware to cache requests
 * @param {int} ttl - Time to live in seconds 
 */
const cacheHandler = (ttl = config.defaultCacheDurationSeconds) => {
    return (req, res, next) => {
        const key =  `_express_request_${req.originalUrl || req.url}`;
        const cachedRequest = cacheFactory.instance().get(key);

        if (cachedRequest) {
            res.send(cachedRequest);
            return
        } else {
            res.sendResponse = res.send;
            res.send = (body) => {
                cacheFactory.instance().set(key, body, ttl * 1000);
                res.sendResponse(body);
            }
            next();
        }
    }
};

export default cacheHandler;