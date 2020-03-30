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
        .when('/profile/:id', { templateUrl: "./views/profile.html", controller: "ProfileController", resolve: { loggedIn } })
        .when('/edit/profile', { templateUrl: "./views/editprofile.html", controller: "EditPController", resolve: { loggedIn } })
        .when('/scripts', { templateUrl: './views/scripts.html', controller: "ScriptController", resolve: { loggedIn } })
        .when('/create/script', { templateUrl: './views/scriptform.html', controller: "ScriptCreateController", resolve: { loggedIn }})
        .when('/update/script/:id', { templateUrl: './views/scriptform.html', controller: "ScriptUpdateController", resolve: { loggedIn }})
        .otherwise({ redirectTo: "/" });

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
        localStorage.removeItem('kfmDN_');
        localStorage.removeItem('kfmID_');
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
            localStorage.setItem('kfmID_', response.id);
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


app.controller('EditPController', function ($scope, $location) {

    $scope.init = function () {
        window.drawNavigation();
    }
});

app.controller('ProfileController', function ($scope, $location) {

    $scope.init = function () {
        window.drawNavigation();
    }
});

app.controller('ScriptCreateController', function ($scope, $location) {

    $scope.scriptForm = {};
    $scope.genres = [];

    $scope.init = async function () {
        window.drawNavigation();
        const response = await services.getGenres();
        if (response.ok) {
            $scope.genres = response.result;
            $scope.scriptForm.genre = $scope.genres[0].id;
            $scope.$apply();
        }
    }

    $scope.submit = function() {
        console.log("ustvari novo idejo", $scope.scriptForm);
    }
    

    $scope.title = 'Add New Script'
});

app.controller('ScriptUpdateController', function ($scope, $location) {

    $scope.genres = [];
    $scope.scriptForm = {};

    $scope.init = async function () {
        window.drawNavigation();
        const response = await services.getGenres();
        if (response.ok) {
            $scope.genres = response.result;
            $scope.$apply();
        }
    }
    

    $scope.submit = function() {
        console.log("posodobi idejo", $scope.scriptForm);
    }

    $scope.title = 'Update Script'
});

app.controller('ScriptController', function ($scope, $location) {

    $scope.scripts = [];
    $scope.init = async function () {
        window.drawNavigation();
        const response = await services.getScripts();
        $scope.scripts = response.result.map(item => ({
            ...item,
            datecreated: moment(item.datecreated).format('MMMM Do YYYY')
        }));
        $scope.$apply();
    }

    $scope.goToEditScript = function (idScript) { goTo($location, `/update/script/${idScript}`) }
    $scope.goToViewScript = function (idScript) { goTo($location, `/view/script/${idScript}`) }

});
