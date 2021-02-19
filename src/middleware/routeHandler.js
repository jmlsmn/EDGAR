/**
 * A wrapper for routes to reduce the need for try/catch blocks in each route.
 * @param {function} fn 
 */
const routeHandler = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
};

export default routeHandler;