angular.module('BuildJS', ['ng', 'ngRoute', 'ngAnimate'])
.config(function($locationProvider, $routeProvider){
  $routeProvider
    .when('/:id', {
      templateUrl: 'show.template',
      controller: 'ExampleCtrl',
      resolve: {
        example: function($route, $http){
          var id = $route.current.params.id,
              packageJson;
          return $http.get('/src/examples/'+id+'/package.json').then(function(response){
            packageJson = angular.fromJson(response.data);
            return $http.get('/src/examples/'+id+'/'+packageJson.main);
          }).then(function(response){
            return {
              id: id,
              package: packageJson,
              file: response.data
            };
          });
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
  $scope.terms = [];
  for (var i=0, example; example = ExampleData[i]; i++){
    $scope.examples.push(example);
    for (var j=0, term; term=example.terms[j]; j++){
      if ($scope.terms.indexOf(term) === -1)
        $scope.terms.push(term);
    }
  }
})
.controller('ExampleCtrl', function($scope, example){
  $scope.example = example;
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
