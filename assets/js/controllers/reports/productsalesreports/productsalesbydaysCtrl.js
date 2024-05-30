'use strict';
app.controller('productsalesbydaysCtrl', productsalesbydaysCtrl);
function productsalesbydaysCtrl($scope, $filter, $window, $stateParams, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("productsalesbydaysCtrl");
    $scope.Time = ngnotifyService.ServerTime();
    if (userService.userIsInRole("Admin") || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("LC") || userService.userIsInRole("AREAMANAGER") || userService.userIsInRole("ACCOUNTING") || userService.userIsInRole("PH") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("OperationDepartment") || userService.userIsInRole("FinanceDepartment")) {
        $scope.StoreID = '';
        $scope.ShowStores = true;
    } else {
        $scope.StoreID = $rootScope.user.StoreID;
    }
    $scope.SetStoreID = function (FromValue) {
        $scope.StoreID = FromValue;
        $scope.selectedStore = $filter('filter')($scope.stores, { id: FromValue });

    };
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
                StoreID: $scope.StoreID,
                OrderType: ($scope.OrderTypeID == null) ? -1 : $scope.OrderTypeID
            };

            return $http.post(NG_SETTING.apiServiceBaseUri + "/api/extendedreports/productstatistics", { params: params })
                .then(function (response) {
                  
                    return {
                        data: response.data,
                        totalCount: 10
                    };
                }, function (response) {
                    return (response.data.ExceptionMessage) ? $q.reject(response.data.ExceptionMessage) : $translate.instant('InventoryRequirmentItem.Calculatingrequirments')
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
        noDataText: $translate.instant('InventoryRequirmentItem.Calculatingrequirments'),
       // columnChooser: { enabled: true, mode: "dragAndDrop" },
        columns: [
            // { dataField: "id", dataType: "number", onClick: function (e) { location.href = '#/app/inventory/inventorydeliveries/edit/' + e.row.data.id; }},
            // { dataField: "StoreName", caption: $translate.instant('productsalesbydays.Store'), dataType: "string" },
            // { dataField: "DocumentNumber", caption: $translate.instant('productsalesbydays.DocumentNumber'), dataType: "string" },
            // { dataField: "CompanyName", caption: $translate.instant('productsalesbydays.CompanyName'), dataType: "string" },

            // { dataField: "Description", caption: $translate.instant('productsalesbydays.Description'), dataType: "number" },
         

            // { dataField: "Amount", caption: $translate.instant('productsalesbydays.Amount'), dataType: "number" },
            // { dataField: "VAT", caption: $translate.instant('productsalesbydays.VAT'), dataType: "string" },
            // { dataField: "GrandTotal", caption: $translate.instant('productsalesbydays.GrandTotal'), dataType: "number" },
            
            // { dataField: "DeliveryDate", caption : $translate.instant('productsalesbydays.DeliveryDate'),alignment: "right", dataType: "date", format: 'dd.MM.yyyy HH:mm'}, 
            // { dataField: "PaymentTerm", caption: $translate.instant('productsalesbydays.PaymentTerm'), dataType: "number" },
            // { dataField: "PaymentDate", caption : $translate.instant('productsalesbydays.PaymentDate'),alignment: "right", dataType: "date", format: 'dd.MM.yyyy HH:mm'}, 
      

            // { dataField: "isPaid", caption: $translate.instant('productsalesbydays.isPaid'), dataType: "number" },
       
            // { dataField: "CompanyPaymentTerm", caption: $translate.instant('productsalesbydays.CompanyPaymentTerm'), dataType: "number" },
            { dataField: "StoreName", caption: $translate.instant('productsalesbydays.StoreName'), dataType: "string" },
            { dataField: "ProductName", caption: $translate.instant('productsalesbydays.ProductName'), dataType: "string" },
            { dataField: "Quantity", caption: $translate.instant('productsalesbydays.Quantity'), dataType: "string" },

          
         

            { dataField: "Amount", caption: $translate.instant('productsalesbydays.Amount'), dataType: "number" },
            { dataField: "OrderType", caption: $translate.instant('productsalesbydays.OrderType'), dataType: "string" },
            { dataField: "OrderSource", caption: $translate.instant('productsalesbydays.OrderSource'), dataType: "number" },
            
            { dataField: "OperationDate", caption : $translate.instant('productsalesbydays.OperationDate'),alignment: "right", dataType: "date", format: 'dd.MM.yyyy HH:mm'}, 
         


            
          
          
            
        ],
        // summary: {
        //     totalItems: [
        //          { column: "OrdersCountTKW", summaryType: "sum", displayFormat: "{0}" },
        //          { column: "OrdersAmountTKW", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
        //          { column: "OrdersCountDelivery", summaryType: "sum",  displayFormat: "{0}" },
        //          { column: "OrdersAmountDelivery", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
        //         { column: "OrdersCount", summaryType: "sum",  displayFormat: "{0}" },
        //         { column: "OrdersAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                
        //     ],
        //     groupItems: [
        //         // { column: "Inventory.name", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
        //         { column: "OrdersCount", summaryType: "count",  displayFormat: "{0}", alignByColumn: true },
        //         { column: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
              
        //     ]
        // },
        export: {
            enabled: true,
            fileName: "productsalesbydays",
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
        $rootScope.uService.ExitController("productsalesbydaysCtrl");
    });
};
