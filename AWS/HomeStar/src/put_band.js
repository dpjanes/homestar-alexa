/**
 *  put_band.js
 *
 *  David Janes
 *  IOTDB
 *  2016-01-19
 */

var iotdb = require('iotdb');
var _ = iotdb._;

var logger = iotdb.logger({
    name: "IOTDBRedisTransportPut",
    module: "put_band",
});

exports.run = function(event, context) {
    event.what = "put_band";

    context.__redis_transporter.update({
        id: event.id,
        band: event.band,
        value: event.body,
    }, function(redis_ud) {
        if (redis_ud.error) {
            return context.done(redis_ud.error);
        }

        context.__mqtt_transporter.update({
            id: event.id,
            band: event.band,
            value: event.body,
        }, function(mqtt_ud) {
            if (mqtt_ud.error) {
                return context.done(mqtt_ud.error);
            }
        
            context.done(null, redis_ud);
        });
    });

};

