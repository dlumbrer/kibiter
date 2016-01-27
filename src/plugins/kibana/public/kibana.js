// autoloading
require('ui/autoload/all');

// preloading (for faster webpack builds)
require('plugins/kibana/discover/index');
require('plugins/kibana/visualize/index');
require('plugins/kibana/dashboard/index');
require('plugins/kibana/settings/index');
require('plugins/kibana/settings/sections');
require('plugins/kibana/doc');
require('ui/vislib');
require('ui/agg_response');
require('ui/agg_types');
require('ui/timepicker');
require('leaflet');

var moment = require('moment-timezone');
var chrome = require('ui/chrome');
var routes = require('ui/routes');
var modules = require('ui/modules');
var Scanner = require('ui/utils/scanner');
var _ = require('lodash');


var kibanaLogoUrl = require('ui/images/bitergia.png');

function setTabs(metadashboards) {
  var tabs = [];
  _.each(metadashboards, function (title, dash) {
    tabs.push({id:'dashboard/' + title, title: dash});
  });
  chrome.setTabs(tabs);
}

routes.enable();

routes
.otherwise({
  redirectTo: `/${chrome.getInjected('kbnDefaultAppId', 'discover')}`
});

chrome
.setBrand({
  'logo': 'url(' + kibanaLogoUrl + ') left no-repeat',
  'smallLogo': 'url(' + kibanaLogoUrl + ') left no-repeat'
})
.setNavBackground('#333333')
.setTabDefaults({
  resetWhenActive: true,
  lastUrlStore: window.sessionStore,
  activeIndicatorColor: '#C43422;'
})
.setRootController('kibana', function ($scope, $rootScope, courier, config, es, kbnIndex) {
  function setDefaultTimezone() {
    moment.tz.setDefault(config.get('dateFormat:tz'));
  }

  function getMetaDashboards() {
    var queryString = '';
    var pageSize = 1000;

    var scanner = new Scanner(es, {
      index: kbnIndex,
      type: 'metadashboard'
    });

    return scanner.scanAndMap(queryString, {
      pageSize,
      docCount: Infinity
    }, function (hit) {return hit;});
  }

  getMetaDashboards().then(function (results) {
    setTabs(results.hits[0]._source);
  });

  // wait for the application to finish loading
  $scope.$on('application.load', function () {
    courier.start();
  });

  $scope.$on('init:config', setDefaultTimezone);
  $scope.$on('change:config.dateFormat:tz', setDefaultTimezone);
});
