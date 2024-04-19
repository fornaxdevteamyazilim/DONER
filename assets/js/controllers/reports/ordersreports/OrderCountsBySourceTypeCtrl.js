'use strict';
app.controller('OrderCountsBySourceTypeCtrl', OrderCountsBySourceTypeCtrl);
function OrderCountsBySourceTypeCtrl($scope, $filter, $window, $modal, $stateParams, Restangular, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("OrderCountsBySourceTypeCtrl");
    $scope.Time = ngnotifyService.ServerTime();
    if (userService.userIsInRole("Admin") || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("LC") || userService.userIsInRole("AREAMANAGER") || userService.userIsInRole("ACCOUNTING") || userService.userIsInRole("PH") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("OperationDepartment") || userService.userIsInRole("FinanceDepartment")) {
        $scope.StoreID = '';
        $scope.ShowStores = true;
    } else {
        $scope.StoreID = $rootScope.user.StoreID;
    }
    $scope.SetStoreID = function (FromValue) {
        $scope.StoreID = FromValue;
        $scope.selectedStore = $filter('filter')($scope.stores, { id: FromValue });

    };
 
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.FromDate = function () {
        var item=$scope.StartDate;
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = new Date(item);
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.ToDate = function () {
        var item=$scope.EndDate;
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = new Date(item);
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.VeiwHeader = {};
    $scope.reportButtonOptions = {
        text: $translate.instant('reportcommands.GetData'),
        onClick: function () {
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            dataGrid.refresh();
        }
    };
    $scope.resetlayout = $translate.instant('main.RESETLAYOUT');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $("#sales").dxPivotGrid("instance").getDataSource().state({});
        }
    };
    $scope.StoreID;
    var store = new DevExpress.data.CustomStore({
        key: "id",
        load: function (loadOptions) {
            var params = {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
                OrderSourceID: ($scope.OrderSourceID == null) ? '' : $scope.OrderSourceID,
                PaymentTypeID: ($scope.PaymentTypeID == null) ? '' : $scope.PaymentTypeID,
            };
          
            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/order/reports/OrderCountsBySourceTypePivot", { params: params })
                .then(function (response) {
                    if (response.data)
                        for (var i = 0; i < response.data.length; i++) {
                            response.data[i].Amount = response.data[i].UnitCount * response.data[i].UnitPrice;
                            response.data[i].id = i;
                        }
                    return {
                        data: response.data,
                        totalCount: 10
                    };
                }, function (response) {
                    return (response.data.ExceptionMessage) ? $q.reject(response.data.ExceptionMessage) : $q.reject("Data Loading Error");
                });
        }
    });
    $scope.dataGridOptions = {
        dataSource: store,
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        //keyExpr: "id",
        showBorders: true,
        //selection: {
        //    mode: "single"
        //},
        hoverStateEnabled: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        headerFilter: { visible: true },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        grouping: { autoExpandAll: false },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        columnChooser: { enabled: true, mode: "dragAndDrop" },
        columns: [
            { caption: $translate.instant('OrderCountsBySourceTypePivot.StoreName'), dataField: "StoreName",dataType: "string"  },
            { caption: $translate.instant('OrderCountsBySourceTypePivot.Store'), dataField: "Store",dataType: "string"  },
            { caption: $translate.instant('OrderCountsBySourceTypePivot.YemekSepeti'), dataField: "YemekSepeti",dataType: "string"},
            { caption: $translate.instant('OrderCountsBySourceTypePivot.Trendyol'), dataField: "Trendyol",dataType: "string"  ,visible: false},
            { caption: $translate.instant('OrderCountsBySourceTypePivot.Migros'), dataField: "Migros", dataType: "string" },
           { caption: $translate.instant('OrderCountsBySourceTypePivot.Getir'), dataField: "Getir", dataType: "string" },
            { caption: $translate.instant('OrderCountsBySourceTypePivot.CallCenter'), dataField: "CallCenter", dataType: "string" },
            { caption: $translate.instant('OrderCountsBySourceTypePivot.AloPaket'), dataField: "AloPaket", dataType: "string" },
            { caption: $translate.instant('OrderCountsBySourceTypePivot.Kiosk'), dataField: "Kiosk",dataType: "string"  },
            { caption: $translate.instant('OrderCountsBySourceTypePivot.MobilApp'), dataField: "MobilApp",dataType: "string"  },
            { caption: $translate.instant('OrderCountsBySourceTypePivot.RestApp'), dataField: "RestApp",dataType: "string"},
             { caption: $translate.instant('OrderCountsBySourceTypePivot.WebSatis'), dataField: "WebSatis",dataType: "string"},   
             { caption: $translate.instant('OrderCountsBySourceTypePivot.pickup'), dataField: "pickup",dataType: "string"},         
            { caption: $translate.instant('OrderCountsBySourceTypePivot.Total'), dataField: "Total",dataType: "string"},
       
        ],
        summary: {
            totalItems: [
              
                { column: "OrdersCount", summaryType: "sum", displayFormat: "{0}" },
                { column: "Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },

            ],
            groupItems: [
                // { column: "Inventory.name", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
                { column: "OrdersCount", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
                { column: "GrandTotal", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },

            ]
        },
        export: {
            enabled: true,
            fileName: "OrderCountsBySourceType",
        },
        scrolling: { mode: "virtual" },
        height: 600
    };

    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };
    $scope.GetOrderSourceID = function (data) {
        $scope.OrderSourceID = data;
    }

    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.ordersources = [];
    $scope.loadEntities('ordersource', 'ordersources');
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("OrderCountsBySourceTypeCtrl");
    });
};
