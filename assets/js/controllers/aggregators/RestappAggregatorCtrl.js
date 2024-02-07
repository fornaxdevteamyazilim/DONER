app.controller('RestappAggregatorCtrl', RestappAggregatorCtrl);
function RestappAggregatorCtrl($rootScope, $scope, NG_SETTING, $translate, $element, localStorageService, $http, $window, $stateParams, Restangular, toaster, $filter) {
    $rootScope.uService.EnterController("RestappAggregatorCtrl");
    $scope.translate = function () {
        //$scope.trNGUser = $translate.instant('main.USER');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.storeGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappStore",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappStore",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappStore",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappStore",
            onBeforeSend: function (method, ajaxOptions) {ajaxOptions.headers = {Authorization: 'Bearer ' + localStorageService.get('authorizationData').token};}
        }),
        //filterValue: getFilter(),
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
        //grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        //groupPanel: { visible: true },
        editing: {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            allowInserting: true
        },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            { dataField: "id", caption: "id", visible: false },
            {
                dataField: "MemberID", caption: $translate.instant('RestappAggregator.MemberID'), fixed: true,width: 200,   
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    searchMode:"contains",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMember" 
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }  
                },

                //fixed: true,
                //groupIndex: 0
            },
            {
                dataField: "StoreID", caption: $translate.instant('RestappAggregator.StoreID'), width: 200,    
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

                //fixed: true,
                //groupIndex: 0
            },
            {
                dataField: "AggregatorID", caption: $translate.instant('RestappAggregator.AggregatorID'),width: 200,  
         

                //fixed: true,
                //groupIndex: 0
            },
           
            { dataField: "AggregatorStoreID", caption: $translate.instant('RestappAggregator.AggregatorStoreID') },
            {
                dataField: "ApiKey", caption:'Apikey',width: 200,  
         

                //fixed: true,
                //groupIndex: 0
            },
            { dataField: "delivery_order_status", caption: $translate.instant('RestappAggregator.delivery_order_status'),visible: false },
            { dataField: "order_status", caption: $translate.instant('RestappAggregator.order_status') },
            { dataField: "future_delivery_order_status", caption: $translate.instant('RestappAggregator.future_delivery_order_status'), visible: false },
            { dataField: "future_takeout_order_status", caption: $translate.instant('RestappAggregator.future_takeout_order_status'), visible: false },
            { dataField: "isCourierAvailable", caption: $translate.instant('RestappAggregator.isCourierAvailable') },
            { dataField: "fk_ObjectUpdate_id", caption: $translate.instant('RestappAggregator.fk_ObjectUpdate_id'), visible: false },
            { dataField: "takein_order_status", caption: $translate.instant('RestappAggregator.takein_order_status'), visible: false },
            { dataField: "takeout_order_status", caption: $translate.instant('RestappAggregator.takeout_order_status'), visible: false },
            { dataField: "isActive", caption: $translate.instant('RestappAggregator.isActive') },
             { dataField: "isEnabled", caption: $translate.instant('RestappAggregator.isEnabled') },
             { dataField: "Alias", caption:'Alias' },

            //"FixedSize",
            //"MapByPrototype",
            // "SkipProduct",
            // "AutoAddProductID",
            // "AutoAddMapToOption",
            // "AutoAddProductQuantity",
            // "AutoAddMapOptionsLevel"
        ],
        onRowClick: function (rowInfo) {
            if (rowInfo.rowType == "data")
                rowInfo.component.editRow(rowInfo.rowIndex);
        },
        export: { enabled: true, fileName: "RestappStore", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.productGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappProduct",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappProduct",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappProduct",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappProduct",
        }),
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
        //grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        //groupPanel: { visible: true },
        editing: {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            allowInserting: true
        },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            { dataField: "id", caption: "id", visible: false },
            { dataField: "RestAppProductID", caption: $translate.instant('RestappAggregator.ProductID'), visible: false },
            { dataField: "ChildName", caption: $translate.instant('RestappAggregator.ChildName')},
            { dataField: "RestAppProductName", caption: $translate.instant('RestappAggregator.ProductName'),visibleIndex: 0,fixed: true },
            {
                dataField: "ProductID", caption: $translate.instant('RestappAggregator.ProductID'), fixed: true,width: 200,    
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    searchMode:"contains",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxProduct" 
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }  
                },

                //fixed: true,
                //groupIndex: 0
            },
            { dataField: "FixedSize", caption: $translate.instant('RestappAggregator.FixedSize') },
            { dataField: "MapByPrototype", caption: $translate.instant('RestappAggregator.MapByPrototype') },
            { dataField: "SkipProduct", caption: $translate.instant('RestappAggregator.SkipProduct') },
            { dataField: "AutoAddProductID", caption: $translate.instant('RestappAggregator.AutoAddProductID') ,
            lookup: {
                valueExpr: "id",
                displayExpr: "name",
                searchMode:"contains",
                dataSource: {
                    store: DevExpress.data.AspNet.createStore({
                        key: "id",
                        loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxProduct" 
                    }),
                    sort: "name",
                    headerFilter: { allowSearch: true }
                },
                calculateSortValue: function (data) {
                    var value = this.calculateCellValue(data);
                    return this.lookup.calculateCellValue(value);
                }  
            },},
            { dataField: "AutoAddMapToOption", caption: $translate.instant('RestappAggregator.AutoAddMapToOption') },
            { dataField: "AutoAddProductQuantity", caption: $translate.instant('RestappAggregator.AutoAddProductQuantity') },
            { dataField: "AutoAddMapOptionsLevel", caption: $translate.instant('RestappAggregator.AutoAddMapOptionsLevel') },

            //"FixedSize",
            //"MapByPrototype",
            // "SkipProduct",
            // "AutoAddProductID",
            // "AutoAddMapToOption",
            // "AutoAddProductQuantity",
            // "AutoAddMapOptionsLevel"
        ],
        onRowClick: function (rowInfo) {
            if (rowInfo.rowType == "data")
                rowInfo.component.editRow(rowInfo.rowIndex);
        },
        export: { enabled: true, fileName: "RestappProduct", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.paymentaGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappPaymentType",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappPaymentType",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappPaymentType",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappPaymentType",
        }),
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
        //grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        //groupPanel: { visible: true },
        editing: {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            allowInserting: true
        },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            {
                dataField: "MemberID", caption:  $translate.instant('RestappAggregator.AggregatorID') ,
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMember" 
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }  
                },

                //fixed: true,
                //groupIndex: 0
            },
            {
                dataField: "AggregatorID", caption:  $translate.instant('RestappAggregator.MemberID'),
             

                //fixed: true,
                //groupIndex: 0
            },
            { dataField: "type",   caption: $translate.instant('RestappAggregator.type'), },
            { dataField: "name",   caption: $translate.instant('RestappAggregator.Name'), },
           // "type","name",
            {
                dataField: "PaymentTypeID", caption: $translate.instant('RestappAggregator.PaymentType'),
                lookup: {
                    valueExpr: "id", 
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxPaymentType" 
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }  
                },

                //fixed: true,
                //groupIndex: 0
            }
        ],
        export: { enabled: true, fileName: "RestappPaymentType", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.rejectreasonGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappAggregator",
            insertUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappAggregator",
            updateUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappAggregator",
            deleteUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRestappAggregator",
        }),
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
        //grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        //groupPanel: { visible: true },
        editing: {
            allowAdding: true,
            allowUpdating: true,
            allowDeleting: true,
            allowInserting: true
        },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        remoteOperations: true,
        columns: [
            { dataField: "id", caption: "id", visible: false },
            { dataField: "HostAddress",   caption: $translate.instant('RestappAggregator.HostAddress'), },
            { dataField: "MemberID",   caption: $translate.instant('RestappAggregator.MemberID'), },
            { dataField: "Name",   caption: $translate.instant('RestappAggregator.Name'), },
            { dataField: "StoreRoutingEnabled",   caption: $translate.instant('RestappAggregator.StoreRoutingEnabled'), },
            { dataField: "TransferOrdersInstant",   caption: $translate.instant('RestappAggregator.TransferOrdersInstant'), },
            { dataField: "isActive",   caption: $translate.instant('RestappAggregator.isActive'), },
        ],
        export: { enabled: true, fileName: "RestappAggregator", },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("RestappAggregatorCtrl");
    });
}