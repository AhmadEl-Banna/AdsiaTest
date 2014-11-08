angular.module('app', ['ngResource', 'ngRoute','ui.bootstrap','ngTagsInput']);

angular.module('app').config(function($routeProvider, $locationProvider) {
  var routeRoleChecks = {
    admin: {auth: function(auth) {
      return auth.authorizeCurrentUserForRoute('admin')
    }},
      isAuthentcated:{identity:function(identity){
          return identity.isAuthenticated();
      }}
  };

 /* $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
  });*/

  $routeProvider
      .when('/', { templateUrl: '/partials/main/main', controller: 'mainCtrl'})
      .when('/admin/users', { templateUrl: '/partials/admin/user-list',
        controller: 'userListCtrl', resolve: routeRoleChecks.admin
      })
      .when('/signup', { templateUrl: '/partials/account/signup',
        controller: 'signupCtrl'
      })
      .when('/articles',{
          templateUrl: '/partials/articles/articlesList',
          resolve:routeRoleChecks.isAuthentcated
      })
      .when('/articles/add',{
          templateUrl: '/partials/articles/addArticle',
          resolve:routeRoleChecks.isAuthentcated
      })
      .when('/articles/:articleId',{
          templateUrl: '/partials/articles/articleView'
      })
      .when('/articles/:articleId/edit',{
          templateUrl: '/partials/articles/articleEdit'
      })


});

angular.module('app').run(function($rootScope, $location) {
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
    if(rejection === 'not authorized') {
      $location.path('/');
    }
  })
});


