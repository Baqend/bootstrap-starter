/* Require additional modules and handlers here */
//var module = require('module');
//var myCode = require('./otherModule');
//var updateHandler = require('./MyClass/update');

/**
 * This method is invoked if an GET or POST request is send to this module resource
 * Additional backend functionality can be implemented in such method
 *
 * @param {baqend.EntityManager} db The database instance which can be used to load and save additional objects
 * @param {baqend.binding.User} db.User.me The actual unresolved user who requests the operation or null if the user
 * is not logged in
 * @param {Object} data The request payload, the decoded query parameters of a GET request or the parsed body of a
 * POST request
 * @param {express.Request} req The express request object {@link http://expressjs.com/api.html#req}
 * @param {Object} this The module context
 * @return {Promise<*>|Object|Array|String} A json value or string which is send back to the client
 *
 * @throws Abort(reason[, data]) to abort the request with the specified reason
 */
exports.call = function(db, data, req) {

};