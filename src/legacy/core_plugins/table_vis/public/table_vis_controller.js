/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { uiModules } from 'ui/modules';
import { assign } from 'lodash';

// get the kibana/table_vis module, and make sure that it requires the "kibana" module if it
// didn't already
const module = uiModules.get('kibana/table_vis', ['kibana']);

// add a controller to tha module, which will transform the esResponse into a
// tabular format that we can pass to the table directive
module.controller('KbnTableVisController', function ($timeout, $scope) {
  const uiStateSort = ($scope.uiState) ? $scope.uiState.get('vis.params.sort') : {};
  assign($scope.vis.params.sort, uiStateSort);

  const defaultConfig = {
    searchKeyword: ''
  };
  $scope.config = ($scope.uiState) ? $scope.uiState.get('vis.params.config') || defaultConfig : defaultConfig;

  $scope.sort = $scope.vis.params.sort;
  $scope.$watchCollection('sort', function (newSort) {
    $scope.uiState.set('vis.params.sort', newSort);
  });

  $scope.resetSearch = function () {
    $scope.config.searchKeyword = '';
  };

  /**
   * Recreate the entire table when:
   * - the underlying data changes (esResponse)
   * - one of the view options changes (vis.params)
   */
  $scope.$watchMulti(['esResponse', 'config.searchKeyword'], function ([esResponse, inputSearch]) {
    $scope.renderAgain = false;

    let tableGroups = $scope.tableGroups = null;
    let hasSomeRows = $scope.hasSomeRows = null;

    if (esResponse) {
      // Copy the object
      tableGroups = angular.extend(esResponse);

      if (tableGroups.tables.length === 0) {
        $scope.hasSomeRows = false;
        return;
      }
      if (!inputSearch) {
        $scope.config.searchKeyword = inputSearch = '';
      }

      // Logic to search
      for (var k = 0; k < tableGroups.tables.length; k++) {
        var newrows = [];

        let tableRows;
        if (tableGroups.tables[k].rows) {
          tableRows = tableGroups.tables[k]
        } else {
          tableRows = tableGroups.tables[k].tables[0]
        }

        if (!tableRows.rows_default) {
          tableRows.rows_default = tableRows.rows;
        }

        for (var i = 0; i < tableRows.rows_default.length; i++) {
          for (var j = 0; j < tableRows.rows_default[i].length; j++) {
            const rowKey = tableRows.rows_default[i][j].key;

            // Polyfill for lodash@v4.x
            // @see https://github.com/lodash/lodash/blob/4.17.10/lodash.js#L11972
            const isRowKeyNil = rowKey == null;
            if (!isRowKeyNil) {
              const rowKeyStr = `${rowKey}`.toLowerCase();
              if (rowKeyStr.includes(inputSearch.toLowerCase())) {
                newrows.push(tableRows.rows_default[i]);
                break;
              }
            }
          }
        }
        tableRows.rows = newrows;
      }

      hasSomeRows = tableGroups.tables.some(function haveRows(table) {
        if (table.tables) return table.tables.some(haveRows);
        return table.rows.length > 0;
      });
    }

    $scope.hasSomeRows = hasSomeRows;
    if (hasSomeRows) {
      $scope.tableGroups = tableGroups;
      $timeout(function () {
        $scope.$apply();
        $scope.renderAgain = true;
      });
    }
    $scope.renderComplete();
  });

  $scope.$watch('config', function () {
    $scope.uiState.set('vis.params.config', $scope.config);
  }, true);
});

