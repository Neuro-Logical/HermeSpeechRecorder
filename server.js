const app = require('./app.js');
const port = process.env.PORT || 3000;

console.log("server.js");

app.listen(port, function() {
    console.log('Express listening on port', port);
})