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
        .when('/scripts', { templateUrl: './views/scripts.html', controller: "ScriptController" })
        .when('/create/script', { templateUrl: './views/scriptform.html', controller: "ScriptCreateController", resolve: { loggedIn } })
        .when('/update/script/:id', { templateUrl: './views/scriptform.html', controller: "ScriptUpdateController", resolve: { loggedIn } })
        .when('/view/script/:id', { templateUrl: './views/scriptview.html', controller: "ScriptViewController", resolve: { loggedIn } })
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

app.filter('ytEmbed', function () {
    return function (link) {
        if (link) {
            if (link.includes('/watch?v='))
                return link.replace('/watch?v=', '/embed/')
            return link;
        }
    }
});

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

    $scope.user = {};

    $scope.init = async function () {
        window.drawNavigation();
        const response = await services.getProfile();
        if (response.ok) {
            $scope.user = response.result;
            $scope.user.date_created = moment(response.result.date_created).format('MMMM Do YYYY');
            $scope.user.avatar = `http://www.gravatar.com/avatar/${CryptoJS.MD5($scope.user.email)}.jpg?s=80&d`;
            $scope.$apply();
        }
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
            $scope.scriptForm.genre_id = $scope.genres[0].id;
            $scope.$apply();
        }
    }

    $scope.submit = async function () {
        const response = await services.createScript($scope.scriptForm);
    }

    $scope.title = 'Add New Script'
});

app.controller('ScriptUpdateController', ['$scope', '$routeParams', function ($scope, $routeParams) {

    $scope.genres = [];
    $scope.scriptForm = {};

    $scope.init = async function () {
        window.drawNavigation();
        const genresResponse = await services.getGenres();
        $scope.userID = localStorage.getItem('kfmID_');
        if (genresResponse.ok) {
            $scope.genres = genresResponse.result;
            $scope.$apply();
        }

        const scriptResponse = await services.getScriptById($routeParams.id);
        if (scriptResponse.ok) {
            $scope.scriptForm = scriptResponse.result;
            $scope.$apply();
            setTimeout(() => document.getElementById("title").focus(), 200);
        }

        if ($scope.userID != $scope.scriptForm.user_id) {
            window.history.back();
        }
    }


    $scope.submit = async function () {
        const response = await services.updateScript($scope.scriptForm, $routeParams.id);
    }

    $scope.title = 'Update Script'
}]);


app.controller('ScriptViewController', ['$scope', '$routeParams', function ($scope, $routeParams) {

    $scope.scriptView = {};
    $scope.comments = [];
    $scope.newCommentField = ""

    $scope.init = async function () {
        window.drawNavigation();
        const scriptResponse = await services.getScriptById($routeParams.id);
        if (scriptResponse.ok) {
            console.log(scriptResponse);
            $scope.scriptView = scriptResponse.result;
            $scope.scriptView.datecreated = moment($scope.scriptView.datecreated).format('MMMM Do YYYY');
            $scope.$apply();
        }

        const commentsResponse = await services.getComments($routeParams.id);
        if (scriptResponse.ok) {
            console.log(commentsResponse);
            $scope.comments = commentsResponse.result.map(item => ({
                ...item,
                date_created: moment(item.date_created).format('MMMM Do YYYY'),
                avatar: `http://www.gravatar.com/avatar/${CryptoJS.MD5(item.email)}.jpg?s=80&d`
            }));
            $scope.$apply();
        }
    }

    $scope.addNewComment = async function () {
        if ($scope.newCommentField) {
            const data = { content: $scope.newCommentField };
            const newCommentResponse = await services.postComment(data, $routeParams.id);
            if (newCommentResponse.ok) {
                swal("Comment posted successfully!");
                const commentsResponse = await services.getComments($routeParams.id);
                if (commentsResponse.ok) {
                    console.log(commentsResponse);
                    $scope.comments = commentsResponse.result.map(item => ({
                        ...item,
                        date_created: moment(item.date_created).format('MMMM Do YYYY'),
                        avatar: `http://www.gravatar.com/avatar/${CryptoJS.MD5(item.email)}.jpg?s=80&d`
                    }));
                    $scope.$apply();
                }
            } else {
                swal("Something went wrong!");
            }
        } else {
            swal("The comment field is not valid!");
        }
    }

}]);

app.controller('ScriptController', function ($scope, $location) {

    $scope.scripts = [];
    $scope.init = async function () {
        window.drawNavigation();
        const response = await services.getScripts();
        $scope.userID = localStorage.getItem('kfmID_');
        $scope.scripts = response.result.map(item => ({
            ...item,
            datecreated: moment(item.datecreated).format('MMMM Do YYYY')
        }));
        $scope.$apply();
    }

    $scope.goToEditScript = function (idScript) { goTo($location, `/update/script/${idScript}`) }
    $scope.goToViewScript = function (idScript) { goTo($location, `/view/script/${idScript}`) }

});
