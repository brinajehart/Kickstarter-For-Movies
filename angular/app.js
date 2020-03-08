var app = angular.module('ngView', [], function ($routeProvider, $locationProvider) {


    $routeProvider
        .when('/', { templateUrl: "./views/default.html", controller: "DefController" })
        .when('/login', { templateUrl: "./views/login.html", controller: "LoginController" })
        .when('/register', { templateUrl: "./views/register.html", controller: "RegisterController" })
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

app.controller('DefController', function ($scope) {
    $scope.name = 'def';
});
app.controller('LoginController', function ($scope) {
    $scope.name = 'login';
});
app.controller('RegisterController', function ($scope) {
    $scope.name = 'register';
});