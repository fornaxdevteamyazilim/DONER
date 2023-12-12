'use strict';
app.controller('userproductsalesCtrl', userproductsalesCtrl);
function userproductsalesCtrl($scope, $filter, $window, $stateParams, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("userproductsalesCtrl");
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
                //StoreID: ($scope.StoreID == null) ? '' : $scope.StoreID,
                StoreID: $scope.StoreID,
                SourceID: ($scope.SourceID == null) ? '' : $scope.SourceID,
                OrderType: ($scope.OrderType == null) ? '' : $scope.OrderType,
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/order/demoreports/ProductSalesbyagent", { params: params })
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
            //{ dataField: "OrderID", dataType: "number"},
            { dataField: "Store", caption: $translate.instant('ProductSalesbyagent.Store'), dataType: "string" },
            { dataField: "OperationDate", caption : $translate.instant('ProductSalesbyagent.OperationDate'),alignment: "right", dataType: "date", format: 'dd.MM.yyyy HH:mm'}, 
            { dataField: "OrderSource", caption: $translate.instant('ProductSalesbyagent.OrderSource'), dataType: "string" },
            { dataField: "OrderSourceID", caption: $translate.instant('ProductSalesbyagent.OrderSourceID'), dataType: "string" },
            { dataField: "OrderTypeID", caption: $translate.instant('ProductSalesbyagent.OrderTypeID'), dataType: "number" },
            
            { dataField: "Product", caption: $translate.instant('ProductSalesbyagent.Product'), dataType: "string" },
            { dataField: "ProductAmount", caption: $translate.instant('ProductSalesbyagent.ProductAmount'), dataType: "string" },
            { dataField: "ProductCount", caption: $translate.instant('ProductSalesbyagent.ProductCount'), dataType: "number" },
            { dataField: "ProductGroup", caption: $translate.instant('ProductSalesbyagent.ProductGroup'), dataType: "string" },
            { dataField: "ProductID", caption: $translate.instant('ProductSalesbyagent.ProductID'), dataType: "string" },
            { dataField: "fk_User_id", caption: $translate.instant('ProductSalesbyagent.fk_User_id'), dataType: "number" },
            { dataField: "isFree", caption: $translate.instant('ProductSalesbyagent.isFree'), dataType: "number" },
           
            
        ],
        summary: {
            totalItems: [
                //  { column: "OrdersCountTKW", summaryType: "sum", displayFormat: "{0}" },
                //  { column: "OrdersAmountTKW", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                //  { column: "OrdersCountDelivery", summaryType: "sum",  displayFormat: "{0}" },
                //  { column: "OrdersAmountDelivery", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                { column: "ProductCount", summaryType: "count",  displayFormat: "{0}" },
                { column: "ProductAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                
            ],
            groupItems: [
                // { column: "Inventory.name", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
                { column: "ProductCount", summaryType: "count",  displayFormat: "{0}", alignByColumn: true },
                { column: "ProductAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
              
            ]
        },
        export: {
            enabled: true,
            fileName: "ProductSalesbyagent",
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
        $rootScope.uService.ExitController("userproductsalesCtrl");
    });
};
