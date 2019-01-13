#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2)),
    Gamedig = require('..');

const debug = argv.debug;
delete argv.debug;
const pretty = !!argv.pretty || debug;
delete argv.pretty;

const options = {};
for(const key of Object.keys(argv)) {
    const value = argv[key];
    if(
        key === '_'
        || key.charAt(0) === '$'
    )
        continue;
    options[key] = value;
}

if (argv._.length >= 1) {
    const target = argv._[0];
    const split = target.split(':');
    options.host = split[0];
    if (split.length >= 2) {
        options.port = split[1];
    }
}
if (debug) {
    options.debug = true;
}

Gamedig.query(options)
    .then((state) => {
        if(pretty) {
            console.log(JSON.stringify(state,null,'  '));
        } else {
            console.log(JSON.stringify(state));
        }
    })
    .catch((error) => {
        if (debug) {
            if (error instanceof Error) {
                console.log(error.stack);
            } else {
                console.log(error);
            }
        } else {
            if (error instanceof Error) {
                error = error.message;
            }
            if (pretty) {
                console.log(JSON.stringify({error: error}, null, '  '));
            } else {
                console.log(JSON.stringify({error: error}));
            }
        }
    });
