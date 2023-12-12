'use strict';
app.controller('cumulativesalesCtrl', cumulativesalesCtrl);
function cumulativesalesCtrl($scope, $filter, $window, $stateParams, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("cumulativesalesCtrl");
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
            value: (new Date()).addDays(0),
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
    $scope.SetStoreTypeID = function (FromValue) {
        $scope.StoreTypeID = FromValue;
        $scope.selectedStoreType = $filter('filter')($scope.storetypes, { id: FromValue });
    };
    $scope.Time = ngnotifyService.ServerTime();
    $scope.data = [];
    $scope.StoreTypeID = -1;
    $scope.StoreID;
    var store = new DevExpress.data.CustomStore({
        //key: "id",
        load: function (loadOptions) {
            var params = {
                fordate: $scope.DateRange.fromDate.value,
                StoreTypeID: $scope.StoreTypeID,
                StoreID: $scope.StoreID


            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/extendedreports/cumulativesales", { params: params })
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

            { dataField: "Store", caption: $translate.instant('main.STORE'), },
            { dataField: "StoreRegion", caption: $translate.instant('main.STOREREGION'), },
            {

                caption: "Bu Hafta ", name: "Sales",
                columns: [
                    { dataField: "Amount_ForDate", caption: $translate.instant('main.AMOUNTFORDATE'), dataType: "number", name: "SalesCY", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "TC_ForDate", dataType: "number", caption: $translate.instant('main.TCFORDATE'), dataType: "number", name: "SalesCY", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "Amount_Week_Total", caption: $translate.instant('main.AMOUNTWEEKTOTAL'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "TC_Week_Total", caption: $translate.instant('main.TCWEEKTOTAL'), name: "TCWEEKTOTAL", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                   
                ]
            },
            {
                caption: "Aylik ", name: "Sales",
                columns: [
                    { dataField: "TC_Ratio_PrevMonth", dataType: "number", caption: $translate.instant('main.TCRATIOPREVMONTH'), dataType: "number", name: "SalesCY", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "TC_PrevMonth_Total", caption: $translate.instant('main.TCPREVMONTHTOTAL'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "TC_Month_Total", caption: $translate.instant('main.TCMONTHTOTAL'), name: "TCMONTHTOTAL", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "Amount_PrevMonth_Total", caption: $translate.instant('main.AMOUNTPREVMONTHTOTAL'), dataType: "number", name: "SalesCY", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "Amount_Ratio_PrevMonth", caption: $translate.instant('main.AMOUNTRATIOPREVMONTH'), dataType: "number", name: "SalesCY", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "Amount_Month_Total", caption: $translate.instant('main.AMOUNTMONTHTOTAL'), dataType: "number", name: "SalesCY", format: { type: "fixedPoint", precision: 2 } },

                ]
            },
            {

                caption: "Önceki Hafta", name: "Sales",
                columns: [
                    { dataField: "TC_Ratio_PrevWeek", dataType: "number", caption: $translate.instant('main.TCRATIOPREVWEEK'), dataType: "number", name: "SalesCY", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "TC_PrevWeek_SD", caption: $translate.instant('main.TCPREVWEEKSD'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "TC_Ratio_PrevWeek_SD", caption: $translate.instant('main.TCRATIOPREVWEEKSD'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "TC_PrevWeek_Total", caption: $translate.instant('main.TCPREVWEEKTOTAL'), name: "TCPREVWEEKTOTAL", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "Amount_Ratio_PrevWeek", caption: $translate.instant('main.AMOUNTRATIOPREVWEEK'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "Amount_Ratio_PrevWeek_SD", caption: $translate.instant('main.AMOUNTRATIOPREVWEEKSD'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "Amount_PrevWeek_SD", caption: $translate.instant('main.AMOUNTPREVWEEKSD'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "Amount_PrevWeek_Total", caption: $translate.instant('main.AMOUNTPREVWEEKTOTAL'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },

                ]
            },
            {

                caption: "Gecen Yil ", name: "Sales",
                columns: [
                    { dataField: "TC_PrevYear_SD", dataType: "number", caption: $translate.instant('main.TCPREVYEARSD'), dataType: "number", name: "SalesCY", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "TC_PrevYear_SM", caption: $translate.instant('main.TCPREVYEARSM'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "TC_Ratio_PrevYear_SD", caption: $translate.instant('main.TCRATIOPREVYEARSD'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "TC_Ratio_PrevYear_SM", dataType: "number", caption: $translate.instant('main.TCRATIOPREVYEARSM'), dataType: "number", name: "SalesCY", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "TC_Ratio_PrevYear_YTD", caption: $translate.instant('main.TCRATIOPREVYEARYTD'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "TC_Prev_YTD", caption: $translate.instant('main.TCPREVYTD'), name: "TCPREVYTD", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "TC_YTD", caption: $translate.instant('main.TCYTD'), name: "TC_YTD", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "Amount_PrevYear_SD", caption: $translate.instant('main.AMOUNTPREVYEARSD'),  dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "Amount_PrevYear_SM", caption: $translate.instant('main.AMOUNTPREVYEARSM'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "Amount_Ratio_PrevYear_SD", caption: $translate.instant('main.AMOUNTRATIOPREVYEARSD'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "Amount_Ratio_PrevYear_SM", caption: $translate.instant('main.AMOUNTRATIOPREVYEARSM'), dataType: "number", format: { type: "fixedPoint", precision: 2 }},
                    { dataField: "Amount_Ratio_Prev_YTD", caption: $translate.instant('main.AMOUNTRATIOPREVYTD'), dataType: "number", format: { type: "fixedPoint", precision: 2 }},
                    { dataField: "Amount_YTD", caption: $translate.instant('main.AMOUNTYTD'), name: "Amount_YTD", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "Amount_Prev_YTD", caption: $translate.instant('main.AMOUNTPREVYTD'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },

                ]
            },


        ],
        summary: {
            totalItems: [
                { column: "Amount_ForDate", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "TC_ForDate", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "Amount_Week_Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "TC_Week_Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "TC_Ratio_PrevMonth", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "%{0}" },
                { column: "TC_PrevMonth_Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "TC_Month_Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "Amount_PrevMonth_Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "Amount_Ratio_PrevMonth", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat:"%{0}" },
                { column: "Amount_Month_Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "TC_Ratio_PrevWeek", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "%{0}" },
                { column: "TC_PrevWeek_SD", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                
                { column: "TC_Ratio_PrevWeek_SD", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "%{0}" },
                { column: "TC_PrevWeek_Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "Amount_Ratio_PrevWeek", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "%{0}" },
                { column: "Amount_Ratio_PrevWeek_SD", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "%{0}" },
                { column: "Amount_PrevWeek_SD", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "Amount_PrevWeek_Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                

                { column: "TC_PrevYear_SD", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "TC_PrevYear_SM", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "TC_Ratio_PrevYear_SD", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "%{0}" },
                { column: "TC_Ratio_PrevYear_SM", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "TC_Ratio_PrevYear_YTD", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "TC_Prev_YTD", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },

                { column: "TC_YTD", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "Amount_PrevYear_SD", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "Amount_PrevYear_SM", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "Amount_Ratio_PrevYear_SD", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "%{0}" },
                { column: "Amount_Ratio_PrevYear_SM", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "%{0}" },
                { column: "Amount_Ratio_Prev_YTD", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "Amount_YTD", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "Amount_Prev_YTD", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" }

            ],
            groupItems: [
                // { column: "Inventory.name", summaryType: "count", displayFormat: "{0}₺", alignByColumn: true },
                { column: "OrdersCount", summaryType: "count", displayFormat: "{0}₺", alignByColumn: true },
                { column: "OrderAmount", summaryType: "sum", dataType: "number", format: { type: "fixedPoint", precision: 2 } },

            ]
        },
        export: {
            enabled: true,
            fileName: "cumulativesales",
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
        $rootScope.uService.ExitController("cumulativesalesCtrl");
    });
};
