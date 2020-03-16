var app = angular.module('mKicksStarter', [], function ($routeProvider, $locationProvider) {

    const loggedIn = function ($location) {
        const authToken = localStorage.getItem('kfm_');
        if (!authToken)
            $location.url('/login');
    }

    $routeProvider
        .when('/', { templateUrl: "./views/default.html", controller: "DefController" })
        .when('/login', { templateUrl: "./views/login.html", controller: "LoginController" })
        .when('/register', { templateUrl: "./views/register.html", controller: "RegisterController" })
        .when('/scripts', { templateUrl: './views/scripts.html', controller: "ScriptController", resolve: { loggedIn } })
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

const goTo = ($location, url) => {
    $location.url(url);
}

app.controller('DefController', function ($scope, $location) {

    $scope.init = function () {
        window.drawNavigation();
    }

    $scope.goToLogin = function () { goTo($location, '/login') }
    $scope.goToRegister = function () { goTo($location, '/register') }

});

app.controller('LoginController', function ($scope, $location) {

    $scope.init = function () {
        localStorage.removeItem('kfm_');
        localStorage.removeItem('kfmC_');
        window.drawNavigation();
    }

    $scope.goToRegister = function () { goTo($location, '/register') }

    $scope.form = {
        email: "",
        password: ""
    }

    $scope.login = async function () {
        window.event.preventDefault();
        const response = await services.login($scope.form);
        if (response.ok) {
            localStorage.setItem('kfm_', response.result);
            localStorage.setItem('kfmC_', response.is_company || false);
            localStorage.setItem('kfmDN_', response.display_name || "/");
            window.location = '#/scripts';
        } else {
            swal(response.result);
        }
    }

});
app.controller('RegisterController', function ($scope, $location) {

    $scope.init = function () {
        window.drawNavigation();
    }

    $scope.goToLogin = function () { goTo($location, '/login') }

    $scope.form = {
        display_name: "",
        email: "",
        password: "",
        is_company: false
    }

    $scope.register = async function () {
        window.event.preventDefault();
        const response = await services.register($scope.form);
        swal(response.result).then(() => {
            if (response.ok) {
                window.location.reload();
            }
        });
    }

});

app.controller('ScriptController', function ($scope, $location) {

    $scope.init = function () {
        window.drawNavigation();
    }

    $scope.scripts = [{
        img: '',
        title: "Secret agent Tončka",
        content: 'ful fajn stvar',
    }, {
        img: '',
        title: "Noč v štali",
        content: 'nč kj vlk',
    }]
});
