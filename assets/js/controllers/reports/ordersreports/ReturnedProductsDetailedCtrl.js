'use strict';
app.controller('ReturnedProductsDetailedCtrl', ReturnedProductsDetailedCtrl);
function ReturnedProductsDetailedCtrl($scope, $filter, $window, $stateParams, $interval, $rootScope, $translate, userService, ngnotifyService, $element, $modal, $log, Restangular, SweetAlert, $timeout, toaster,  $compile, $location, NG_SETTING, $http, $q
    ) {
    var ctrl = this;
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
            $('#gridContainer').dxDataGrid('instance').state({});
        }
    };    
    $scope.selectedStore = function (OrderID, Store) {
        var data = {};
        data.id = OrderID;
        data.name = Store;
        $rootScope.SelectedData = data;
        $location.path('/app/dashboard');
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

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/order/demoreports/ReturnedProductsdetailed", { params: params })
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
        showColumnLines: false,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        headerFilter: { visible: true },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        grouping: { autoExpandAll: false },
        // stateStoring: {
        //     enabled: true,
        //     type: "localStorage",
        //     storageKey: "dx-OrderTotalsStoreByOrderType-storing"
        // },
        columns: [
            { dataField: "Store", caption: $translate.instant('ReturnedProductsDetailed.Store'), dataType: "string" },
            { dataField: "OrderID", caption: $translate.instant('ReturnedProductsDetailed.OrderID'),dataType: "number",},
            { dataField: "OrderNumber", caption: $translate.instant('ReturnedProductsDetailed.OrderNumber'), dataType: "string" },
            { dataField: "OperationDate",  caption: $translate.instant('ReturnedProductsDetailed.OperationDate'), lignment: "right", dataType: "date", width: 180, format: 'dd.MM.yyyy', sortIndex: 0,sortOrder: "desc" },
            { dataField: "OrderDate",  caption: $translate.instant('ReturnedProductsDetailed.OrderDate'), lignment: "right", dataType: "date", width: 180, format: 'dd.MM.yyyy',},
            { dataField: "OrderTypeID", caption: $translate.instant('ReturnedProductsDetailed.OrderTypeID'),dataType: "number",  },
            { dataField: "OrderType", caption: $translate.instant('ReturnedProductsDetailed.OrderType'), dataType: "number",  },
            { dataField: "OrderNote", caption: $translate.instant('ReturnedProductsDetailed.OrderNote'), dataType: "string" },
            { dataField: "OrderSource", caption: $translate.instant('ReturnedProductsDetailed.OrderSource'), dataType: "string" },
            { dataField: "Product", caption: $translate.instant('ReturnedProductsDetailed.Product'), dataType: "string" },
            { dataField: "ProductCount", caption: $translate.instant('ReturnedProductsDetailed.ProductCount'), dataType: "number" },
            { dataField: "User", caption: $translate.instant('ReturnedProductsDetailed.User'), dataType: "string" },
            { caption: $translate.instant('ReturnedProductsDetailed.ProductAmount'), dataField: "ProductAmount",  format: { type: "fixedPoint", precision: 2 } },
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

            ],
            onRowDblClick: function (e) {
                if (!e.isNewRow)
                     location.href = '#/app/reports/others/orderlistreportdetail/' + e.key;
            },
            // onRowClick: function (rowInfo) {
            //     if (!rowInfo.isNewRow)
            //         location.href = '#/app/specialoperations/shiftplanedit2/' + rowInfo.key;
            //     //rowInfo.component.editRow(rowInfo.rowIndex);  
            // },
            onRowClick: function (rowInfo) {
                //    location.href = '#/app/specialoperations/shiftplanedit2/' + rowInfo.key;
                //rowInfo.component.editRow(rowInfo.rowIndex);  
                $rootScope.SelectedData = { id: rowInfo.key, name: rowInfo.data.Store };
                location.href = '#/app/reports/others/orderlistreportdetail/' + rowInfo.key;
                //$location.href = '#/app/dashboard';
            },
        },
      
        export: {
            enabled: true,
            fileName: "ReturnedProductsDetailed",
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

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("ReturnedProductsDetailedCtrl");
    });
};