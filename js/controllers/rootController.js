app.controller("rootController", ["$scope", "$rootScope", "$http", "$window", '$timeout', function ($scope, $rootScope, $http, $window, $timeout) {
        $scope.itemsToHide = null;
        $scope.itemsToShow = null;
        $scope.enableRefresh = false;
        $scope.svcUrlBase = null;
        $rootScope.globals = {};

        $rootScope.setTitle = function (title) {
            $('title').text(title);
        };

        $rootScope.setServiceUrl = function (svcUrl) {
            $scope.svcUrlBase = svcUrl;
        };

        $rootScope.setGlobalVar = function (varName, value) {
            $rootScope.globals[varName] = value;
        };

        $rootScope.getGlobalVar = function (varName) {
            return ($rootScope.globals[varName] == undefined)
                    ? null
                    : $rootScope.globals[varName];
        };

        $rootScope.getServiceUrl = function () {
            return $scope.svcUrlBase;
        };

        $rootScope.autoCheck = function (name, expectedValue) {
//            angular.element(document).ready(function () {
//                $(document).ready(function () {
console.log([name, expectedValue]);
                $('input[name="' + name + '"]').each(function () {
                    $(this).parent().removeClass('checked');
//                    console.log([name, expectedValue]);
                    if ($(this).val() == expectedValue) {
                        $(this).parent().addClass('checked');
                    }
                });
if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
    $scope.$apply();
}                
//            });
        };

        $rootScope.init = function (showItemsStr, hideItemsStr, svcUrl) {
            console.log('uslo');
            if (hideItemsStr != undefined)
                $scope.itemsToHide = hideItemsStr.split(',');
            if (showItemsStr != undefined)
                $scope.itemsToShow = showItemsStr.split(',');

            var url = (svcUrl == undefined) ? "" : svcUrl;
            $rootScope.setServiceUrl(url);

//            $scope.hideAll();
            $scope.visibilityOfList(false);
//            $rootScope.$broadcast('unhideAudioUploadController');
            $scope.visibilityOfList(true);
            $scope.preventReload();
        };

        $rootScope.responseToObjOrNull = function (res) {
            try {
                return (JSON.parse(res));
            } catch (e) {
                console.log(res);
                return null;
            }
            return null;
        };

        $rootScope.autoResize = function (/*window*/componentClass) {
            angular.element(document).ready(function () {
                var resizeContainer = function () {
                    var variableHeight = $(componentClass).find(".variableHeight");
                    console.log("kolko divova: " + variableHeight.length);
                    var winHeight = $(window).height();
                    var bottom = $(componentClass).find(".afterVariableHeight").outerHeight();
                    $.each(variableHeight, function (i, el) {
                        var VHOffset = $(el).offset();
                        $(el).css("max-height", (winHeight - VHOffset.top - bottom));
                        console.log(["offset:", VHOffset.top, "visina prozora:", winHeight, "bottom:", bottom]);
                        console.log($(el).css("display"));
                    });
                    //console.log(["offset:", VHOffset.top, "visina prozora:", winHeight, "bottom:", bottom]);
                };
                angular.element(document).ready(resizeContainer);
                angular.element(window).resize(resizeContainer);
            });
        };

        $scope.preventReload = function () {
            if ($scope.enableRefresh)
                return;
            var windowElement = angular.element($window);
            windowElement.on('beforeunload', function (event) {
                event.preventDefault();
            });
            window.onbeforeunload = function (event) {
                if ($state.current.controller === 'ReloadWarningController') {
                    // Ask the user if he wants to reload
                    return 'Are you sure you want to reload?';
                } else {
                    // Allow reload without any alert
                    event.preventDefault();
                }
            };
        };
        /**
         * 
         * @param {type} scope
         * @param {type} url
         * @param {type} data
         * @param {type} varName
         * @param {type} apply
         * @returns {undefined}
         */
        $rootScope.getAndSetToVar = function (scope, url, data, varName, apply) {
            if (url == null)
                return;
            if (varName == null)
                return;
            scope[varName] = null;
            $.get(url, data, function (result) {
                try {
                    var obj = JSON.parse(result);
                    scope[varName] = obj;
                } catch (e) {
                    console.log(result);
                }

                if (!$.isFunction(apply) && apply) {
                    scope.$apply();
                } else if ($.isFunction(apply)) {
                    apply();
                }
            });
        };
        /**
         * 
         * @param {type} scope
         * @param {type} url
         * @param {type} data
         * @param {type} varName
         * @param {type} apply
         * @returns {undefined}
         */
        $rootScope.postAndSetToVar = function (scope, url, data, varName, apply) {
            if (url == null)
                return;
            if (varName == null)
                return;
            scope[varName] = null;
            $.post(url, data, function (result) {
                try {
                    var obj = JSON.parse(result);
                    scope[varName] = obj;
                } catch (e) {
                    console.log(result);
                }

//                if (apply) scope.$apply();
                if (!$.isFunction(apply) && apply) {
                    scope.$apply();
                } else if ($.isFunction(apply)) {
                    apply();
                }
            });
        };

        $rootScope.applyIfPossible = function (scope) {
            if (!scope.$$phase && !scope.$root.$$phase)
                scope.$apply();
        };

        $scope.visibilityOfList = function (toShow) {
            var list = (toShow) ? $scope.itemsToShow : $scope.itemsToHide;
            if (list == undefined || list == null || list.length == 0)
                return;
            var prefix = (toShow) ? 'show|unhide' : 'hide';
            prefix = prefix.split('|');
            for (var i = 0; i < list.length; i++) {
                var item = list[i].trim();
                var component = prefix[0] + item + 'Controller';
                $rootScope.$broadcast(component);
                console.log(component);
                if (prefix.length == 1)
                    continue;
                component = prefix[1] + item + 'Controller';
                $rootScope.$broadcast(component);
                console.log(component);
            }
        };


        $rootScope.hideAll = function () {
            $scope.visibilityOfList(false);
        };

    }]);
