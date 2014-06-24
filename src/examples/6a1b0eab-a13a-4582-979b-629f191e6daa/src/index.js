angular.module('BuildJS', ['ng', 'ngRoute', 'ngAnimate'])
.config(function($locationProvider, $routeProvider){
  $routeProvider
    .when('/:id', {
      templateUrl: 'show.template',
      controller: 'ExampleCtrl',
      resolve: {
        example: function($route, ExampleData){
          var id = $route.current.params.id;
          return ExampleData[id];
        }
      }
    })
    .when('/', {
      templateUrl: 'list.template',
      controller: 'ExamplesCtrl'
    })
    .otherwise({ redirectTo: '/' });

  $locationProvider.html5Mode(true);
})
.controller('ExamplesCtrl', function($scope, ExampleData, $location){
  $scope.goHome = function(){
    $location.path('');
  };

  $scope.examples = [];
  for (var id in ExampleData){
    ExampleData[id].id = id;
    $scope.examples.push(ExampleData[id]);
  }
})
.controller('ExampleCtrl', function($scope, example){
  $scope.example = example;
  $scope.exampleFile = "/src/examples/"+example.id+"/gulpfile.js";
})
.filter('colorify', function(){
  var max = 256,
      min = max * 1/2,
      diff = max-min,
      bound = Math.pow(diff, 3);

  return function(str){
    var hash = 0, i, chr, len;
    if (str.length == 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
    }
    hash = (hash % bound + bound) % bound;
    var r = Math.floor(hash % diff + min),
        g = Math.floor((hash / diff) % diff + min),
        b = Math.floor((hash / diff / diff) % diff + min);
    return 'rgb('+r+','+g+','+b+');';
  };
});
