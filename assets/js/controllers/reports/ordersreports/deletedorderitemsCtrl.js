'use strict';
app.controller('deletedorderitemsCtrl', deletedorderitemsCtrl);
function deletedorderitemsCtrl($scope, $filter, $window, $stateParams, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("deletedorderitemsCtrl");
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
       //key: "id",
        load: function (loadOptions) {
            var params = {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/order/reports/deletedorderitems", { params: params })
                .then(function (response) {
                  
                    return {
                        data: response.data,
                        totalCount: 10
                    };
                }, function (response) {
                    return (response.data.ExceptionMessage) ? $q.reject(response.data.ExceptionMessage) : $translate.instant('InventoryRequirmentItem.Calculatingrequirments')
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
        noDataText: $translate.instant('InventoryRequirmentItem.Calculatingrequirments'),
       // columnChooser: { enabled: true, mode: "dragAndDrop" },
        columns: [
            { dataField: "Store", caption: $translate.instant('ordersreports.Store'), dataType: "string" },
            { dataField: "OperationDate",caption: $translate.instant('ordersreports.OperationDate'), alignment: "right", dataType: "date", width: 180, format: 'dd.MM.yyyy', sortIndex: 0,sortOrder: "desc" },
            { dataField: "OrderDate",caption: $translate.instant('ordersreports.OrderDate'), alignment: "right", dataType: "date", width: 180, format: 'dd.MM.yyyy', sortIndex: 0,sortOrder: "desc" },
                 { dataField: "OrderID", caption: $translate.instant('ordersreports.OrderID'),dataType: "number", format: { type: "percent", precision: 2 }  },
                    { dataField: "SecondsDelayAfterOrderStart", caption: $translate.instant('ordersreports.SecondsDelayAfterOrderStart') },
            { dataField: "updateTime", caption: $translate.instant('ordersreports.updateTime'),alignment: "right", dataType: "date", width: 180, format: 'dd.MM.yyyy HH:mm:ss', sortIndex: 0,sortOrder: "desc" },


            { dataField: "UpdateUser", caption: $translate.instant('ordersreports.UpdateUser'),dataType: "string"},
            { dataField: "Product", caption: $translate.instant('ordersreports.Product'), dataType: "string"},
           { dataField: "Quantity", caption: $translate.instant('ordersreports.Quantity'),   },
            { dataField: "OrderNumber", caption: $translate.instant('ordersreports.OrderNumber'),alignment: "right", dataType: "date", width: 180, format: 'dd.MM.yyyy', sortIndex: 0,sortOrder: "desc" },

            { dataField: "OrderSourceID", caption: $translate.instant('ordersreports.OrderSourceID'),dataType: "number", format: { type: "percent", precision: 2 }  },
           


            { caption: $translate.instant('ordersreports.Amount'), dataField: "Amount",  format: { type: "fixedPoint", precision: 2 } },
        ],
        summary: {
            totalItems: [
              
                { column: "OrdersCount", summaryType: "sum", displayFormat: "{0}" },
                { column: "Amount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },

            ],
            groupItems: [
                // { column: "Inventory.name", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
                { column: "OrdersCount", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
                { column: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },

            ]
        },
        export: {
            enabled: true,
            fileName: "deletedorderitems",
        },
        scrolling: { mode: "virtual" },
        height: 600
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
    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("deletedorderitemsCtrl");
    });
};
