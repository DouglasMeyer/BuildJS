angular.module('BuildJS', ['ng'])
.controller('ExamplesCtrl', function($scope, ExampleData){
  $scope.examples = ExampleData;
});
