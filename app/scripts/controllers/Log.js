'use strict';

angular.module('brewpiApp')
  .controller('LogCtrl', function ($scope, LogService) {
    var findBrew;

    $scope.options = {};
    $scope.options.temp = {
      pointDot: true,
      bezierCurve: false,
      scaleLabel: '<%=value%>°'
    };
    $scope.options.pwm = {
      pointDot: true,
      bezierCurve: false,
      scaleOverride: true,
      scaleStartValue: 0,
      scaleSteps: 10,
      scaleStepWidth: 10,
      scaleLabel: '<%=value%>%'
    };

    $scope.brews = [];
    $scope.brew = null;

    $scope.chart = {};

    // temp chart
    $scope.chart.temp = {
      labels: [],
      datasets: [
        {
          fillColor: 'rgba(37,190,223,0.1)',
          strokeColor: '#25bedf',
          pointColor: 'rgba(151,187,205,0)',
          pointStrokeColor: '#25bedf',
          data: []
        }
      ]
    };

    // pwm chart
    $scope.chart.pwm = {
      labels: [],
      datasets: [
        {
          fillColor: 'rgba(225,18,71,0.1)',
          strokeColor: '#da586d',
          pointColor: 'rgba(225,18,71,0)',
          pointStrokeColor: '#da586d',
          data: []
        }
      ]
    };

    // brews
    LogService.findBrews(function findBrews(brews) {
      $scope.brews = brews;

      if ($scope.brews[0]) {
        $scope.brew = $scope.brews[0];
      }
    });

    $scope.$watch('brew', function (brew) {
      if (brew) {
        findBrew();
      }
    });


    // find brew
    findBrew = function findBrew() {
      LogService.find({ brew: $scope.brew }, function find(response) {
        var i = 0,
          skip,
          dateLabel,
          min = {},
          max = {};

        skip = Math.floor(response.length / 18) + 1;

        // clear previous
        $scope.chart.temp.labels = [];
        $scope.chart.temp.datasets[0].data = [];

        $scope.chart.pwm.labels = [];
        $scope.chart.pwm.datasets[0].data = [];

        angular.forEach(response, function eachLog(log) {

          log.date = new Date(log.date);
          if (log.date < new Date('2013-12-25')) {
            log.add.temp = log.add.temp / 1000;
          }

          if (i % skip === 0) {
            dateLabel = log.date.getHours() + ':' + (log.date.getMinutes() < 10 ? '0' + log.date.getMinutes() : log.date.getMinutes());

            // max-min temp
            if (!min.temp || min.temp > log.add.temp) {
              min.temp = log.add.temp;
            }

            if (!max.temp || max.temp < log.add.temp) {
              max.temp = log.add.temp;
            }

            $scope.chart.temp.labels.push(dateLabel);
            $scope.chart.temp.datasets[0].data.push(log.add.temp);

            $scope.chart.pwm.labels.push(dateLabel);
            $scope.chart.pwm.datasets[0].data.push(log.add.pwm * 100);

          }

          i++;
        });

        $scope.options.temp.scaleOverride = false;

        if (max.temp === min.temp) {
          $scope.options.temp.scaleOverride = true;
          $scope.options.temp.scaleSteps = 7;
          $scope.options.temp.scaleStepWidth = 0.5;
          $scope.options.temp.scaleStartValue = max.temp - 2;
        }
      });
    };
  });

