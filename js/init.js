var app = angular.module('myApp', ["ngRoute"]);

//app.controller('methodController', ["$scope", function ($scope) {

//var autoCheck=function(name,expectedValue){
//    $('input[name="'+name+'"]').each(function(){
//        $(this).parent().removeClass('checked'); 
//        if ($(this).val()==expectedValue){
//            $(this).parent().addClass('checked'); 
//        }
//    });
//};
app.run(function($rootScope, $templateCache) {
   $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
   });
});

app.config(function($routeProvider,$locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "routes/home.html"
    })
    .when("/visualization", {
         templateUrl : "routes/visualization.html"+'?'+Math.floor((Math.random()*6)+1)
        , controller : "visualizationController"
        ,cache: false
//        ,resolve: {
//            // I will cause a 1 second delay
//            delay: function($q, $timeout) {
//              var delay = $q.defer();
//              $timeout(delay.resolve, 1000);
//              return delay.promise;
//            }
//          }
    })
    .when("/analysis", {
         templateUrl : "routes/analysis.html"+'?'+Math.floor((Math.random()*6)+1)
        , controller : "analysisController"
        ,cache: false
    })
    .when("/statistics", {
         templateUrl : "routes/statistics.html"+'?'+Math.floor((Math.random()*6)+1)
        , controller : "statisticsController"
        ,cache: false
    })
    .otherwise({
      redirectTo: 'routes/home.html',
//                      controller: 'WGHomeLanCtrl'
    });
                
//    $locationProvider.html5Mode(true);
});