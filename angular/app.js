angular.module('ngView', [], function ($routeProvider, $locationProvider) {
    
    $routeProvider
        .when('/', { templateUrl: "./views/default.html" })
        .when('/login', { templateUrl: "./views/login.html" })
        .when('/register', { templateUrl: "./views/register.html" })
        .otherwise({ redirectTo: "/login" });

    $locationProvider.html5Mode(false);
});

function MainCntl($scope, $route, $routeParams, $location, $window) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.back = function () {
        $window.history.back();
    }
}