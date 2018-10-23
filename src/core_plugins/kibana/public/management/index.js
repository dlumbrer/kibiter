import 'plugins/kibana/management/sections';
import 'plugins/kibana/management/styles/main.less';
import 'ui/filters/start_from';
import 'ui/field_editor';
import uiRoutes from 'ui/routes';
import { uiModules } from 'ui/modules';
import appTemplate from 'plugins/kibana/management/app.html';
import landingTemplate from 'plugins/kibana/management/landing.html';
import { management } from 'ui/management';
import { FeatureCatalogueRegistryProvider, FeatureCatalogueCategory } from 'ui/registry/feature_catalogue';
import 'ui/kbn_top_nav';

uiRoutes
  .when('/management', {
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
    /*controller: function(
      $route,
      $scope,
      $timeout,
      $window,
      AppState,
      Notifier,
      Private,
      Promise,
      config,
      courier,
      kbnUrl,
      timefilter) {
      var currentuser = JSON.parse(localStorage.getItem("sg_user"));
      console.log(currentuser)
      if (currentuser.username === "readall"){
        //$window.location.href
        window.location.replace(window.location.href.split("app/")[0] + "app/kibana#/dashboard/e312b5d0-b660-11e8-942d-addba25c8fca")
      }
      },*/
    template: landingTemplate
  });

uiRoutes
  .when('/management/:section', {
    redirectTo: '/management'
  });

require('ui/index_patterns/route_setup/load_default')({
  whenMissingRedirectTo: '/management/kibana/index'
});

uiModules
  .get('apps/management')
  .directive('kbnManagementApp', function (Private, $location, timefilter) {
    return {
      restrict: 'E',
      template: appTemplate,
      transclude: true,
      scope: {
        sectionName: '@section',
        omitPages: '@omitBreadcrumbPages',
        pageTitle: '='
      },

      link: function ($scope) {
        timefilter.enabled = false;
        $scope.sections = management.items.inOrder;
        $scope.section = management.getSection($scope.sectionName) || management;

        if ($scope.section) {
          $scope.section.items.forEach(item => {
            item.active = `#${$location.path()}`.indexOf(item.url) > -1;
          });
        }
      }
    };
  });

uiModules
  .get('apps/management')
  .directive('kbnManagementLanding', function (kbnVersion) {
    return {
      restrict: 'E',
      link: function ($scope) {
        $scope.sections = management.items.inOrder;
        $scope.kbnVersion = kbnVersion;
      }
    };
  });

FeatureCatalogueRegistryProvider.register(() => {
  return {
    id: 'management',
    title: 'Management',
    description: 'Your center console for managing the Elastic Stack.',
    icon: '/plugins/kibana/assets/app_management.svg',
    path: '/app/kibana#/management',
    showOnHomePage: false,
    category: FeatureCatalogueCategory.ADMIN
  };
});
