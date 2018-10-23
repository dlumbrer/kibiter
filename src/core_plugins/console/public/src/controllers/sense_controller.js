import 'ui/doc_title';
import { useResizeCheckerProvider } from '../sense_editor_resize';
import $ from 'jquery';
import { initializeInput } from '../input';
import { initializeOutput } from '../output';
import init from '../app';
import { SenseTopNavController } from './sense_top_nav_controller';

const module = require('ui/modules').get('app/sense');

module.run(function (Private, $rootScope) {
  const useResizeChecker = Private(useResizeCheckerProvider);

  module.setupResizeCheckerForRootEditors = ($el, ...editors) => {
    return useResizeChecker($rootScope, $el, ...editors);
  };
});

module.controller('SenseController', function SenseController(Private, $scope, $timeout, $location, docTitle, kbnUiAceKeyboardModeService) {
  /* var currentuser = JSON.parse(localStorage.getItem("sg_user"));
  console.log(currentuser)
  if (currentuser.username === "readall") {
    //$window.location.href
    window.location.replace(window.location.href.split("app/")[0] + "app/kibana#/dashboard/e312b5d0-b660-11e8-942d-addba25c8fca")
  } */
  docTitle.change('Console');

  $scope.topNavController = Private(SenseTopNavController);

  // We need to wait for these elements to be rendered before we can select them with jQuery
  // and then initialize this app
  let input, output;
  $timeout(() => {
    output = initializeOutput($('#output'));
    input = initializeInput($('#editor'), $('#editor_actions'), $('#copy_as_curl'), output);
    init(input, output, $location.search().load_from);
    kbnUiAceKeyboardModeService.initialize($scope, $('#editor'));
  });

  $scope.sendSelected = () => {
    input.focus();
    input.sendCurrentRequestToES();
    return false;
  };

  $scope.autoIndent = (event) => {
    input.autoIndent();
    event.preventDefault();
    input.focus();
  };
});
