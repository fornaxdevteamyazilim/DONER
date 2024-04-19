app.controller('InventoryUnitsControllerCtrl', InventoryUnitsControllerCtrl);
function InventoryUnitsControllerCtrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService, $http, $window, $stateParams, Restangular, toaster, $filter) {
    $rootScope.uService.EnterController("InventoryUnitsControllerCtrl");
    $scope.translate = function () {
        //$scope.trNGUser = $translate.instant('main.USER');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.storeGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
           // key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxInventoryUnits",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxInventoryUnits",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxInventoryUnits",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxInventoryUnits",
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
        //filterValue: getFilter(),
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        filterPanel: { visible: true },
        headerFilter: { visible: true },
        //grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        //groupPanel: { visible: true },
        editing: {
            allowAdding: false,
            allowUpdating: false,
            allowDeleting: false,
            allowInserting: false
        },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: true,
        // stateStoring: {
        //     enabled: true,
        //     type: "localStorage",
        //     storageKey: "dx-InventoryUnits-storing"
        // },
        columns: [
            { caption: $translate.instant('InventoryUnits.BaseUnit'), dataField: "BaseUnit", dataType: "string" },
            { caption: $translate.instant('InventoryUnits.InventoryGroup'), dataField: "InventoryGroup", dataType: "string" },
            { caption: "ItemCode", dataField: "ItemCode", dataType: "string" },
            { caption: $translate.instant('InventoryUnits.InventoryName'), dataField: "InventoryName", dataType: "string" },
          // { caption: $translate.instant('inventorydeal.InventoryUnitID'), dataField: "InventoryUnitID", dataType: "string" },
            { caption: $translate.instant('InventoryUnits.InventoryUnitName'), dataField: "InventoryUnitName", dataType: "string" },
       
        ],
   
        
        onRowClick: function (rowInfo) {
            if (rowInfo.rowType == "data")
                rowInfo.component.editRow(rowInfo.rowIndex);
        },
        export: { enabled: true, fileName: "InventoryUnits", },
        scrolling: { mode: "virtual" },
        height: 600
    };


    $scope.Back = function () {
        $window.history.back();
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("InventoryUnitsControllerCtrl");
    });
}