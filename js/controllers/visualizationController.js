app.controller('visualizationController', function ($scope,$log,$rootScope,$route ) {
    $scope.visible=true;
    $scope.$watchCollection('model', function(newValue, oldValue) {
      $scope.model.methodTitle = $scope.model.calc.methods[$scope.model.method]; 
      $rootScope.applyIfPossible($scope);
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
    $scope.model.data = [];
    $scope.model.switch=function(varName){
        $scope.model[varName] = ($scope.model[varName]==undefined || $scope.model[varName]==0 || $scope.model[varName]=='0') ? 1 : 0;
    };
$scope.$on('$locationChangeStart', function(event) {
    $scope.$apply();
});

    $scope.init=function(){
        $scope.model.strucType='twist';
        console.log('initovano');
//        $route.reload();
//        $(document).ready(function(){
//        $rootScope.autoCheck("rbScaleName",$scope.model.scaleName);
//        $rootScope.autoCheck("method",$scope.model.method);
//        $rootScope.autoCheck("strucType",$scope.model.strucType);   
//            $scope.$apply();
//             console.log('1');
////        });
//
//        angular.element(document).ready(function () {
//            $rootScope.autoCheck("rbScaleName",$scope.model.scaleName);
//            $rootScope.autoCheck("method",$scope.model.method);
//            $rootScope.autoCheck("strucType",$scope.model.strucType);
//            console.log('2');
//        });        
//        console.log('3');
//        autoCheck()
    };
    $scope.viewNumericOutput=function(){
        $('#numericOutputModal').on('shown.bs.modal', function () {
            $('#myInput').trigger('focus');
            $scope.model.calc.printTable($scope.model.calc.getData(),true);
            $scope.model.data = $scope.model.calc.getData();
          });
    };
    $scope.export=function(){
        $scope.model.calc.exportToImage();
    };
//    $scope.$watch('model', function(oldVal,newVal) {
//        console.log(newVal);
//    });

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
    
        
//    $(document).ready(function (){
    angular.element(document).ready(function () {
        $rootScope.autoCheck("rbScaleName",$scope.model.scaleName);
        $rootScope.autoCheck("method",$scope.model.method);
        $rootScope.autoCheck("strucType",$scope.model.strucType);
    });

//    $scope.$digest();
});
//}]);