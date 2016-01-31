/**
 *  logger.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-12-13
 */

var _logger = function() {
    for (ai = 0; ai < arguments.length; ai++) {
        console.log((ai === 0) ? "+" : " ", arguments[ai]);
    }
};

exports.debug = _logger;
exports.info = _logger;
exports.error = _logger;
