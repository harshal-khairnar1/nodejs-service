const express = require('express');
const helper = require("./src/lib/helper");
const app = express();


function makeApp() {
    app.use(express.json());

//Register routes
    helper
        .fileList('./src/routes')
        .forEach(filePath => require(`./${filePath.toString()}`)(app));


    app.use((err, req, res, next) => {
        res.status(500).json({error: err.message});
    })

    return app;
}

module.exports = {
    makeApp
}