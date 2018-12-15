var path = require('path');
var fs = require('fs');

var MBTiles = require('@mapbox/mbtiles');
var zlib = require('zlib');
var Protobuf = require('pbf');
var vec_tile = require('@mapbox/vector-tile');

mbtiles_dir = {};

var MAPS_DIR = 'map_tiles'

load_mbtile = function(path, callback) {
    return new Promise(function(resolve, reject) {
        new MBTiles(`${MAPS_DIR}/${path}?mode=ro`, function(err, mbtiles) {
            if (err) {
                reject(path, err)
                return;
            }
            else {
                mbtiles_dir[path] = mbtiles;
                resolve();
                return;
            }
        });
    });
}

exports.load_all_mbtiles = async function() {
    var load_promises = [];
    fs.readdirSync('map_tiles').forEach(file => {
        load_promises.push(load_mbtile(file));
    });
    await Promise.all(load_promises).then().catch((path, err) => {
        console.log(`Error loading ${path}: ${err}`);
    });
}

exports.get_tile_as_JSON = function(file, zoom, x, y, callback) {
    var mbtiles = mbtiles_dir[file];
    mbtiles.getTile(zoom, x, y, (err, tile) => {
        if (err) {
            if (err === 'Error: Tile does not exist') {
                //empty tiles are clipped away, so just return an empty object
                //if the tile does not exist.
                callback({});
                return;
            }
            else {
                callback(err, undefined);
                return;
            }
        }
        zlib.gunzip(tile, (err, data) => {
            var decoded_tile = new vec_tile.VectorTile(new Protobuf(data));
            var layer = decoded_tile.layers[path.basename(file, '.mbtiles')];
            geo_json = {
                type : 'FeatureCollection',
                features : []
            };
            for (var i = 0; i < layer.length; i++) {
                geo_json.features.push(layer.feature(i).toGeoJSON(x, y, zoom));
            }
            callback(geo_json);
            return;
        })
    })
}