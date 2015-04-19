angular.module('sp.modules.components.maps.controllers', [])
  .controller('mapsController', function ($scope, uiGmapGoogleMapApi, mapsService, $timeout) {

    $scope.map = {
      center: {latitude: 51.219053, longitude: 4.404418 },
      zoom: 14,
      events: {
        bounds_changed: function (maps, event, arguments) {
          var bounds = maps.getBounds();
          var data = {lat1: bounds.Ea.k, lat2:bounds.Ea.j, long1: bounds.va.k , long2: bounds.va.j};
          debounceStations(data);
        }
      }
    };

    $scope.stations = [];
    $scope.options = {scrollwheel: true};

    Object.defineProperty($scope, 'center', {
      get: function () {
        return $scope.c;
      },
      set: function (val) {
        $scope.map.center = val;
        $scope.c = val;
      }
    });

    function setStations(data){
      //$scope.stations = [];
      mapsService.getAnalysis(data)
        .then(function (result) {
          var newList = [];
          for(var i = 0; i < result.length; i++){
            var item = {
              id: result[i]._id,
              radius: result[i].qos*10,
              center: {
                latitude: result[i].lat,
                longitude: result[i].lon
              },
              stroke: {
                color: '#08B21F',
                weight: 2,
                opacity: 1
              },
              fill: {
                color: '#08B21F',
                opacity: 0.5
              }
            };
            newList.push(item);

          }

          $scope.stations = newList;



        }, function (error) {
          console.log(error);
        });
    }

    var debounceStations = _.debounce(setStations, 500);
    uiGmapGoogleMapApi.then(function(maps) {
      $scope.getMyLocation();
    });

    $scope.getMyLocation = function () {
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function (position) {
          $scope.center = {latitude: position.coords.latitude, longitude: position.coords.longitude};
          $scope.$apply();
        }, function (error) {
           console.log(error);
        });
      }
    };

  });
