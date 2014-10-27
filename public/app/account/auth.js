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
    logoutUser:function(){
         var dfd = $q.defer();
         $http.post("/logout",{logout:true}).then(function(){
             identity.currentUser = undefined;
             dfd.resolve()
         });
        return dfd.promise;
    }
}
})