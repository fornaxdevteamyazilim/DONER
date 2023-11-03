'use strict';
app.controller('orderpaymentcomparepivotCtrl', orderpaymentcomparepivotCtrl);
function orderpaymentcomparepivotCtrl($scope, $filter, $window, $stateParams, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("orderpaymentcomparepivotCtrl");
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
    Date.prototype.addDays =
        Date.prototype.addDays ||
        function (days) {
            return this.setTime(864e5 * days + this.valueOf()) && this;
        };
    $scope.DateRange = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: "dd.MM.yyyy",
            bindingOptions: {
                value: "DateRange.fromDate.value",
            },
            value: new Date().addDays(-2),
            labelLocation: "top", // or "left" | "right"
        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: "dd.MM.yyyy",
            bindingOptions: {
                value: "DateRange.toDate.value",
            },
            value: new Date().addDays(-1),
            label: {
                location: "top",
                alignment: "right", // or "left" | "center"
            },
        },
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
    function getFilter() {
        return [["OperationDate", ">=", $scope.DateRange.fromDate.value], "and", ["OperationDate", "<=", $scope.DateRange.toDate.value]];
    }
    $scope.StoreID;
    var store = new DevExpress.data.CustomStore({
        // key: "StoreID",
        load: function () {
            var params = {
                StartDate: $scope.DateRange.fromDate.value,
                EndDate: $scope.DateRange.toDate.value,
                StoreID: $scope.StoreID

            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/order/reports/orderpaymentcomparepivot", { params: params })
                .then(function (response) {
                    return {
                        data: response.data,
                        totalsum: 10
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
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "dx-orderpaymentcomparepivot-storing"
        },
        groupPanel: { visible: true },
        grouping: { autoExpandAll: false },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        columnChooser: { enabled: true, mode: "dragAndDrop" },
        columns: [
            //{ dataField: "id", dataType: "number", visible: false },
            { caption: "Restoran", dataField: "StoreName", dataType: "string",  },
            { caption: "Getir Online", dataField: "Getir Online", dataType: "number" },
            { caption: "I Wallet", dataField: "I Wallet", dataType: "number" },// fixed: true ,groupIndex: 0 },
            { caption: "Kredi Kartı", dataField: "Kredi Kartı", dataType: "number",  },
            { caption: "Migros Online", dataField: "Migros Online", dataType: "number",},
            { caption: "Nakit", dataField: "Nakit", dataType: "number",},
            { caption: "Online Kredi Kartı", dataField: "Online Kredi Kartı", dataType: "number" },
            { caption: "Paycell", dataField: "Paycell", dataType: "number" },
            { caption: "Paye Card", dataField: "Paye Card", dataType: "number" },
            { caption: "Set Card", dataField: "Set Card", dataType: "number", },
            { caption: "Sodexho", dataField: "Sodexho", dataType: "number", },
            { caption: "Ticket Card", dataField: "Ticket Card", dataType: "number", },
            { caption: "Token Flex", dataField: "Token Flex", dataType: "number",  },
            { caption: "Trendyol Online", dataField: "Trendyol Online", dataType: "number",  },
            { caption: "YS Online", dataField: "YS Online", dataType: "number",  },

        ],
        summary: {
            totalItems: [
           // { column: "Total", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "Getir Online", summaryType: "sum", displayFormat: "{0}",alignByColumn: true },
            { column: "I Wallet", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "Kredi Kartı", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "Migros Online", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "Nakit", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "Online Kredi Kartı", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "Paycell", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "Paye Card", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "Set Card", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "Sodexho", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "Ticket Card", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "Token Flex", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "Trendyol Online", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "YS Online", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            //{ column: "Total", summaryType: "sum", displayFormat: "{0}",  },
            ],
            groupItems: [
                { column: "Total", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "Getir Online", summaryType: "sum", displayFormat: "{0}" ,alignByColumn: true},
                { column: "I Wallet", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "Kredi Kartı", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "Migros Online", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "Nakit", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "Online Kredi Kartı", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "Paycell", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "Paye Card", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "Set Card", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "Sodexho", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "Ticket Card", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "Token Flex", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "Trendyol Online", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "YS Online", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "Total", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            ],
        },
           export: {
            enabled: true,
            fileName: "orderpaymentcomparepivot",
        },
   
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
        $rootScope.uService.ExitController("orderpaymentcomparepivotCtrl");
    });
};