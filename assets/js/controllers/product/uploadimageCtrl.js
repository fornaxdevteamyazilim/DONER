app.controller('uploadimageCtrl', uploadimageCtrl);

var itemId;
var dragDrop;
var baseUri;

function uploadimageCtrl($rootScope, $scope, $http, $translate, $modalInstance, item, Restangular, toaster, $window) {
    $rootScope.uService.EnterController("uploadimageCtrl");
    $scope.Id = item.id;
    itemId = item.id;
    $scope.ProductName = item.name;   

    $scope.translate = function () {
        $scope.trProduct = $translate.instant('main.PRODUCT');
        $scope.trImage = $translate.instant('main.IMAGE');
        dragDrop = $translate.instant('main.DRAG_DROP');
        
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    })
    $scope.translate();

    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.states = [];
    $scope.loadEntities('enums/orderstate', 'states');
    $scope.ok = function () {
        $modalInstance.close('result');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $rootScope.uService.ExitController("orderimageCtrl");
    });
};

app.directive("imgUpload", function ($http, $compile) {
    return {
        restrict: 'AE',
        scope: {
            url: "@",
            method: "@"
        },
        template: '<input class="fileUpload" type="file" />' +
            '<div class="dropzone">' +
            '<p class="msg">' + dragDrop +'</p>' +
            '</div>' +
            '<div class="preview clearfix">' +
            '<div class="previewData clearfix" ng-repeat="data in previewData track by $index">' +
            '<img src={{data.src}}></img>' +
            '<div class="previewDetails">' +
            '<div class="detail"><b>Name : </b>{{data.name}}</div>' +
            '<div class="detail"><b>Type : </b>{{data.type}}</div>' +
            '<div class="detail"><b>Size : </b> {{data.size}}</div>' +
            '</div>' +
            '<div class="previewControls">' +
            '<span ng-click="upload(data)" class="circle upload">' +
            '<i class="fa fa-check"></i>' +
            '</span>' +
            '<span ng-click="remove(data)" class="circle remove">' +
            '<i class="fa fa-close"></i>' +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>',
        link: function (scope, elem, attrs) {
            var formData = new FormData();
            scope.previewData = [];

            function previewFile(file) {
                var reader = new FileReader();
                var obj = new FormData().append('file', file);
                reader.onload = function (data) {
                    var src = data.target.result;
                    var size = ((file.size / (1024 * 1024)) > 1) ? (file.size / (1024 * 1024)) + ' mB' : (file.size / 1024) + ' kB';
                    scope.$apply(function () {
                        scope.previewData.push({
                            'name': file.name, 'size': size, 'type': file.type,
                            'src': src, 'data': obj
                        });
                    });
                }
                reader.readAsDataURL(file);
            }

            function uploadFile(e, type) {
                e.preventDefault();
                var files = "";
                if (type == "formControl") {
                    files = e.target.files;
                } else if (type === "drop") {
                    files = e.originalEvent.dataTransfer.files;
                }
                
                    var file = files[0];
                    if (file.type.indexOf("image") !== -1) {
                        previewFile(file);
                    } else {
                        alert(file.name + " is not supported");
                    }
                
            }
            elem.find('.fileUpload').bind('change', function (e) {
                uploadFile(e, 'formControl');
            });

            elem.find('.dropzone').bind("click", function (e) {
                $compile(elem.find('.fileUpload'))(scope).trigger('click');
            });

            elem.find('.dropzone').bind("dragover", function (e) {
                e.preventDefault();
            });

            elem.find('.dropzone').bind("drop", function (e) {
                uploadFile(e, 'drop');
            });

            scope.upload = function (obj) {
                var newData = {
                    Id: itemId,
                    File: obj.src,
                    Extension: obj.name.split('.')[1]
                }

                obj.data = newData;

                $http({
                    method: scope.method, url: baseUri +"/api/product/imageUpload", data: JSON.stringify(obj.data),
                    headers: { 'Content-Type': undefined }, transformRequest: angular.identity
                }).success(function (data) {
                    location.reload();

                });
            }

            scope.remove = function (data) {
                var index = scope.previewData.indexOf(data);
                scope.previewData.splice(index, 1);
            }
        }
    }
});