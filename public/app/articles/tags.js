angular.module('app').controller('tags',['$scope','tagsService',function($scope,tagsService){
    $scope.tags = tagsService.query();
}]);