'use strict';
app.controller('storeordersCtrl', storeordersCtrl);
function storeordersCtrl($scope, $filter, $window, $stateParams, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("storeordersCtrl");
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

    $scope.StoreID;
    var store = new DevExpress.data.CustomStore({
       //key: "id",
        load: function (loadOptions) {
            var params = {
                StartDate: $scope.DateRange.fromDate.value,
                EndDate: $scope.DateRange.toDate.value,
          
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/ccstats/storeorders", { params: params })
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
        showBorders: true,
        hoverStateEnabled: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        headerFilter: { visible: true },
        searchPanel: { visible: true },
        groupPanel: { visible: false },
        grouping: { autoExpandAll: false },
        columnChooser: { enabled: false },
        columnFixing: { enabled: false },
       // columnChooser: { enabled: true, mode: "dragAndDrop" },
        columns: [
            //{ dataField: "OrderID", dataType: "number"},
            { dataField: "Store", caption: $translate.instant('callcenterreports.Store'), dataType: "string" },
            { dataField: "OrderDate", caption : $translate.instant('callcenterreports.OrderDate'),alignment: "right", dataType: "date", }, 
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
            // groupItems: [
            //     // { column: "Inventory.name", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
            //     { column: "OrdersCount", summaryType: "count",  displayFormat: "{0}", alignByColumn: true },
            //     { column: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
              
            // ]
        },
        export: {
            enabled: true,
            fileName: "CALLCENTERSTOREREPORTS",
        },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("storeordersCtrl");
    });
};
