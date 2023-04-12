'use strict';

function makeCommandWin(argv) {
    var command = 'dir ';
    if (typeof argv === 'undefined') {
        argv = {};
    }
    if (argv.isAbsolutePath !== true) {
        command += '.';
    }
    if (typeof argv.dir === 'string') {
        command += '/' + argv.dir;
    }
    if (typeof argv.name === 'string') {
        command += '/*.' + argv.name;
    }
    if (typeof argv.exclude === 'string') {
        console.log('exclude is not yet supported for windows');
    }
    command = command.replace(/\//g, '\\');
    command += ' /b/s';
    if (command.substring(0, 5) === 'dir \\') {
        //fix for C:\... cases
        command = command.substring(0, 4) + command.substring(5);
    }
    return command;
}

module.exports = makeCommandWin;
