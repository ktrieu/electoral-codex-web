party_nouns = {
    'LIB': 'Liberal Party',
    'CON': 'Conservative Party',
    'NDP': 'NDP',
    'BQ': 'Bloc Québecois',
    'GRN': 'Green Party',
    'OTH': 'Others'
}

module.exports.party_to_noun = function(party) {
    return party_nouns[party]
}

module.exports.majority_seats = function(total_seats) {
    if (total_seats % 2 == 0) {
        return (total_seats / 2) + 1;
    }
    else {
        return Math.ceil(total_seats / 2);
    }
}

module.exports.percent = function(percent) {
    return `${(percent * 100).toFixed(2)}%`;
}