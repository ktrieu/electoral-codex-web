var mapboxStyleIds = {
    '2004' : 'mapbox://styles/kevintrieu/cjq93yzad9fpm2rocm2a27hqi',
    '2006' : 'mapbox://styles/kevintrieu/cjr5uwb8n1pkw2rrvlvycgm63',
    '2008' : 'mapbox://styles/kevintrieu/cjr6tpnba3s6f2smltonoqbtj',
    '2011' : 'mapbox://styles/kevintrieu/cjr6vtuuu27zb2sp58pwu3wwq',
    '2015' : 'mapbox://styles/kevintrieu/cjr75fljt5hy32ro0fqbht163'
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