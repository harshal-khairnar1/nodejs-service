const News = require('../models/news');

const createNews = async (data) => {
    const {title, description, tourId = '', matchId = ''} = data;

    if (!matchId && !tourId) {
        throw new Error("each news should either have match id or tour id or both");
    }

    const news = {title, description};
    if (tourId) news.tourId = tourId;
    if (matchId) news.matchId = matchId;

    return await News.createNews(news);
}

const fetchNewsByMatchId = async (matchId) => {
    return await News.fetchNewsByMatchId(matchId);
}

const fetchNewsByTourId = async (tourId) => {
    return await News.fetchNewsByTourId(tourId);
}

const fetchNewsBySportId = async (sportId) => {
    return await News.fetchNewsBySportId(sportId);
}

module.exports = {
    createNews,
    fetchNewsByMatchId,
    fetchNewsByTourId,
    fetchNewsBySportId
}