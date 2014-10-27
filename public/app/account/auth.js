angular.module('app').factory('auth', function ($http,identity,$q,User) {
return  {
    authenticateUser : function (userName, password) {
        var def = $q.defer();
        $http.post('/login',{userName:userName,password:password})
            .then(function (res) {
                if(res.data.success){
                    var user = new User();
                    angular.extend(user,res.data.user);
                    identity.currentUser = res.data.user;
                    def.resolve(true);
                }
                else{
                    def.resolve(false);
                }
            });
        return def.promise
    },
    createUser: function(newUserData) {
        var newUser = new User(newUserData);
        var dfd = $q.defer();

        newUser.$save().then(function() {
            identity.currentUser = newUser;
            dfd.resolve();
        }, function(response) {
            dfd.reject(response.data.reason);
        });

        return dfd.promise;
    },
    logoutUser:function(){
         var dfd = $q.defer();
         $http.post("/logout",{logout:true}).then(function(){
             identity.currentUser = undefined;
             dfd.resolve()
         });
        return dfd.promise;
    },
    authorizeCurrentUserForRoute: function(role) {
        if(identity.isAuthorized(role)) {
            return true;
        } else {
            return $q.reject('not authorized');
        }

    }
}
})