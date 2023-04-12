'use strict';

function makeCommandUnix(argv) {
    var command = 'find ';
    if (typeof argv === 'undefined') {
        argv = {};
    }
    if (argv.isAbsolutePath !== true) {
        command += '.';
    }
    if (typeof argv.dir === 'string') {
        command += '/' + argv.dir.replace(/ /g, '\\ ');
    }
    if (typeof argv.name === 'string') {
        command += ' -name "*.' + argv.name + '"';
    }
    if (typeof argv.exclude === 'string') {
        command += ' -not -path "./' + argv.exclude + '/*"';
    }
    return command;
}

module.exports = makeCommandUnix;
