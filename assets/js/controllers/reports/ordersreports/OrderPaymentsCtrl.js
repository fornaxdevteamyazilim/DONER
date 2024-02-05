'use strict';
app.controller('OrderPaymentsCtrl', OrderPaymentsCtrl);
function OrderPaymentsCtrl($scope, $filter, $window, $stateParams, $interval, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("OrderPaymentsCtrl");
    $scope.Time = ngnotifyService.ServerTime();
    var promise;

    if ($rootScope.user.userstores && $rootScope.user.userstores.length > 1) {
        $scope.selectStore = true;
        $scope.StoreID = '';
    }
    else {
        $scope.StoreID = $rootScope.user.StoreID;
    }
    $scope.Back = function () {
        $window.history.back();
    };
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    $scope.DateRange = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.fromDate.value"
            },
            value: new Date()
        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDate.value"
            },
            value: new Date()
        }
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
                StartDate: $scope.DateRange.fromDate.value,
                EndDate: $scope.DateRange.toDate.value,
                StoreID: $scope.StoreID,
                SourceID: ($scope.SourceID == null) ? '' : $scope.SourceID,
                OrderType: ($scope.OrderType == null) ? '' : $scope.OrderType,

            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/order/demoreports/OrderPayments", { params: params })
            .then(function (response) {
                return {
                    data: response.data,
                    totalCount: 10
                };
            }, function (response) {
                return $q.reject("Data Loading Error");
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
            { dataField: "StoreName", caption: $translate.instant('ordersreports.Store'), dataType: "string" },
            { dataField: "OperationDate",caption: $translate.instant('ordersreports.OperationDate'), alignment: "right", dataType: "date", width: 180, format: 'dd.MM.yyyy', sortIndex: 0,sortOrder: "desc" },
            { dataField: "PaymentType", caption: $translate.instant('ordersreports.PaymentType'),dataType: "number", format: { type: "percent", precision: 2 }  },
           // { dataField: "OrderType", caption: $translate.instant('ordersreports.OrderType'), dataType: "number", format: { type: "percent", precision: 2 }  },
          //  { dataField: "Discount", caption: $translate.instant('ordersreports.Discount'),  format: { type: "fixedPoint", precision: 2 } },
            { dataField: "OrdersCount", caption: $translate.instant('ordersreports.OrdersCount'), dataType: "number" },
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
            fileName: "OrderPayments",
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
            value: $scope.StoreID,
            bindingOptions: {
                value: "StoreID"
            }
        },
    };
    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };
    var refreshData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    }
    $scope.start = function () {
        $scope.stop();
        promise = $interval(refreshData, 60000);
    };

    $scope.stop = function () {
        $interval.cancel(promise);
    };
    $scope.start();
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("OrderPaymentsCtrl");
    });
};
