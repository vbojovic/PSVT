var app = angular.module('myApp', []);

//app.controller('methodController', ["$scope", function ($scope) {

var autoCheck=function(name,expectedValue){
    $('input[name="'+name+'"]').each(function(){
      $(this).parent().removeClass('checked'); 
      if ($(this).val()==expectedValue){
        $(this).parent().addClass('checked'); 
      }
    });
};
app.controller('methodController', function ($scope,$log) {
    $scope.$watchCollection('model', function(newValue, oldValue) {
      $scope.model.methodTitle = $scope.model.calc.methods[$scope.model.method]; 
    });
    $scope.model={};
    $scope.model.methodTitle = 'Helical wheel';
    $scope.model.method = 'helicalWheel';
    $scope.model.scaleName = 'KyDo';
    $scope.model.strucType='twist';
    $scope.model.calc = new Calc('#aminoDisplay', '#outputTable');
    $scope.model.scales = $scope.model.calc.getScaleList();
    $scope.model.structures = $scope.model.calc.getStructureList();
    $scope.model.seq = "";
    $scope.model.defaultColoring=1;
    $scope.model.useAACodes=1;
    $scope.model.switch=function(varName){
        $scope.model[varName] = ($scope.model[varName]==undefined || $scope.model[varName]==0 || $scope.model[varName]=='0') ? 1 : 0;
    };

     
 
    //TODO set resolution
    
    $scope.model.draw=function(){
        if ($scope.model.seq == undefined || $scope.model.seq == '') {
            new PNotify({
                title: 'Error',
                text: 'Please inseert your sequence!',
                type: 'error'
            });
            return;
        }
//        console.log($scope.model.calc);
        $scope.model.calc.init(
            $scope.model.seq
            , Scales
            , $scope.model.scaleName
            , $scope.model.strucType
            , $scope.model.method
            , !$scope.model.useAACodes
            , 15
            , $scope.model.defaultColoring
        );

        $scope.model.calc.draw();
        
    };
    
        
    $(document).ready(function (){
        autoCheck("rbScaleName",$scope.model.scaleName);
        autoCheck("method",$scope.model.method);
    });

//    $scope.$digest();
});
//}]);