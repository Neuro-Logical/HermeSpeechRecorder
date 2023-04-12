'use strict';

var exec = require('child_process').exec;
var isWindows = process.platform === 'win32';
var commandMaker = isWindows
    ? require('./make-command-win')
    : require('./make-command-unix');

function fixResult (results, dir) {
    return results.map(function (path) {
        var index = path.indexOf(dir);
        return '.\\' + path.substr(index);
    });
}

module.exports = function (callback, argv) {
    var command = commandMaker(argv);

    exec(command,
        function(error, stdout, stderr) {
            var results = stdout.split('\n').filter(function(str) {
                return str !== '';
            });
            if (error !== null) {
                callback({
                    error: stderr
                });
                return;
            }
            if (!argv.isAbsolutePath && isWindows) {
                results = fixResult(results, argv.dir)
            }
            callback(results);
        });
};
