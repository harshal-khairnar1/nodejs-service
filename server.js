const {makeApp} = require('./index');
const config = require("./config/config");
const port = config.server.port;

const app = makeApp();

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
