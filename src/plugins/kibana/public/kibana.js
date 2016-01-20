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

var kibanaLogoUrl = require('ui/images/open-stack-cloud-computing-logo.png');

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
.setNavBackground('#FFFFFF')
.setTabDefaults({
  resetWhenActive: true,
  lastUrlStore: window.sessionStore,
  activeIndicatorColor: '#C43422;'
})
.setTabs([
  {
    id: 'git',
    title: 'Git'
  },
  {
    id: 'gerrit',
    title: 'Gerrit'
  }
])
.setRootController('kibana', function ($scope, $rootScope, courier, config) {
  function setDefaultTimezone() {
    moment.tz.setDefault(config.get('dateFormat:tz'));
  }

  // wait for the application to finish loading
  $scope.$on('application.load', function () {
    courier.start();
  });

  $scope.$on('init:config', setDefaultTimezone);
  $scope.$on('change:config.dateFormat:tz', setDefaultTimezone);
});
