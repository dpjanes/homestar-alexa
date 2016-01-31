/**
 *  index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-12-12
 */

var AlexaSkill = require('./AlexaSkill');
var Transport = require('iotdb-transport-mqtt').Transport;

var iotdb = require('iotdb');
var _ = iotdb._;

var logger = iotdb.logger({
    name: "HomeStar",
    module: "index",
});

/**
 */
var HomeStar = function () {
    var self = this;
    AlexaSkill.call(this, require('./app_id.json') || undefined);
};

HomeStar.prototype = Object.create(AlexaSkill.prototype);
HomeStar.prototype.constructor = HomeStar;

/**
 */
HomeStar.prototype.eventHandlers.onSessionStarted = function (request, session) {
    logger.info({
        method: "eventHandlers.onSessionStarted",
        requestId: request.requestId,
        sessionId: session.sessionId,
    }, "started");

    var mqtt_parts = [
        "iotdb",
        "homestar",
        "0",
        "81EA6324-418D-459C-A9C4-D430F30021C7",
        "alexa",
    ];
    var mqtt_prefix = mqtt_parts.join("/");

    session._mqtt_transporter = new Transport({
        prefix: mqtt_prefix,
    });

    logger.info({
        method: "HomeStar",
        mqtt_prefix: mqtt_prefix,
    }, "connected to MQTT");
};

/**
 */
HomeStar.prototype.eventHandlers.onLaunch = function (request, session, response) {
    logger.info({
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
        method: "eventHandlers.onSessionEnded",
        requestId: request.requestId,
        sessionId: session.sessionId,
    }, "called");
};

/**
 */
var _HomeStarFirstIntent = function (intent, session, response) {
    logger.info({
        method: "_HomeStarFirstIntent",
        slots: intent.slots,
        sessionId: session.sessionId,
    }, "called");

    var msg = {
        intent: "FirstIntent",
        thing: _.d.get(intent.slots, "/Thing/value", null),
        action: _.d.get(intent.slots, "/Action/value", null),
        zone: _.d.get(intent.slots, "/Zone/value", null),
    };

    session._mqtt_transporter.put({
        id: "FirstIntent",
        band: "command",
        value: msg,
    }, function(error, mqtt_ud) {
        if (error) {
            logger.error({
                method: "_HomeStarFirstIntent",
                sessionId: session.sessionId,
                error: _.error.message(error),
            }, "called");

            response.tellWithCard("Something went wrong", "Something went wrong", "Something went wrong");
        }
    
        response.tellWithCard("OK - Command Received", "Command Received", "OK");
    });
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
