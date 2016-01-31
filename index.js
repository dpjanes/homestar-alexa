/*
 *  index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-01-31
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

var alexa = require('./alexa');

exports.homestar = {
    /**
     *  Called before anything runs, usually never used
     */
    setup: function(locals) {
    },

    /**
     *  Called to modifiy the Express application
     */
    setup_app: function(locals, app) {
        /*
         e.g. changing settings
        _.d.set(locals.homestar.settings, "/webserver/require_login", true);
         */

        /*
         e.g. adding Express pages
        app.get("/some_page", locals.homestar.make_dynamic({
            alexa: path.join(__dirname, "dynamic/some_page.html"),
            customize: alexa.some_function,
            require_login: false,
        }));
         */
    },

    /**
     *  Called whenever webserver is up and running
     */
    on_ready: function(locals) {
    },

    /**
     *  Called when the profile is updated
     */
    on_profile: function(locals, profile) {
    },
}
