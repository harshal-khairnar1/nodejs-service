const News = require('../controllers/news');

module.exports = function (app) {
    app.route('/news').put(async (req, res, next) => {
        try {
            const {title, description, tourId = '', matchId = ''} = req.body;

            await News.createNews({title, description, tourId, matchId});

            return res.json({message: "success"});
        } catch (err) {
            return next(err);
        }
    });

    app.route('/news/match/:matchId').get(async (req, res, next) => {
        try {
            const {matchId} = req.params;
            return res.json(await News.fetchNewsByMatchId(matchId));
        } catch (err) {
            return next(err);
        }
    });

    app.route('/news/tour/:tourId').get(async (req, res, next) => {
        try {
            const {tourId} = req.params;
            return res.json(await News.fetchNewsByTourId(tourId));
        } catch (err) {
            return next(err);
        }
    });

    app.route('/news/sport/:sportId').get(async (req, res, next) => {
        try {
            const {sportId} = req.params;
            return res.json(await News.fetchNewsBySportId(sportId));
        } catch (err) {
            return next(err);
        }
    });

}