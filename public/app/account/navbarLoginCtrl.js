angular.module('app').controller('navbarLoginCtrl',function($scope,$http,notifier,identity,auth,$location){
    $scope.identity = identity;
    $scope.signin = function(userName,password){
        auth.authenticateUser(userName,password)
            .then(function (success) {
                if(success){
                    notifier.notify("you have successfully signed in!");
                }
                else{
                    notifier.notify('failed to log in!');
                }
            })

    };
    $scope.signout = function(){
        auth.logoutUser().then(function(){
            $scope.userName ="";
            $scope.password = "";
            notifier.notify("You have successfully singed out");
            $location.path('/');
        })
    }
});