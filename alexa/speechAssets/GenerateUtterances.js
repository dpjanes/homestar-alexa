/*
 *  GenerateUtterances.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-09-29
 *
 *  Copyright [2013-2016] [David P. Janes]
 *
 *  Create Utterances
 */

var utterances = require("alexa-utterances")

/*
var dictionary = { adjustments: [ 'dim', 'brighten' ] };
var slots = { Adjustment: 'LITERAL' };
var template = '{adjustments|Adjustment} {the|} light';

var result = utterances(template, slots, dictionary, true);
console.log(result)
*/

const iotdb = require("iotdb");
const _ = iotdb._;

const slots = {
    Action: 'LITERAL',
    Thing: 'LITERAL',
    Zone: 'LITERAL',
    Query: 'LITERAL',
    Special: 'LITERAL',
    ActionSwitch: 'LITERAL',
    Band: 'LITERAL',
}
const dictionary = {
}

const scrub = ls => ls
    .map(s => s.replace(/^ */, 'HomeStarFirstIntent '))
    .map(s => s.replace(/ *$/, ''))
    .map(s => s.replace(/ +/g, ' '));

const results = _.flatten([
    [ "", "## Action on Thing" ],
    scrub(utterances("{to|} {-|Action} {the|} {-|Thing}", slots, dictionary, true)),
    [ "", "## Action on Everything" ],
    scrub(utterances("{to|} {-|Action} everything", slots, dictionary, true)),
    [ "", "## Action on Thing in Zone" ],
    scrub(utterances("{to|} {-|Action} {the|} {-|Thing} in the {-|Zone}", slots, dictionary, true)),
    [ "", "## Action on Zone Thing" ],
    scrub(utterances("{to|} {-|Action} {the|} {-|Zone} {-|Thing}", slots, dictionary, true)),
    [ "", "## Query" ],
    scrub(utterances("what is {the|} {-|Query}", slots, dictionary, true)),
    [ "", "## Query on Thing" ],
    scrub(utterances("what is {the|} {-|Query} of the {-|Thing}", slots, dictionary, true)),
    [ "", "## Query in Zone" ],
    scrub(utterances("what is {the|} {-|Query} in the {-|Zone}", slots, dictionary, true)),
    [ "", "## Query in Zone in Thing" ],
    scrub(utterances("what is {the|} {-|Query} of the {-|Thing} in the {-|Zone}", slots, dictionary, true)),
    scrub(utterances("what is {the|} {-|Query} in the {-|Zone} of the {-|Thing}", slots, dictionary, true)),
    [ "", "## special|Query in Zone" ],
    scrub(utterances("{-|ActionCommand} {things|all things|everything|} in the {-|Zone}", slots, dictionary, true)), 
    [ "", "## special|clear everything" ],
    scrub(utterances("{-|ActionCommand} {things|all things|everything}", slots, dictionary, true)),
    [ "", "## band" ],
    scrub(utterances("{-|ActionSwitch} to {-|Band}", slots, dictionary, true)),
    scrub(utterances("{-|ActionSwitch} to channel {-|Channel}", slots, dictionary, true)),
    scrub(utterances("{-|ActionSwitch} the {-|Thing} to {-|Band}", slots, dictionary, true)),
    scrub(utterances("{-|ActionSwitch} the {-|Thing} in {-|Zone} to {-|Band}", slots, dictionary, true)),
    scrub(utterances("{-|ActionSwitch} the {-|Zone} {-|Thing} to {-|Band}", slots, dictionary, true)),
    scrub(utterances("{-|ActionSwitch} the {-|Thing} to channel {-|Channel}", slots, dictionary, true)),
    scrub(utterances("{-|ActionSwitch} the {-|Zone} {-|Thing} to channel {-|Channel}", slots, dictionary, true)),
    scrub(utterances("{-|ActionSwitch} the {-|Thing} in {-|Zone} to channel {-|Channel}", slots, dictionary, true)),
])

results.filter(result => !result.match(/^#/)).map(result => console.log(result));


/*

ask homestar to: switch to HDMI1
ask homestar to: switch to TV
ask homestar to: switch to NetFlix
ask homestar to: switch to NetFlix
ask homestar to: switch to channel 13

ask homestar to: switch {Thing} to HDMI1
ask homestar to: switch {Thing} to TV
ask homestar to: switch {Thing} to NetFlix
ask homestar to: switch {Thing} to HDMI
ask homestar to: switch {Thing} to channel 13

ask homestar to: change the channel to 13
ask homestar to: change the channel to 13 on the {Thing}


HomeStarFirstIntent {Action} {Thing}
HomeStarFirstIntent {Action} the {Thing}
HomeStarFirstIntent to {Action} {Thing}
HomeStarFirstIntent to {Action} the {Thing}
HomeStarFirstIntent to {Action} all things
HomeStarFirstIntent to {Query} all things
HomeStarFirstIntent to {Action} everything
HomeStarFirstIntent to {Query} everything
HomeStarFirstIntent what is {Query}

HomeStarFirstIntent switch to {Mode}
HomeStarFirstIntent switch {Thing} to {Mode}
*/
