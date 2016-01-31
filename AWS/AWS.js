/*
 *  AWS.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-01-30
 *
 *  This will receive commands from AWS IoT and execute them.
 *  See ../README-AWS.md for more setup info
 *
 *  Copyright [2013-2016] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

var iotdb = require('iotdb');
var _ = iotdb._;
var path = require('path')
var iotdb_commands = require('iotdb-commands');

iotdb_commands.load("./extensions");

var MQTTTransport = require('iotdb-transport-mqtt').Transport;
var IOTDBTransport = require('iotdb-transport-iotdb').Transport;

var cfgd = require('./AWS.json');
var mqttd = _.d.compose.shallow({
    allow_updated: true,
}, cfgd.mqttd, {
    ca: path.join(__dirname, "certs/rootCA.pem"),
    cert: path.join(__dirname, "certs/cert.pem"),
    key: path.join(__dirname, "certs/private.pem"),
});

/**
 *  This is the IR controller
 */
var ir_thing = iotdb.connect('ITachIR');
var extd = {
    "TV On": function() {
        ir_thing.set(":command", "sendir,1:1,1,38000,1,69,343,172,21,22,21,22,21,65,21,22,21,22,21,22,21,22,21,22,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,65,21,22,21,22,21,65,21,22,21,22,21,22,21,65,21,65,21,65,21,65,21,22,21,65,21,65,21,65,21,22,21,22,21,1673,343,86,21,3732");
    },
    "TV Off": function() {
        ir_thing.set(":command", "sendir,1:1,1,38000,1,69,343,172,21,22,21,22,21,65,21,22,21,22,21,22,21,22,21,22,21,65,21,65,21,22,21,65,21,65,21,65,21,65,21,65,21,65,21,22,21,65,21,22,21,22,21,22,21,65,21,65,21,22,21,65,21,22,21,65,21,65,21,65,21,22,21,22,21,1673,343,86,21,3732");
    },
}

/**
 *  You will have to change 
 */
var mqtt_transport = new MQTTTransport(mqttd);

mqtt_transport.updated({
    id: 'FirstIntent',
    band: 'command',
}, function(error, ud) {
    if (error) {
        console.log("#", error);
        return;
    }

    console.log("+", ud.value);

    iotdb_commands.match({
        transport: iotdb_transport,
        actiond: ud.value,
    }, function(error, matches) {
        var level = null;

        console.log("MATCH", matches.length);
        matches.map(function(match) {
            if (match.level === undefined) {
                logger.error({
                    cause: "we expect everything from iotdb_commands to have a level",
                }, "weird - no level");
                return;
            }

            if (level === null) {
                level = match.level;
            } else if (level !== match.level) {
                return;
            }

            console.log("MATCH", match);

            if (match.extension) {
                var ext = extd[match.extension.extension];
                if (ext) {
                    ext();
                } else {
                    logger.error({
                        match: match,
                    }, "extension not found");
                }
            } else if (match.id && match.ostate) {
                console.log("HERE:1");
                iotdb_transport.put({
                    id: match.id,
                    band: "ostate",
                    value: match.ostate,
                }, function(error, pd) {
                    console.log("HERE:2", error, pd);
                });
            }
            
        });
    });
});

var iotdb_transport = new IOTDBTransport({}, iotdb.connect());
