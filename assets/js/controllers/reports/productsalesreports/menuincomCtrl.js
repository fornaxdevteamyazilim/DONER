'use strict';
app.controller('menuincomCtrl', menuincomCtrl);
function menuincomCtrl($scope, $filter, $window, $modal, $stateParams, Restangular, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("menuincomCtrl");
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
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,
                SourceID: ($scope.OrderSourceID == null) ? '' : $scope.OrderSourceID,
                OrderType: ($scope.OrderTypeID == null) ? '' : $scope.OrderTypeID,
                ProductListGroup: ''//'Güncel Promosyonlar'
            };
          
            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/PoductSaleAnalisys/MenuIncome", { params: params })
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
       
        columns: [
            { caption: $translate.instant('menuincom.name'), dataField: "name",dataType: "string"  },
            { caption: $translate.instant('menuincom.price'), dataField: "price", dataType: "number", format: "#,##0.00₺"  },
            { caption: $translate.instant('menuincom.quantity'), dataField: "quantity",dataType: "string"},
            { caption: $translate.instant('menuincom.amount'), dataField: "amount", dataType: "number",valueFormat: { type: "fixedPoint", precision: 2 }, },
       
       
        ],
        summary: {
            totalItems: [
              
                { column: "price", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺", alignByColumn: true  },
                { column: "quantity", summaryType: "sum", displayFormat: "{0}" },
                { column: "amount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺", alignByColumn: true },

            ],
      
        },
        export: {
            enabled: true,
            fileName: "menuincom",
        },
        scrolling: { mode: "virtual" },
        height: 600
    };

    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };
    $scope.selectBox = {
        dataSourceUsage: {
            dataSource: new DevExpress.data.ArrayStore({
                data: $filter('orderBy')($rootScope.user.userstores, 'name'),
                key: "id"
            }),
            displayExpr: "name",
            valueExpr: "id",
            placeholder: "Select Store...",
            value: $rootScope.user.StoreID,
            bindingOptions: {
                value: "StoreID"
            }
        },
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
        $rootScope.uService.ExitController("menuincomCtrl");
    });
};
