'use strict';
app.controller('hourlyorderslistCtrl', hourlyorderslistCtrl);
function hourlyorderslistCtrl($scope, $filter, $window, $stateParams, $interval, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("hourlyorderslistCtrl");
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

            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/ccstats/hourlyorderslist", { params: params })
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
        columnChooser: { enabled: true, mode: "dragAndDrop" },
        columns: [
            //{ dataField: "OrderID", dataType: "number"},
            { dataField: "Store", caption: $translate.instant('callcenterreports.Store'), dataType: "string" },
            { dataField: "OrderHour", caption: $translate.instant('callcenterreports.OrderHour'), dataType: "number" },
            { dataField: "OrdersCount", caption: $translate.instant('callcenterreports.OrdersCount'), dataType: "number" },
           { caption: $translate.instant('callcenterreports.OrderAmount'), dataField: "OrdersAmount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
        ],
        summary: {
            totalItems: [
                // { column: "Inventory.name", summaryType: "count", displayFormat: "{0}" },
                // { column: "Units", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                // { column: "UnitCount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                { column: "OrdersCount", summaryType: "sum",  displayFormat: "{0}" },
                { column: "OrdersAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                
            ],
        },
        export: {
            enabled: true,
            fileName: "HOURLYORDERSLIST",
        },
        scrolling: { mode: "virtual" },
        height: 600
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
        $rootScope.uService.ExitController("hourlyorderslistCtrl");
    });
};
