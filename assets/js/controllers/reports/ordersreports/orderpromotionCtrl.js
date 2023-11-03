'use strict';
app.controller('orderpromotionCtrl', orderpromotionCtrl);
function orderpromotionCtrl($scope, $filter, $window, $stateParams, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("orderpromotionCtrl");
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
                OrderStateID: (!$scope.OrderStateID) ? '' : $scope.OrderStateID,
                StoreID: $scope.StoreID
               
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/order/reports/orderpromotions", { params: params })
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
            //{ dataField: "OrderID", dataType: "number"},
            { dataField: "StoreName", caption: $translate.instant('orderpromotions.StoreName'), dataType: "string" },
            { dataField: "OperationDate", caption : $translate.instant('orderpromotions.OperationDate'),alignment: "right", dataType: "date", format: 'dd-MM-yyyy HH:mm' }, 
            { dataField: "OrderNumber", caption: $translate.instant('orderpromotions.OrderNumber'), dataType: "string" },
            { dataField: "Promotion", caption: $translate.instant('orderpromotions.Promotion'), dataType: "string" },
            { caption: $translate.instant('orderpromotions.Amount'), dataField: "Amount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
           { caption: $translate.instant('orderpromotions.OrderAmount'), dataField: "OrderAmount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('orderpromotions.Code'),dataField: "Code", dataType: "string" },
,
        ],
        summary: {
            totalItems: [
                // { column: "Inventory.name", summaryType: "count", displayFormat: "{0}" },
                // { column: "Units", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                // { column: "UnitCount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                { column: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "Amount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
            ],
            groupItems: [
                // { column: "Inventory.name", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
                { column: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "Amount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺", alignByColumn: true },
            ]
        },
        export: {
            enabled: true,
            fileName: "OrderPromotion",
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
        $rootScope.uService.ExitController("orderpromotionCtrl");
    });
};