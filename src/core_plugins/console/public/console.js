import uiRoutes from 'ui/routes';
import template from './index.html';

require('ace');
require('ui-bootstrap-custom');

require('ui/modules').get('kibana', ['sense.ui.bootstrap']);
require('ui/tooltip');
require('ui/autoload/styles');

require('./css/sense.less');
require('./src/controllers/sense_controller');
require('./src/directives/sense_history');
require('./src/directives/sense_settings');
require('./src/directives/sense_help');
require('./src/directives/sense_welcome');


uiRoutes.when('/dev_tools/console', {
  resolve: {
    isAuthenticatedUser: function () {
      var currentuser = JSON.parse(localStorage.getItem("sg_user"));
      console.log(currentuser)
      if (currentuser.username === "readall") {
        //$window.location.href
        window.location.replace(window.location.href.split("app/")[0] + "app/kibana#/dashboard/d1464900-c639-11e8-8b8c-73a3963ea1de")
      }
      return true
    }
  },
  controller: 'SenseController',
  template
});
