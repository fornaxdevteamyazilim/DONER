app.controller('productpricesCtrl', productpricesCtrl);
function productpricesCtrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService, $http,$modal) {
    $rootScope.uService.EnterController("productpricesCtrl");
    var ngurr = this;
    $scope.NGUserRoleID = '';

    $scope.translate = function () {
        $scope.trUserRole = $translate.instant('main.USERROLE');
        $scope.trUserRestriction = $translate.instant('main.USERRESTRICTIONS');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });

    $scope.storeGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxProductPrices",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxProductPrices",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxProductPrices",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxProductPrices",
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
            allowUpdating: true,
            allowDeleting: false,
            allowInserting: false
        },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [

            //{ dataField: "id", caption: "id",  allowEditing: false },
            {
                dataField: "name", dataType: "string", caption: $translate.instant('productprices.Name'), allowEditing: false,  
            },
            { dataField: "Description", caption: $translate.instant('productprices.Description'), dataType: "string", allowEditing: false, },
            { dataField: "Price", caption: $translate.instant('productprices.Price'), dataType: "number",  allowEditing: true,},
            { dataField: "Size", caption: $translate.instant('productprices.Size'), dataType: "string",allowEditing: false, },            
            { dataField: "tags", caption: $translate.instant('productprices.tags'), dataType: "string", allowEditing: false, stateStoring:false},
           
          
        
        ],
        export: { enabled: true, fileName: "productprices", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("productpricesCtrl");
    });
};