angular.module('app').factory('Articles', ['$resource',
    function($resource) {
        return $resource('/articles/:articleId', {
            articleId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
