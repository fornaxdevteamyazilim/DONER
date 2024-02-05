'use strict';
app.controller('storesalesstatisticsCtrl', storesalesstatisticsCtrl);
function storesalesstatisticsCtrl($scope, $filter, $window, $stateParams, $interval, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("storesalesstatisticsCtrl");
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
                StoreID: $scope.StoreID

            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/salestatistics/storesalestatistics", { params: params })
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
            { dataField: "StoreName", caption: $translate.instant('smslist.Store'), dataType: "string" },
            { dataField: "AC", caption: $translate.instant('callcenterreports.AC'),  format: { type: "fixedPoint", precision: 2 } },
            { dataField: "Group1ProductCount", caption: $translate.instant('callcenterreports.Group1ProductCount'), dataType: "number"},
            { dataField: "Group1ProductRatio", caption: $translate.instant('callcenterreports.Group1ProductRatio'),dataType: "number", format: { type: "percent", precision: 2 }  },
            { dataField: "Group2ProductCount", caption: $translate.instant('callcenterreports.Group2ProductCount'), dataType: "number", format: { type: "percent", precision: 2 },visible: false },
            { dataField: "Group2ProductRatio", caption: $translate.instant('callcenterreports.Group2ProductRatio'), dataType: "number", format: { type: "percent", precision: 2 }, visible: false},
            { dataField: "GroupsAmounRatioNoVAT", caption: $translate.instant('callcenterreports.GroupsAmounRatioNoVAT'), dataType: "number", format: { type: "percent", precision: 2 }  },
            { dataField: "GroupsAmount", caption: $translate.instant('callcenterreports.GroupsAmountNoVAT'),  format: { type: "fixedPoint", precision: 2 } },
            { dataField: "OrdersCount", caption: $translate.instant('callcenterreports.OrdersCount'), dataType: "number" },
            { caption: $translate.instant('callcenterreports.OrdersAmountNoVAT'), dataField: "OrdersAmount",  format: { type: "fixedPoint", precision: 2 } },
        ],
        summary: {
            totalItems: [
                { column: "AC", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                { column: "Group1ProductCount", summaryType: "sum", displayFormat: "{0}" },
                { column: "Group1ProductRatio", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "%{0}", },
                { column: "Group2ProductCount", summaryType: "sum", displayFormat: "{0}" },
                { column: "Group2ProductRatio", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "%{0}", },
                { column: "GroupsAmounRatioNoVAT",  summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "%{0}",},
                { column: "GroupsAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺", },
                { column: "OrdersCount", summaryType: "sum", displayFormat: "{0}" },
                { column: "OrdersAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },

            ],
            groupItems: [
                // { column: "Inventory.name", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
                { column: "OrdersCount", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
                { column: "OrdersAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },

            ]
        },
        onCellPrepared: function (options) {
            if (options.rowType == 'data') {
                var fieldData = options.value;
                // if (options.rowType == 'data' && options.column.name && options.column.name.length > 5 && options.column.name == "TodayIncome") {
                //     var fieldData = options.value;
                //     var fieldHtml = "";
                //     if (options.row.data["TodayIncome"] != options.row.data["PrewWeekIncome"]) {
                //         options.cellElement.addClass((options.row.data["TodayIncome"] > options.row.data["PrewWeekIncome"]) ? "inc" : "dec");
                //         fieldHtml += "<div class='current-value'>" +
                //             "</div> <div class='diff'>" +
                //             parseInt(fieldData).toLocaleString() +
                //             "  </div>";
                //     }
                //     /* else {
                //         fieldHtml = fieldData.value;
                //     } */
                //     options.cellElement.html(fieldHtml);
                // }
                // if (options.column.name && options.column.name == "TodayIncome") {
                //     if (options.row.data["TodayIncome"] != options.row.data["PrewWeekIncome"]) {

                //         if (options.row.data["TodayIncome"] < options.row.data["PrewWeekIncome"])
                //             options.cellElement.css({ 'color': '#f00' });
                //         else
                //             options.cellElement.css({ 'color': '#2ab71b' });
                //     }

                // }
                if (options.column.name && options.column.name == "Group1ProductRatio") {
                    if (options.row.data["Group1ProductRatio"] != options.row.data["Group1ProductCount"]) {

                        if (options.row.data["Group1ProductRatio"] < options.row.data["Group1ProductCount"])
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "Group1ProductRatio") {
                    if (options.row.data["Group1ProductRatio"] != 0) {

                        if (options.row.data["Group1ProductRatio"] < 0)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "GroupsAmounRatioNoVAT") {
                    if (options.row.data["GroupsAmounRatioNoVAT"] != options.row.data["Group1ProductCount"]) {

                        if (options.row.data["GroupsAmounRatioNoVAT"] < options.row.data["Group1ProductCount"])
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "GroupsAmounRatioNoVAT") {
                    if (options.row.data["GroupsAmounRatioNoVAT"] != 0) {

                        if (options.row.data["GroupsAmounRatioNoVAT"] < 0)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
            }
        },
        export: {
            enabled: true,
            fileName: "STORESALESSTATISTICS",
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
       // dataGrid.refresh();
    };
    // var refreshData = function () {
    //     var dataGrid = $('#gridContainer').dxDataGrid('instance');
    //     dataGrid.refresh();
    // }
    // $scope.start = function () {
    //     $scope.stop();
    //     promise = $interval(refreshData, 60000);
    // };

    // $scope.stop = function () {
    //     $interval.cancel(promise);
    // };
    // $scope.start();
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("storesalesstatisticsCtrl");
    });
};
