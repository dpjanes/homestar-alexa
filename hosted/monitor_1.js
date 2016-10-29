/*
 *  hosted.js
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
    console.log(JSON.stringify(scrub(request.body), null, 2));
    response.send(JSON.stringify(require("./response.json")));
})
