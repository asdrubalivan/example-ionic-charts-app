;(function(){
    function createScan(personId, scanResult, lastScan) {
      var date = moment(lastScan, moment.ISO_8601);
      return {
        'Person_Id': personId,
        'Scan_Result': scanResult,
        'Last_Scan': date
      };
    }

    var scans = [
      createScan(1, 'VALID', '1901-01-01 00:00:00'),
      createScan(3, 'INVALID', '1901-01-02 00:00:00'),
      createScan(1, 'VALID', '1901-01-02 00:00:00'),
      createScan(4, 'VALID', '1901-01-05 00:00:00'),
      createScan(1, 'INVALID', '1901-01-01 00:00:00'),
      createScan(2, 'VALID', '1901-01-01 00:00:00'),
      createScan(3, 'INVALID', '1901-01-03 00:00:00'),
      createScan(5, 'VALID', '1901-01-03 00:00:00'),
      createScan(27, 'VALID', '1901-01-01 00:00:00'),
      createScan(41, 'VALID', '1901-01-05 00:00:00'),
    ];


    //LETS USE MOMENT
    console.log('Scans', scans);

    var processed = _(scans).
      filter({Scan_Result: 'VALID'}).
      uniqBy(function(val){
        return [
          val.Last_Scan.format("YYYY-MM-DD"),
          val.Person_Id
        ];
      }).
      countBy(function(val){
        return val.Last_Scan.format("YYYY-MM-DD")
      }).
      toPairs().
      map(function(val){
        return [new Date(val[0]), val[1]];
      }).
      sortBy(function(val){
        return val[0].getTime();
      }).
      value();

    console.log('Processed scans', processed);

    angular.module('charts',['nvd3'])
      .controller('myCtrl', function($scope){
        $scope.data = [{
          values: processed,
        }];
        $scope.options = {
                chart: {
                    type: 'lineChart',
                    height: 450,
                    margin : {
                        top: 20,
                        right: 20,
                        bottom: 60,
                        left: 100
                    },
                    x: function(d){ return d[0]; },
                    y: function(d){ return d[1]; },

                    color: d3.scale.category10().range(),
                    duration: 300,
                    useInteractiveGuideline: true,
                    clipVoronoi: true,
                    forceY: [0],
                    showLabels: true,
                    showLegend: false,

                    xAxis: {
                        axisLabel: 'Date',
                        tickFormat: function(d) {
                            return d3.time.format('%m/%d/%Y')(new Date(d))
                            //return d3.format(',.1%')(d);
                        },
                        showMaxMin: true,
                        staggerLabels: false
                    },

                    yAxis: {
                        axisLabel: 'Attendees',
                        tickFormat: function(d){ 
                          return d3.format('')(d);
                        },
                        axisLabelDistance: 20
                    }
                }
            };
      });
})();
