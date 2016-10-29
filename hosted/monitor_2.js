/*
 *  hosted_2.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-10-31
 *
 *  Copyright [2013-2016] [David P. Janes]
 */

"use strict";

const iotdb = require('iotdb');
const _ = iotdb._;

const express = require('express');
const body_parser = require('body-parser')
const path = require("path");
const url = require("url");

const app = express();

app.use(body_parser.json());
app.listen(22000, () => {
    console.log("+", "listening");
});

const scrub = o => _.d.transform(o, {
    value: (v, paramd) => {
        if ([ "userId", "accessToken", "applicationId" ].indexOf(paramd._key) > -1) {
            return "*******";
        } else {
            return v;
        }
    }
});

app.post("/request", (request, response) => {
    const action = _.d.get(request.body, "/request/intent/slots/Action/value", "");
    const thing = _.d.get(request.body, "/request/intent/slots/Thing/value", "");

    console.log("+", "action is:", action);
    console.log("+", "thing is:", thing);

    const reply = require("./response.json");
    _.d.set(reply, "/response/outputSpeech/text", `the action is "${ action }}" and the thing is "${ thing }"`);

    response.send(JSON.stringify(reply));
})
