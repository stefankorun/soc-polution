angular.module('sp.modules.components.maps.directives',[])
  .directive('spMaps', function($window){
    function link(scope, element, attrs){
      function setMapHeight(){
        var height = element.height();
        var width = element.width();
        element.find('.angular-google-map').height(height);
        element.find('.angular-google-map-container').height(height);
        element.find('#chartContainer').height(height);
      }

      setMapHeight();
      $window.onresize = function() {
        setMapHeight();
      };

      var chart = new CanvasJS.Chart("chartContainer",
        {
          title:{
            text: "POLLUTION GRAPH"
          },
          animationEnabled: true,
          axisY:{
            titleFontFamily: "arial",
            titleFontSize: 12,
            includeZero: false
          },
          toolTip: {
            shared: true
          },
          data: [
            {
              type: "spline",
              name: "US",
              showInLegend: true,
              dataPoints: [
                {label: "Atlanta 1996" , y: 44} ,
                {label:"Sydney 2000", y: 37} ,
                {label: "Athens 2004", y: 34} ,
                {label: "Beijing 2008", y: 36} ,
                {label: "London 2012", y: 46}
              ]
            },
            {
              type: "spline",
              name: "China",
              showInLegend: true,
              dataPoints: [
                {label: "Atlanta 1996" , y: 16} ,
                {label:"Sydney 2000", y: 28} ,
                {label: "Athens 2004", y: 32} ,
                {label: "Beijing 2008", y: 51} ,
                {label: "London 2012", y: 38}
              ]
            },
            {
              type: "spline",
              name: "Britain",
              showInLegend: true,
              dataPoints: [
                {label: "Atlanta 1996" , y: 1} ,
                {label:"Sydney 2000", y: 11} ,
                {label: "Athens 2004", y: 9} ,
                {label: "Beijing 2008", y: 19} ,
                {label: "London 2012", y: 29}
              ]
            },
            {
              type: "spline",
              name: "Russia",
              showInLegend: true,
              dataPoints: [
                {label: "Atlanta 1996" , y: 26} ,
                {label:"Sydney 2000", y: 32} ,
                {label: "Athens 2004", y: 28} ,
                {label: "Beijing 2008", y: 23} ,
                {label: "London 2012", y: 24}
              ]
            },
            {
              type: "spline",
              name: "S Korea",
              showInLegend: true,
              dataPoints: [
                {label: "Atlanta 1996" , y: 7} ,
                {label:"Sydney 2000", y: 8} ,
                {label: "Athens 2004", y: 9} ,
                {label: "Beijing 2008", y: 13} ,
                {label: "London 2012", y: 13}
              ]
            },
            {
              type: "spline",
              name: "Germany",
              showInLegend: true,
              dataPoints: [
                {label: "Atlanta 1996" , y: 20} ,
                {label:"Sydney 2000", y: 13} ,
                {label: "Athens 2004", y: 13} ,
                {label: "Beijing 2008", y: 16} ,
                {label: "London 2012", y: 11}
              ]
            }
          ],
          legend:{
            cursor:"pointer",
            itemclick:function(e){
              if(typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
              }
              else {
                e.dataSeries.visible = true;
              }
              chart.render();
            }
          }
        });

        chart.render();
    }

    return {
      scope: {
        measureData: '=?',
        center: '=?',
        isChart: '=?'
      },
      restrict: 'EA',
      link: link,
      controller: 'mapsController',
      templateUrl: 'app/modules/components/maps/maps.html'
    }

  });
