angular.module('BuildJS', ['ng'])
.controller('ExamplesCtrl', function($scope, ExampleData){
  $scope.examples = [];
  for (var id in ExampleData){
    $scope.examples.push(ExampleData[id]);
  }
})
.filter('hexify', function(){
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
