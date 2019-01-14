var sqlite = require('sqlite')

databases = {
    '2004': sqlite.open('db/2004.db'),
    '2006': sqlite.open('db/2006.db'),
    '2008': sqlite.open('db/2008.db'),
    '2011': sqlite.open('db/2011.db'),
    '2015': sqlite.open('db/2015.db') 
};

module.exports.get_summary_data = async function(year) {
    var db = await databases[year];
    var result = {};
    var summary_rows = await db.all('SELECT * FROM summary ORDER BY seats DESC');
    result.total = {
        seats: summary_rows[0].seats,
        votes: summary_rows[0].votes
    };
    result.winner = {
        party: summary_rows[1].party,
        seats: summary_rows[1].seats,
        votes: summary_rows[1].votes,
        leader: summary_rows[1].leader
    }
    result.parties = {};
    for (var i = 0; i < summary_rows.length; i++) {
        var row = summary_rows[i];
        result.parties[row.party] = {
            seats: row.seats,
            votes: row.votes,
            leader: row.leader
        }
    }
    return result;
}