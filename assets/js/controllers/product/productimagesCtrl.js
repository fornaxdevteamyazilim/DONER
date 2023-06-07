'use strict';
app.controller('productimagesCtrl', productimagesCtrl);
function productimagesCtrl($rootScope, $scope, $http, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $("#search").focus();
    $rootScope.uService.EnterController("productimagesCtrl");
    var pi = this;
    $scope.translate = function () {
        $scope.trProduct = $translate.instant('main.PRODUCT');
        $scope.trImage = $translate.instant('main.IMAGE');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    })
    $scope.translate();
    $scope.item = {};
    pi.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                Restangular.all('product').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: (pi.search) ? "name like '%" + pi.search + "%'" : ""
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response);
                });
            }
        });

    var deregistration1 = $scope.$watch(angular.bind(pi, function () {
        return pi.search;
    }), function (value) {
        pi.tableParams.reload();
    });

    $scope.onClickOpenImageUpload = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/product/uploadimages.html',
            controller: 'uploadimageCtrl',
            size: '',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function (item) {
        })
    }

    $scope.removeItem = function (id) {

        $http.post(
            RESTANGULAR_API_SERVICE_BASE_URI+"/api/product/ImageDelete?id=" + id, {}
        ).then(function (data) {
            location.reload();

        }, function (data) {

        });
    }

    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };

    $scope.products = [];
    $scope.loadEntities('product', 'products');

    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("productimagesCtrl");
    });
};