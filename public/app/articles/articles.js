angular.module('app').controller('ArticlesController', ['$scope', '$routeParams', '$location', 'identity', 'Articles','tagsService',
    function($scope, $routeParams, $location, identity, Articles,tagsService) {
        $scope.authentication = identity;

        $scope.seachText= "";
        $scope.search = function () {
            $scope.articles = Articles.query({search:$scope.seachText})
        };

        $scope.create = function() {
            var article = new Articles({
                title: this.title,
                content: this.content,
                tags:this.tags
            });
            article.$save(function(response) {
                $location.path('articles/' + response._id);

                $scope.title = '';
                $scope.content = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.remove = function(article) {
            if (article) {
                article.$remove();

                for (var i in $scope.articles) {
                    if ($scope.articles[i] === article) {
                        $scope.articles.splice(i, 1);
                    }
                }
            } else {
                $scope.article.$remove(function() {
                    $location.path('articles');
                });
            }
        };

        $scope.update = function() {
            var article = $scope.article;

            article.$update(function() {
                $location.path('articles/' + article._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.find = function() {
            $scope.articles = Articles.query();
            $scope.tags = tagsService.query();
        };

        $scope.findOne = function() {
            $scope.article = Articles.get({
                articleId: $routeParams.articleId
            });

        };
    }
]);
