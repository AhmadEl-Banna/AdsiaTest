angular.module('app').factory('ArticlesByTag', ['$http',
    function($http) {
        return {
            getByTag:function(tag){
                return $http.get('/articles/tag/'+tag);
            }
        }
    }
]);
