angular.module('app').factory('tagsService',function($resource){
    var TagsResource = $resource('/tags/:id',{_id:"@id"});

    return TagsResource;
});