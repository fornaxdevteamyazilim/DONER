'use strict';
app.controller('turnoverbyhoursreportCtrl', turnoverbyhoursreportCtrl);
function turnoverbyhoursreportCtrl($scope, $filter, $window, $stateParams, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("turnoverbyhoursreportCtrl");
    $scope.Time = ngnotifyService.ServerTime();

    if ($rootScope.user.userstores && $rootScope.user.userstores.length > 1) {
        $scope.selectStore = true;
        $scope.StoreID = '';
    }
    else {
        $scope.StoreID = $rootScope.user.StoreID;
    }
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
                StoreID: $scope.StoreID,    
                SourceID: ($scope.OrderSourceID == null) ? '' : $scope.OrderSourceID,
                OrderType: ($scope.OrderTypeID == null) ? -1 : $scope.OrderTypeID 
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/extendedreports/productstatistics", { params: params })
                // .then(function (response) {
                //     if (response.data)
                //         for (var i = 0; i < response.data.length; i++) {
                //             response.data[i].Amount = response.data[i].UnitCount * response.data[i].UnitPrice;
                //             response.data[i].id = i;
                //         }
                //     return {
                //         data: response.data,
                //         totalCount: 10
                //     };
                // }, function (response) {
                //     return (response.data.ExceptionMessage) ? $q.reject(response.data.ExceptionMessage) : $q.reject("Data Loading Error");
                // });
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
       // columnChooser: { enabled: true, mode: "dragAndDrop" },
        columns: [
            { dataField: "Store", caption: $translate.instant('ReturnedProductsDetailed.Store'), dataType: "string" },
            { dataField: "OperationDate",  caption: $translate.instant('ReturnedProductsDetailed.OperationDate'), lignment: "right", dataType: "date", width: 180, format: 'dd.MM.yyyy', sortIndex: 0,sortOrder: "desc" },
            { dataField: "DeliveryDate",  caption: $translate.instant('ReturnedProductsDetailed.DeliveryDate'), lignment: "right", dataType: "date", width: 180, format: 'dd.MM.yyyy',},
            { dataField: "OrderSource", caption: $translate.instant('ReturnedProductsDetailed.OrderSource'), dataType: "string" },
            { caption: $translate.instant('menuincom.Store'), dataField: "Store",dataType: "string"  },
            { caption: $translate.instant('poductsalesccoreboard.OperationDate'), dataField: "OperationDate", dataType: "date" },
            { caption: $translate.instant('menuincom.OrderSource'), dataField: "OrderSource",dataType: "string"  },
            { caption: $translate.instant('menuincom.ProductName'), dataField: "ProductName",dataType: "string"  },
            { caption: $translate.instant('menuincom.price'), dataField: "price", dataType: "number", format: "#,##0.00₺"  },
            { caption: $translate.instant('menuincom.OrderType'), dataField: "OrderType",dataType: "string"},
            { caption: $translate.instant('menuincom.quantity'), dataField: "Quantity",dataType: "string"},
            { caption: $translate.instant('menuincom.amount'), dataField: "Amount", dataType: "number",valueFormat: { type: "fixedPoint", precision: 2 }, },    ],
        summary: {
            totalItems: [
                // { column: "Inventory.name", summaryType: "count", displayFormat: "{0}" },
                // { column: "Units", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                // { column: "UnitCount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                { column: "OrdersCount", summaryType: "sum",  displayFormat: "{0}" },
                { column: "OrdersAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                
            ],
            groupItems: [
                // { column: "Inventory.name", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
                { column: "OrdersCount", summaryType: "count",  displayFormat: "{0}", alignByColumn: true },
                { column: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
              
            ]
        },
        export: {
            enabled: true,
            fileName: "CALLCENTERSTOREREPORTS",
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
        $rootScope.uService.ExitController("turnoverbyhoursreportCtrl");
    });
};
