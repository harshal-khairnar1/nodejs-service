const mysql = require('../lib/mysql');

const createNews = async (news) => {
    const statement = 'insert into news (title, description, tourId, matchId) values(?, ? , ?, ?)';
    const parameters = [news.title, news.description, news.tourId || null, news.matchId || null];
    return await mysql.query(statement, parameters);
}

const fetchNewsByMatchId = async (matchId) => {
    const statement = `select title, description 
            from news 
            where matchId = ?`;
    const parameters = [matchId];
    return await mysql.query(statement, parameters);
}

const fetchNewsByTourId = async (tourId) => {
    const statement = `select title, description 
            from news 
            where tourId = ? or
                  matchId IN (select id from matches where tourId = ?)`;
    const parameters = [tourId, tourId];
    return await mysql.query(statement, parameters);
}

const fetchNewsBySportId = async (sportId) => {
    const statement = `select title, description 
            from news 
            where tourId IN (select id from tours where sportId = ?) or 
                  matchId IN (select id from matches where tourId IN (select id from tours where sportId = ?))`;
    const parameters = [sportId, sportId];
    return await mysql.query(statement, parameters);
}

module.exports = {
    createNews,
    fetchNewsByMatchId,
    fetchNewsByTourId,
    fetchNewsBySportId
}