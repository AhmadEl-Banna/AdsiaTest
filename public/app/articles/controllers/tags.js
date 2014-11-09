angular.module('app').controller('tagsCtrl',['$scope','tagsService',function($scope,tagsService){
    $scope.tags = tagsService.query();
}]);
