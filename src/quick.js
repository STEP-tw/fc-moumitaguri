/**
 * Framework for server to handle requests
 */

/**
 * @function isMatching - checking if req and route are same or not
 * @param {object} req - request 
 * @param {object} route - one of the requests from client to the server
 */
const isMatching = (req, route) => {
  if (route.method && req.method != route.method) return false;
  if (route.url instanceof RegExp && route.url.test(req.url)) return true;
  if (route.url && req.url != route.url) return false;
  return true;
};

class Quick {
  /**
   * @constructor
   */
  constructor() {
    this.routes = [];
  }

  /**
   * @function handleRequest - handles requests which come to the server
   * @param {object} req - request from the client to the server
   * @param {objedt} res - response from the server
   */
  handleRequest(req, res) {
    let matchingRoutes = this.routes.filter(r => isMatching(req, r));
    let remaining = [...matchingRoutes];
    
    let next = () => {
      let current = remaining[0];
      if (!current) return;
      remaining = remaining.slice(1);
      current.handler(req, res, next);
    };
    next();
  }

  /**
   * @function use - adds the handler in the routes
   * @param {callback} handler - handles the request 
   */
  use(handler) {
    this.routes.push({ handler });
  }

  /**
   *  @function get -adds the url ,handler and GET method in the routes
   * @param {string} url - path to the server for the GET method
   * @param {callback} handler - handles the request 
   */
  get(url, handler) {
    this.routes.push({ method: "GET", url, handler });
  }

  /**
   * @function post - adds the url ,handler and POST method in the routes
   * @param {string} url - path to the server for the POST method
   * @param {callback} handler - handles the request 
   */
  post(url, handler) {
    this.routes.push({ method: "POST", url, handler });
  }
}

/**
 * exports the Quick class
 */
module.exports = Quick;