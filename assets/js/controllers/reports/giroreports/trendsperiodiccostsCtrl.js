'use strict';
app.controller('trendsperiodiccostsCtrl', trendsperiodiccostsCtrl);
function trendsperiodiccostsCtrl($scope, $filter, $modal, $http, $q, userService , $log, Restangular, ngTableParams, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING) {
    $rootScope.uService.EnterController("trendsperiodiccostsCtrl");
    if (!$rootScope.ReportParameters.StartDate) {
        $rootScope.ReportParameters.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    if (!$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.EndDate = moment().add(0, 'days').format('YYYY-MM-DD ');
    }
    $scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();
    if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
        $location.path('/login/signin');
    };
    $scope.StoreTypeID = -1;

    $scope.FromDate = function (item) {
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
            $rootScope.ReportParameters.StartDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.ToDate = function (item) {
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
            $rootScope.ReportParameters.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    if (userService.userAuthorizated()) {
        Restangular.all('report').getList(
       {
           search: "number='013'"
       }).then(function (result) {
           $scope.VeiwHeader = result[0];
       }, function (response) {
           toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
       });
    }
    $scope.StoreType = "-1";
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.resetButtonOptions = {
        text: 'Reset',
        onClick: function () {
            $("#sales").dxDataGrid("instance").getDataSource().state({});
        }
    };
    $scope.Back = function () {
        $window.history.back();
    };
    if ($rootScope.user.userstores && $rootScope.user.userstores.length > 1) {
        $scope.selectStore = true;
        $scope.StoreID = '';
    }
    else {
        $scope.StoreID = $rootScope.user.StoreID;
    }
    $scope.SetStoreID = function (FromValue) {
        $scope.StoreID = FromValue;
        $scope.selectedStore = $filter('filter')($scope.stores, { id: FromValue });

    };
    $scope.StoreID;
    $scope.resresult = [];
    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');

        dataGrid.refresh();
    }
    var store = new DevExpress.data.CustomStore({
       // key: "id",
        load: function (loadOptions) {
            var params = {
                fromDate: $scope.ReportParameters.StartDate,
                toDate: $scope.ReportParameters.EndDate,
                StoreID: $scope.StoreID,
                StoreType: $scope.StoreTypeID,
                ActiveStoresOnly:0
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/dashboard/inventorycosts", { params: params })
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
    $scope.pivotGridOptions = {
        dataSource: store,
        //filterValue: getFilter(),
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: false,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        //filterPanel: { visible: true },
        headerFilter: { visible: true },
        grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        //remoteOperations: true,
        filter: getFilter(),
        columns: [
            {
                dataField: "StoreID", caption: $translate.instant('AggregatorStoreStatus.StoreID'), width: 200,  area: "row",  
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    searchMode:"contains",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStore" 
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }  
                },
                allowEditing: false, 
                //fixed: true,
                //groupIndex: 0
            },

             { dataField: "Ideal", caption:  "ideal(%)", name: "Ideal", dataType: "number", format: { type: "percent", precision: 2 }},
             { dataField: "FoodCost", caption:  "İdeal(₺)", name: "FoodCost",  format: { type: "fixedPoint", precision: 0 },visible: true },
             { caption:  "Gerçekleşen(%)", dataField: "Real", dataType: "number", name: "Real", format: { type: "fixedPoint", precision: 0 },},
             { caption: "Gerçekleşen(₺)", dataField: "RealFoodCost", dataType: "number", },
             { caption: "FromDate", dataField: "FromDate", dataType: "date", },
             { caption: "ToDate", dataField: "ToDate", dataType: "date", },
            { dataField: "SalesTotal", caption: "Toplam Satış", format: { type: "fixedPoint", precision: 0 },visible: true },
         ],
         summary: {
            totalItems: [{ column: "Store", summaryType: "count", displayFormat: "{0}" },
            { column: "Ideal", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "FoodCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            ],
            groupItems: [
                { column: "Store", summaryType: "count", displayFormat: "{0}" },
                { column: "Ideal", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "FoodCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
              
            ],
        },
        onCellPrepared: function (options) {
            if (options.rowType == 'data') {
                var fieldData = options.value;
                if (options.rowType == 'data' && options.column.name && options.column.name.length > 5 && options.column.name == "Ideal") {
                    var fieldData = options.value;
                    var fieldHtml = "";
                    if (options.row.data["Ideal"] != options.row.data["PrewWeekIncome"]) {
                        options.cellElement.addClass((options.row.data["Ideal"] > options.row.data["PrewWeekIncome"]) ? "inc" : "dec");
                        fieldHtml += "<div class='current-value'>" +
                            "</div> <div class='diff'>" +
                            parseInt(fieldData).toLocaleString() +
                            "  </div>";
                    }
                    /* else {
                        fieldHtml = fieldData.value;
                    } */
                    options.cellElement.html(fieldHtml);
                }
                // if (options.column.name && options.column.name == "Ideal") {
                //     if (options.row.data["Ideal"] != options.row.data["PrewWeekIncome"]) {

                //         if (options.row.data["Ideal"] < options.row.data["PrewWeekIncome"])
                //             options.cellElement.css({ 'color': '#f00' });
                //         else
                //             options.cellElement.css({ 'color': '#2ab71b' });
                //     }

                // }
                
                if (options.column.name && options.column.name == "FoodCost") {
                    if (options.row.data["FoodCost"] != options.row.data["PrewWeekTC"]) {

                        if (options.row.data["FoodCost"] < options.row.data["PrewWeekTC"])
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
              
            }
        },
       
        export: {
            enabled: true,
            fileName: "routedorders",
            customizeExcelCell: (options) => {
                var gridCell = options.gridCell;
                if (!gridCell) {
                    return;
                }
                if (gridCell.rowType === 'data') {
                    if (gridCell.data.Delta === true) {
                        options.font.bold = true;
                        options.backgroundColor = '#FFBB00';
                    }
                }
            }
        },
        scrolling: { mode: "virtual" },
        height: 600
        //scrolling: {
        //    columnRenderingMode: "virtual"
        //},
        //paging: {
        //    enabled: false
        //}
    };

    function getFilter() { //"and",["!",["OrderType","=",""]]
        var filter=[["FromDate", ">=", $rootScope.ReportParameters.StartDate], "and", ["FromDate", "<=", $rootScope.ReportParameters.EndDate]];
        if ($scope.orderTypeFilter!="all"){
            filter=[["FromDate", ">=", $rootScope.ReportParameters.StartDate], "and", ["FromDate", "<=", $rootScope.ReportParameters.EndDate],"and",["PaymenType","=",$scope.orderTypeFilter]];
        }
        return filter;
        
    };

    $scope.getFilters = function(filter) { 
        var today = new Date();
        if (filter === 'yesterday') {
            $rootScope.ReportParameters.StartDate = $filter('date')(new Date(today.getFullYear(), today.getMonth(), today.getDate()-1), 'yyyy-MM-dd');
            $rootScope.ReportParameters.EndDate = $filter('date')(new Date(today.getFullYear(), today.getMonth(), today.getDate() -1), 'yyyy-MM-dd');
        } else if (filter === 'today') {
            $rootScope.ReportParameters.StartDate = $filter('date')(new Date(today.getFullYear(), today.getMonth(), today.getDate()), 'yyyy-MM-dd');
            $rootScope.ReportParameters.EndDate = $filter('date')(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999), 'yyyy-MM-dd');
        } else if (filter === 'lastWeek') {
            $rootScope.ReportParameters.StartDate = $filter('date')(new Date(today.setDate(today.getDate() - today.getDay() - 7)), 'yyyy-MM-dd');
            $rootScope.ReportParameters.EndDate  = $filter('date')(new Date(today.setDate(today.getDate() + 6)), 'yyyy-MM-dd');
        } else if (filter === 'thisWeek') {
            $rootScope.ReportParameters.StartDate = $filter('date')(new Date(today.setDate(today.getDate() - today.getDay())), 'yyyy-MM-dd');
            $rootScope.ReportParameters.EndDate  = $filter('date')(new Date(today.setDate(today.getDate() + (6 - today.getDay()))), 'yyyy-MM-dd');
        } else if (filter === 'lastMonth') {
            $rootScope.ReportParameters.StartDate = $filter('date')(new Date(today.getFullYear(), today.getMonth() - 1, 1), 'yyyy-MM-dd');
            $rootScope.ReportParameters.EndDate  = $filter('date')(new Date(today.getFullYear(), today.getMonth(), 0), 'yyyy-MM-dd');
        } else if (filter === 'thisMonth') {
            $rootScope.ReportParameters.StartDate = $filter('date')(new Date(today.getFullYear(), today.getMonth(), 1), 'yyyy-MM-dd');
            $rootScope.ReportParameters.EndDate  = $filter('date')(new Date(today.getFullYear(), today.getMonth() + 1, 0), 'yyyy-MM-dd');
        } else if (filter === 'last3Months') {
            $rootScope.ReportParameters.StartDate = $filter('date')(new Date(today.getFullYear(), today.getMonth() - 3, 1), 'yyyy-MM-dd');
            $rootScope.ReportParameters.EndDate  = $filter('date')(new Date(today.getFullYear(), today.getMonth(), 0), 'yyyy-MM-dd');
        } else if (filter === 'last6Months') {
            $rootScope.ReportParameters.StartDate = $filter('date')(new Date(today.getFullYear(), today.getMonth() - 6, 1), 'yyyy-MM-dd');
            $rootScope.ReportParameters.EndDate  = $filter('date')(new Date(today.getFullYear(), today.getMonth(), 0), 'yyyy-MM-dd');
        } else if (filter === 'thisYear') {
            $rootScope.ReportParameters.StartDate = $filter('date')(new Date(today.getFullYear(), 0, 1), 'yyyy-MM-dd');
            $rootScope.ReportParameters.EndDate = $filter('date')(new Date(today.getFullYear(), 11, 31), 'yyyy-MM-dd');
        } else {
            $rootScope.ReportParameters.StartDate  = $filter('date')(new Date(), 'yyyy-MM-dd');
            $rootScope.ReportParameters.EndDate  = $filter('date')(new Date(), 'yyyy-MM-dd');
        }
        $scope.LoadData();
    };
    $scope.StoreTypeID = -1;

    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container] || !$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
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
    $scope.storetypes = [];
    $scope.loadEntities('enums/storetype', 'storetypes');
    $scope.StoreType = "-1";
    $scope.GetStoreType = function (data) {
        $scope.StoreTypeID = data;
        $scope.selectedType = $filter('filter')($scope.storetypes, { Value: data });
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("trendsperiodiccostsCtrl");
    });
};
