'use strict';
app.controller('orderpaymentsCtrl', orderpaymentsCtrl);
function orderpaymentsCtrl($scope, $filter, $window, $stateParams, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q,localStorageService) {
    $rootScope.uService.EnterController("orderpaymentsCtrl");
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
      value: new Date().addDays(0),
      labelLocation: "top", // or "left" | "right"
    },
    toDate: {
      max: new Date(),
      min: new Date(2019, 0, 1),
      displayFormat: "dd.MM.yyyy",
      bindingOptions: {
        value: "DateRange.toDate.value",
      },
      value: new Date().addDays(1),
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
        return [["OrderDate", ">=", $scope.DateRange.fromDate.value], "and", ["OrderDate", "<=", $scope.DateRange.toDate.value]];
    }
    $scope.StoreID;
    var store = new DevExpress.data.CustomStore({
         //key: "StoreID",
        load: function () {
            var params = {
                StartDate: $scope.DateRange.fromDate.value,
                EndDate: $scope.DateRange.toDate.value,
                PaymentTypeID: ($scope.PaymentTypeID) ? $scope.PaymentTypeID : '',
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,
               
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/order/reports/orderpayments", { params: params })
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
            { dataField: "OrderID", dataType: "number"},
            // { dataField: "StoreName", caption: $translate.instant('callcenterreports.StoreName'), dataType: "string",
            // lookup: {
            //     valueExpr: "id",
            //     displayExpr: "name",
            //     searchMode:"contains",
            //     dataSource: {
            //         store: DevExpress.data.AspNet.createStore({
            //             key: "id",
            //             loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStore" 
            //         }),
            //         sort: "name",
            //         headerFilter: { allowSearch: true }
            //     },
            //     calculateSortValue: function (data) {
            //         var value = this.calculateCellValue(data);
            //         return this.lookup.calculateCellValue(value);
            //     }  
            // }, },
            { dataField: "Order.OrderNumber", caption: $translate.instant('callcenterreports.OrderNumber'), dataType: "string" },
            { dataField: "Order.OrderDate", caption : $translate.instant('callcenterreports.OrderDate'),alignment: "right", dataType: "date", format: 'dd-MM-yyyy HH:mm' }, 
            { dataField: "Order.OrderTypeID", caption: $translate.instant('callcenterreports.ordertype'), dataType: "string" ,displayExpr: "name",},
            { dataField: "Order.Discounts", caption: $translate.instant('callcenterreports.Discounts'), dataType: "string" },
            { dataField: "Order.PaymentStatusID", caption: $translate.instant('callcenterreports.PendingPaymentStatus'), dataType: "string" },
            { dataField: "PaymentType", caption: $translate.instant('callcenterreports.PaymentType'), dataType: "string" },
            { dataField: "PaymentDate", caption : $translate.instant('callcenterreports.PaymentDate'),alignment: "right", dataType: "date", format: 'dd-MM-yyyy HH:mm' }, 
            { caption: $translate.instant('callcenterreports.Amount'), dataField: "Amount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
        ],
        summary: {
            totalItems: [
              
                //{ column: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "Amount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
            ],
            groupItems: [
                //{ column: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
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
        $rootScope.uService.ExitController("orderpaymentsCtrl");
    });
};