"use strict";
app.controller("aggregatorordersrawdatareportCtrl", aggregatorordersrawdatareportCtrl);
function aggregatorordersrawdatareportCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, localStorageService, $q, $http) {
    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();

    if (
        !$rootScope.user ||
        !$rootScope.user.UserRole ||
        !$rootScope.user.UserRole.Name
    ) {
        $location.path("/login/signin");
    }
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
    $scope.isInitialized = false;
    $scope.reportButtonOptions = {
        text: $translate.instant("reportcommands.GetData"),
        onClick: function () {
            var dataGrid = $("#gridContainer").dxDataGrid("instance");
            if (!$scope.isInitialized) {
                dataGrid.option(
                    "dataSource",
                    new DevExpress.data.AspNet.createStore({
                        key: "id",
                        loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxAggregatorOrdersCheckList",
                        onBeforeSend: function (method, ajaxOptions) {
                            var authData = localStorageService.get('authorizationData');
                            if (authData) {

                                ajaxOptions.headers = {
                                    Authorization: 'Bearer ' + authData.token
                                };
                            }
                        },
                        remoteOperations: true,
                    })
                );
                $scope.isInitialized = true;
            }
            var gridDS = dataGrid.getDataSource();
            dataGrid.clearFilter();
            gridDS.filter(getFilter());
            dataGrid.refresh();
        },
    };
    function BuildUserStoresArray(src) {
        var result = [];
        if (src) {
            for (var i = 0; i < src.length; i++) {
                result.push(["StoreID", "=", src[i].id]);
                if (src.length > 0) result.push("or");
            }
        } else return null;
        return result;
    }
    function getFilter() {
        //"and",["!",["OrderType","=",""]]
        var fdate = new Date(
            $scope.DateRange.fromDate.value.getFullYear(),
            $scope.DateRange.fromDate.value.getMonth(),
            $scope.DateRange.fromDate.value.getDate()
        );
        var tdate = new Date(
            $scope.DateRange.toDate.value.getFullYear(),
            $scope.DateRange.toDate.value.getMonth(),
            $scope.DateRange.toDate.value.getDate()
        );

        if ($scope.StoreID) {
            return [
                [["OrderDate", ">=", fdate], "and", ["OrderDate", "<=", tdate]],
                "and",
                ["StoreID", "=", $scope.StoreID],
            ];
        } else {
            return [
                ["OrderDate", ">=", fdate],
                "and",
                ["OrderDate", "<=", tdate],
            ];
        }
    }
    $scope.gridOptions = {
        remoteOperations: true,
        columns: [
            { dataField: "id", caption: "MapID", width: 80 },
            { dataField: "AggregatorName", caption: "AggregatorName", width: 100 },
            { dataField: "AggregatorOrderID", width: 120 },
            { dataField: "OrderID", caption: "RopNg OrderID", width: 120 },
            { dataField: "AggregatorStore", caption: "AggregatorStore", width: 120 },
            { dataField: "CustomerName", width: 120 },
            { dataField: "AggregatorAddress", caption: "AggregatorAddress", width: 180 },
            { dataField: "AggregatorAddressDescription", caption: "AggregatorAddressDescription", width: 100 },
            { dataField: "AggregatorOrderNotes", caption: "AggregatorOrderNotes", width: 100 },
            { dataField: "Total", dataType: "number", caption: "Aggregator Total", format: { type: "fixedPoint", precision: 2 }, width: 100 },
            { dataField: "PaymentType", caption: "PaymentType", width: 100 },
            { dataField: "AggregatorOrderDate", caption: "AggregatorOrderDate", width: 0, format: "dd.MM.yyyy HH:mm", dataType: "date" },
            { dataField: "OrderStatus", caption: "OrderStatus", width: 100 },
            { dataField: "Addres", caption: "RopNg Address", width: 120 },
            { dataField: "AddresDescription", caption: "RopNg AddressDescription", width: 100 },
            { dataField: "OrderAmount", caption: "RopNg Total", width: 100, format: { type: "fixedPoint", precision: 2 }, width: 100 },
            { dataField: "OrderDate", caption: "OrderDate", width: 100, format: "dd.MM.yyyy HH:mm", dataType: "date" },

        ],
        filterRow: {
            visible: true,
        },
        headerFilter: {
            visible: true,
        },
        export: {
            enabled: true,
            fileName: "AggregatorOrdersRawDataReport",
        },
        scrolling: {
            mode: "virtual",
        },
        height: 600,
        showBorders: true,
        columnChooser: {
            enabled: true,
        },

    };
    $scope.getTabPanelOptions = function () {
        return {
            items: [{
                title: 'Order',
                template: 'ordersTab',
            }, {
                title: 'Items',
                template: 'orderitemsTab',
            }],
        };
    };

    $scope.LoadData = function () { };
    $scope.$on("$destroy", function () {
        $element.remove();
    });

    $scope.Back = function () {
        $window.history.back();
    };
}