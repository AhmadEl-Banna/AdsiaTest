angular.module('app').controller('ArticlesController', ['$scope', '$routeParams','ArticlesByTag', '$location', 'identity', 'Articles','tagsService',
    function($scope, $routeParams,ArticlesByTag, $location, identity, Articles,tagsService) {

      $scope.authentication = identity;

      $scope.searchText= "";

      $scope.$watch('searchText', function (newValue) {
         search(newValue);
      });

      var search = function (search) {
          $scope.articles = Articles.query({search:search})
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
            if($routeParams.tag)
            {
                ArticlesByTag.getByTag($routeParams.tag).success(function(data){
                    $scope.articles = data;
                });
            }
            else{
                $scope.articles = Articles.query();
                $scope.tags = tagsService.query();
            }

        };

        $scope.findOne = function() {
            $scope.article = Articles.get({
                articleId: $routeParams.articleId
            });

        };
    }
]);
