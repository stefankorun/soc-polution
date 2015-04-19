/* MONGO DEFINES */
var mngSchema = new mongoose.Schema({
    Id: {type: String, unique: true},
    name: String,
    analysis: [{
        timestamp: {type: Date, default: Date.now},
        lat: {type: Number, default: randomLat},
        lon: {type: Number, default: randomLon},
        qos: {type: Number, default: 20},
        sensors: {
            humidity: {type: Number, default: randomHumidity},
            nitrogen: {type: Number, default: randomNitrogen},
            temperature: {type: Number, default: randomTemp}
        }
    }]
});
mngSchema.methods.speak = function () {
    console.log(this);
};
var mngModel = mongoose.model('Station', mngSchema);
//mngModel.remove({}, function(err) {
//    console.log('CLean Station collection data', err);
//});

/* EXPORTS */
exports.init = function (data, saveFlag) {
    //var model = _.clone(new mngModel(data));
    var model = new mngModel(data);
    if (saveFlag) model.save();

    return model;
};

exports.query = {
    all: function (props) {
        var deferred = Q.defer();
        mngModel.find({}, props, function (err, data) {
            if (err) deferred.reject();
            deferred.resolve(data);
        });
        return deferred.promise;
    },
    analysis: function (params) {
        var deferred = Q.defer();
        var analysisArray = [];
        var mongoQuery = generateAnalysisQuery(params);
        mngModel.find(mongoQuery, 'analysis', function (err, data) {
            if (err) deferred.reject(err);
            _.each(data, function (station) {
                _.each(station.analysis, function (reading) {
                    analysisArray.push(reading);
                })
            });
            analysisArray = _.sortBy(analysisArray, 'timestamp');
            deferred.resolve(analysisArray);
        });
        return deferred.promise;
    }
};

/* MODEL ROUTES */
express.get('/station', function (req, res) {
    exports.query.all().then(function (data) {
        res.send(data);
    })
});
express.get('/station/analysis', function (req, res) {
    exports.query.analysis(req.query).then(function (data) {
        res.send(data);
    })
});

/* HELPERS */
function randomLat() {
    return _.random(41.102496, 41.132758);
}
function randomLon() {
    return _.random(20.767044, 20.831245);
}
function randomHumidity() {
    return _.random(20, 60);
}
function randomNitrogen() {
    return _.random(150, 400);
}
function randomTemp() {
    return _.random(150, 400);
}
function generateAnalysisQuery(params) {
    var query = {};
    if (!params) return query;

    if (params.lat1 && params.lat2) {
        query['analysis.lat'] = {$gt: params.lat1, $lt: params.lat2};
    }
    if (params.lon1 && params.lon2) {
        query['analysis.lon'] = {$gt: params.lon1, $lt: params.lon2};
    }
    if (params.date) {
        var date = new Date(params.date);
        query['analysis.timestamp'] = {$gt: date, $lt: (new Date()).setDate(date.getDate() + 1)};
    }
    return query;
}
