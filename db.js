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

module.exports.get_riding_data = async function(year, riding_num) {
    var db = await databases[year];
    var riding = {};
    riding.votes = {};
    var riding_summary = await db.get(`SELECT * FROM ridings WHERE riding_id == ${riding_num}`);
    Object.assign(riding, riding_summary);
    var vote_results = await db.all(`SELECT riding_candidates.result, candidates.name, candidates.party
                                FROM riding_candidates
                                INNER JOIN candidates ON candidates.cand_id == riding_candidates.cand_id
                                WHERE riding_candidates.riding_id == ${riding_num}
                                ORDER BY riding_candidates.result DESC`);
    var total_votes = 0;
    for (var i = 0; i < vote_results.length; i++) {
        total_votes += vote_results[i].result;
    }
    for (var i = 0; i < vote_results.length; i++) {
        vote_results[i].percent = vote_results[i].result / total_votes;
        console.log(vote_results[i]);
        riding.votes[vote_results[i].party] = vote_results[i];
    }
    //remove double hyphens in riding name
    riding.name = riding.name.replace(/--/g, '-');
    riding.total_votes = total_votes;
    //add the winner
    riding.winner = vote_results[0];
    return riding;
}   