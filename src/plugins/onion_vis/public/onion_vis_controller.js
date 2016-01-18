define(function (require) {

  var module = require('ui/modules').get('kibana/Onion_vis', ['kibana']);
  module.controller('KbnOnionVisController', function ($scope, $sce, Private) {
    $scope.$watch('vis.params.Onion', function (html) {
      if (!html) return;
      $scope.html = $sce.trustAsHtml(html);
    });

    var tabifyAggResponse = Private(require('ui/agg_response/tabify/tabify'));

    function buildOnion(people) {
      var core = $scope.core = [];
      var regular = $scope.regular = [];
      var casual = $scope.casual = [];
      var totalCore = $scope.total * 0.8;
      var totalRegular = $scope.total * 0.95;
      var totalCovered = 0;
      // Time to compute core, regular and casual
      $scope.people.forEach(function (person) {
        totalCovered += person.value;
        if (totalCovered <= totalCore) {
          core.push(person.name);
        }
        else if (totalCovered <= totalRegular) {
          regular.push(person.name);
        }
        else {
          casual.push(person.name);
        }
      });
    }

    $scope.processTableGroups = function (tableGroups) {
      var table = tableGroups.tables[0];
      if (table.columns.length === 1) {
        // The onion agg field is not defined yet. Total count received.
        return;
      }
      $scope.total = 0;
      $scope.people = [];
      table.rows.forEach(function (row) {
        $scope.people.push({'name':row[0],'value':row[1]});
        $scope.total += row[1];
      });
    };

    $scope.$watch('esResponse', function (resp) {
      if (resp) {
        $scope.processTableGroups(tabifyAggResponse($scope.vis, resp));
        buildOnion();
      }
    });
  });
});
