/**
 *  index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-12-12
 */

var AlexaSkill = require('./AlexaSkill');
var logger = require('./logger');

/**
 */
var HomeStar = function () {
    AlexaSkill.call(this, require('./app_id.json') || undefined);
};

HomeStar.prototype = Object.create(AlexaSkill.prototype);
HomeStar.prototype.constructor = HomeStar;

/**
 */
HomeStar.prototype.eventHandlers.onSessionStarted = function (request, session) {
    logger.info({
        module: "HomeStar",
        method: "eventHandlers.onSessionStarted",
        requestId: request.requestId,
        sessionId: session.sessionId,
    }, "started");
};

/**
 */
HomeStar.prototype.eventHandlers.onLaunch = function (request, session, response) {
    logger.info({
        module: "HomeStar",
        method: "eventHandlers.onLaunch",
        requestId: request.requestId,
        sessionId: session.sessionId,
    }, "called");

    var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
    var repromptText = "You can say hello";
    response.ask(speechOutput, repromptText);
};

/**
 */
HomeStar.prototype.eventHandlers.onSessionEnded = function (request, session) {
    logger.info({
        module: "HomeStar",
        method: "eventHandlers.onSessionEnded",
        requestId: request.requestId,
        sessionId: session.sessionId,
    }, "called");
};

/**
 */
var _HomeStarFirstIntent = function (intent, session, response) {
    logger.info({
        module: "HomeStar",
        method: "_HomeStarFirstIntent",
        slots: intent.slots,
        sessionId: session.sessionId,
    }, "called");

    response.tellWithCard("OK - Command Received", "Command Received", "OK");
};

var _HelpIntent = function (intent, session, response) {
    response.ask("You can say hello to me!", "You can say hello to me!");
};

HomeStar.prototype.intentHandlers = {
    "HomeStarFirstIntent": _HomeStarFirstIntent,
    "AMAZON.HelpIntent": _HelpIntent,
};

/**
 *  Create the handler that responds to the Alexa Request.
 */
exports.handler = function (event, context) {
    (new HomeStar()).execute(event, context);
};
