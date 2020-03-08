angular.module('ngView', [], function ($routeProvider, $locationProvider) {


    $routeProvider.when('/', { template: "This is Root" });
    $routeProvider.when('/login', { template: "This is Login" });
    $routeProvider.when('/register', { template: "This is Register" });
    $routeProvider.otherwise({
        redirectTo: "/"
    });

    $locationProvider.html5Mode(false);
});

function MainCntl($scope, $route, $routeParams, $location, $window) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    $scope.back = function () {
        $window.history.back();
    }

    $location.hash('');
}