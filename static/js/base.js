var mapboxStyleIds = {
    '2004' : 'mapbox://styles/kevintrieu/cjq93yzad9fpm2rocm2a27hqi'
}

var partyFullNames = {
    'LIB' : 'Liberal',
    'CON' : 'Conservative',
    'NDP' : 'NDP',
    'GRN' : 'Green',
    'BQ' : 'Bloc Québecois',
    'OTH' : 'Other'
}

getPartyFullName = function(partyCode) {
    return partyFullNames[partyCode];
}