'use strict';
app.controller('maindashboardCtrl', maindashboardCtrl);
function maindashboardCtrl($scope, $filter, $modal, $log, Restangular, localStorageService, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING) {
    if (!$rootScope.ReportParameters.StartDate) {
        $rootScope.ReportParameters.StartDate = moment().add(0, 'days').format('YYYY-MM-DD ');//$filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    $scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();
    $scope.TableData = [];
    $scope.VeiwHeader = {};
    $scope.orderTypeFilter="all";
    if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
        $location.path('/login/signin');
    }
    $scope.SetStoreTypeID = function (FromValue) {
        $scope.StoreTypeID = FromValue;
        $scope.selectedStoreType = $filter('filter')($scope.storetypes, { id: FromValue });
    };
 
    $scope.selectedStore = function (StoreID, Store) {
        var data = {};
        data.id = StoreID;
        data.name = Store;
        $rootScope.SelectedData = data;
        $location.path('/app/dashboard');
    };
    $scope.resetlayout = $translate.instant('main.RESETLAYOUT');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $("#sales").dxPivotGrid("instance").getDataSource().state({});
        }
    };
    
    $scope.pivotGridOptions = {
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        allowExpandAll: true,
        showDataFields: true,
        showRowFields: true,
        showColumnFields: true,
        showFilterFields: true,
        allowFieldDragging: true,
        rowHeaderLayout: 'tree',
        showTotalsPrior: "rows",
        visible: true,
        height: 600,
        showBorders: true,
        fieldChooser: {
            enabled: true
        },
        "export": {
            enabled: true,
            fileName: "dashboard"
        },
        scrolling: {
            mode: "virtual"
        },
        fieldPanel: {
            visible: true
        },
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "dx-dashboard-storing"
        },

        dataSource: {
            remoteOperations: true,
            fields: [   
                { caption: $translate.instant('turnoverbydaysreport.AmountWithVAT'), dataField: "AmountWithVAT", dataType: "number", summaryType: "sum", format: { type: "fixedPoint", precision: 2 }, area: "data" },
                { caption: $translate.instant('turnoverbydaysreport.Store'), width: 120, dataField: "Store", area: "row" },
                {caption: $translate.instant('fieldselector.AC_StoreIndex'), dataField: "AC_StoreIndex", area: "column" },           
                {caption: $translate.instant('fieldselector.Amount'), dataField: "Amount", area: "column" },           
                {caption: $translate.instant('fieldselector.Carrier'), dataField: "Carrier", area: "column" },           
                {caption: $translate.instant('fieldselector.Day'), dataField: "Day", area: "column" },           
                {caption: $translate.instant('fieldselector.GrossAmount'), dataField: "GrossAmount", area: "column" },                           
                {caption: $translate.instant('fieldselector.Hour'), dataField: "Hour", area: "column" },           
                {caption: $translate.instant('fieldselector.MonthName'), dataField: "MonthName", area: "column" },           
                {caption: $translate.instant('fieldselector.MonthNumber'), dataField: "MonthNumber", area: "column" },           
                {caption: $translate.instant('fieldselector.OperationDate'), dataField: "OperationDate", area: "column" },           
                {caption: $translate.instant('fieldselector.OrderSource'), dataField: "OrderSource", area: "column" }, 
                {caption: $translate.instant('fieldselector.OrderType'), dataField: "OrderType", area: "column" },           
                {caption: $translate.instant('fieldselector.PaymenType'), dataField: "PaymenType", area: "column" },           
                {caption: $translate.instant('fieldselector.ROPStoreID'), dataField: "ROPStoreID", area: "column" },
                {caption: $translate.instant('fieldselector.RegionManager'), dataField: "RegionManager", area: "column" },           
                {caption: $translate.instant('fieldselector.StoreID'), dataField: "StoreID", area: "column" },           
                {caption: $translate.instant('fieldselector.StoreType'), dataField: "StoreType", area: "column" },  
                
                {caption: $translate.instant('fieldselector.VAT'), dataField: "VAT", area: "column" },           
                {caption: $translate.instant('fieldselector.Week'), dataField: "Week", area: "column" },           
                {caption: $translate.instant('fieldselector.WeekDayName'), dataField: "WeekDayName", area: "column" },
                {caption: $translate.instant('fieldselector.WeekDayNumber'), dataField: "WeekDayNumber", area: "column" },           
                {caption: $translate.instant('fieldselector.Year'), dataField: "Year", area: "column" },           
                     

                ],
            store: DevExpress.data.AspNet.createStore({
                key: "id",
                loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxSaleStatistics",
                onBeforeSend: function (method, ajaxOptions) {

                    var authData = localStorageService.get('authorizationData');
                    if (authData) {
    
                        ajaxOptions.headers = {
                            Authorization: 'Bearer ' + authData.token//,
                            //'Content-type': 'application/json'
                        };
                    }
                }
              
            }),
            filter: getFilter(),
        }
    };

    function BuildUserStoresArray(src) {
        var result = [];
        
        if (src) {
            for (var i = 0; i < src.length; i++) {
                result.push(["StoreID", "=", src[i].id]);
                if (src.length > 0)
                    result.push("or");
            }
        }
        else
       
            return null;
        return result;
    }
    function getFilter() { //"and",["!",["OrderType","=",""]]
        var filter=[["OperationDate", ">=", $rootScope.ReportParameters.StartDate], "and", ["OperationDate", "<=", $rootScope.ReportParameters.EndDate]];
        if ($scope.orderTypeFilter!="all"){
            filter=[["OperationDate", ">=", $rootScope.ReportParameters.StartDate], "and", ["OperationDate", "<=", $rootScope.ReportParameters.EndDate],"and",["PaymenType","=",$scope.orderTypeFilter]];
        }
        return filter;
        
        
    }

    $scope.StoreTypeID = -1;
    $scope.LoadData = function () {
        var pivot = $("#sales").dxPivotGrid('instance');
        var pivotDS = pivot.getDataSource();
        if ($scope.StoreID ) {
            pivotDS.filter(getFilter());
        }
        else {
            pivotDS.filter(getFilter());
        }
        pivotDS.reload();
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

    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.ordersources = [];
    $scope.loadEntities('ordersource', 'ordersources');
    $scope.storetypes = [];
    $scope.loadEntities('enums/storetype', 'storetypes');
    $scope.StoreType = "-1";
    $scope.GetStoreType = function (data) {
        $scope.StoreTypeID = data;
        $scope.selectedType = $filter('filter')($scope.storetypes, { Value: data });
    };
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
    });
};
