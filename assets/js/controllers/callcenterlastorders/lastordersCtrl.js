'use strict';
app.controller('lastordersCtrl', lastordersCtrl);
function lastordersCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout,$interval, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
    var promise;
    var store = new DevExpress.data.CustomStore({
       // key: "StoreID",
        load: function (loadOptions) {
            var params = {
                // pageNo: 1,
                // pageSize: 10,
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/ccstats/lastorders", { params: params })
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
        filterPanel: { visible: true },
        headerFilter: { visible: true },
        grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        //remoteOperations: true,
        columns: [
            { caption: "Order ID", dataField: "OrderID" },
              { type: "buttons", width: 50, buttons: [{ hint: "edit", icon: "edit", onClick: function (e) { location.href = '#/app/orders/orderDetail/' + e.row.data.OrderID; } }] },
            { caption: $translate.instant('lastorders.TakenBy'), dataField: "TakenBy" },
            { caption: $translate.instant('lastorders.Store'), dataField: "Store", },
            { caption: $translate.instant('lastorders.TakeDateTime'), dataField: "TakeDateTime", dataType: "date", format: 'dd.MM.yyyy HH:mm:ss',  },
            { caption: $translate.instant('lastorders.AddressType'), dataField: "AddressType" },
            { caption: $translate.instant('lastorders.Person'), dataField: "PersonName" },
            { caption: $translate.instant('lastorders.Address'), dataField: "Address" },
            { caption: $translate.instant('lastorders.Phone'), dataField: "Phone" },
            { caption: $translate.instant('lastorders.OrderAmount'), dataField: "OrderAmount", alignment: "right", format: { type: "fixedPoint", precision: 2 } },
        ],
        summary: {
            totalItems: [{ column: "OrderID", summaryType: "count", displayFormat: "{0}" },
            { column: "OrderNumber", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
            { column: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true }
            ],
            groupItems: [{ column: "id", summaryType: "count", displayFormat: "{0}" },
            { column: "OrderNumber", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
            { column: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true }
            ]
        },

        onRowPrepared: function (e) {
            if (e.rowType === 'OrderAmount') {
                if (e.data.Delta === true) {
                    //e.rowElement.addClass('place');
                    e.rowElement.css({ 'font-weight': 'bold', 'background': '#ebb3af' });
                }
                //else {
                //    e.data.place = "";
                //}
            }
        },
        export: {
            enabled: true,
            fileName: "lastorders",
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
        promise = $interval(refreshData, 30000);
    };

    $scope.stop = function () {
        $interval.cancel(promise);
    };
    $scope.start();
    $scope.$on('$destroy', function () {
       // $scope.stop();
       // deregistration();
       // $element.remove();
        $rootScope.uService.ExitController("lastordersCtrl");
    });
   // $scope.start();
}