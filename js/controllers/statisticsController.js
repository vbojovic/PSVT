app.controller('statisticsController', function ($scope,$log) {
    $scope.visible=true;
    $scope.$watchCollection('model', function(newValue, oldValue) {
        
    });
    $scope.model={};
//    $scope.model.scales = $scope.model.calc.getScaleList();
    $scope.model.switch=function(varName){
        $scope.model[varName] = ($scope.model[varName]==undefined || $scope.model[varName]==0 || $scope.model[varName]=='0') ? 1 : 0;
    };
    
    $scope.init=function(){
        
    };
  
});