'use strict';
app.controller('orderlaststatesCtrl', orderlaststatesCtrl);
function orderlaststatesCtrl($scope, $filter, $window, $stateParams, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("orderlaststatesCtrl");
    $scope.Time = ngnotifyService.ServerTime();

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
    Date.prototype.addDays = Date.prototype.addDays || function (days) {
        return this.setTime(864E5 * days + this.valueOf()) && this;
    };
    $scope.DateRange = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.fromDate.value"
            },
            value: (new Date()).addDays(-1),
            labelLocation: "top", // or "left" | "right"  

        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDate.value"
            },
            value: (new Date()).addDays(0),
            label: {
                location: "top",
                alignment: "right" // or "left" | "center"
            }
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
            };

            return $http.post(NG_SETTING.apiServiceBaseUri + "/api/extendedreports/orderlaststates", { params: params })
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
            { dataField: "OrderState", caption: $translate.instant('ReturnedProductsDetailed.OrderState'), dataType: "string" },
            { dataField: "OrderType", caption: $translate.instant('ReturnedProductsDetailed.OrderType'), dataType: "number" },
            { dataField: "PaymentType", caption: $translate.instant('ReturnedProductsDetailed.PaymentType'), dataType: "string" },
            { caption: $translate.instant('ReturnedProductsDetailed.Amount'), dataField: "Amount",  format: { type: "fixedPoint", precision: 2 } },
        ],
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
        $rootScope.uService.ExitController("orderlaststatesCtrl");
    });
};
