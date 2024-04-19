app.controller('storenotelistCtrl', storenotelistCtrl);
function storenotelistCtrl($scope, $log, $modal, Restangular, ngTableParams, localStorageService, SweetAlert, toaster, $window, $rootScope, $filter, ngnotifyService, $element, $location, userService, $timeout, $translate, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("storenotelistCtrl");
    var id = this;
    userService.userAuthorizated();
    $scope.item = {};

    var store = new DevExpress.data.CustomStore({
        key: "id",
        load: function (loadOptions) {
            var params = {
               
                pageSize: 1000,
                pageNo: 1,
               };
            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/store", { params: params })
                .then(function (response) {
                    return {
                        data: response.data.Items,
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
        hoverStateEnabled: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        headerFilter: { visible: true },
        searchPanel: { visible: true },
        // stateStoring: {
        //     enabled: true,
        //     type: "custom",
        //     customLoad: function () {
        //         return $scope.params.gridState;
        //     },
        //     customSave: function (state) {
        //         $scope.params.gridState = state;
        //     }
        // },
        //stateStoring: {
        //    enabled: true,
        //    type: "localStorage",
        //    storageKey: "storage"
        //},
        columns: [
         
           { caption: $translate.instant('storenotelist.name'), dataField: "name", dataType: "string" },
            { caption: $translate.instant('storenotelist.StoreAddress'), dataField: "StoreAddress", dataType: "string" },
            { caption: $translate.instant('storenotelist.notes'), dataField: "notes", dataType: "string" },
            { dataField: "OperationDate", caption : $translate.instant('storenotelist.OperationDate'),alignment: "right", dataType: "date", format: 'dd.MM.yyyy HH:mm'}, 
            { caption: $translate.instant('storenotelist.ServiceTime'), dataField: "ServiceTime", dataType: "string" },
            { caption: $translate.instant('storenotelist.ServiceTimeTKW'), dataField: "ServiceTimeTKW",dataType: "string"  },
      
            
          
  
       
        ],
        summary: {
            totalItems: [
              
                { column: "name", summaryType: "count", displayFormat: "{0}" },
                { column: "GrandTotal", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },

            ],
            groupItems: [
                // { column: "Inventory.name", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
                { column: "OrdersCount", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
                { column: "GrandTotal", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },

            ]
        },
        export: {
            enabled: true,
            fileName: "storenotelist",
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
        height: 600,
        paging: {
            enabled: true
        },
    
    };

    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("storenotelistCtrl");
    });
};
