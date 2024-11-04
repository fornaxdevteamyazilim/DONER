'use strict';
app.controller('storelistCtrl', storelistCtrl);
function storelistCtrl($scope, $filter, $window, $stateParams, $rootScope, $location, $translate, userService,$modal, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("storelistCtrl");
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

    // var store = new DevExpress.data.CustomStore({
    //    //key: "id",
    //     load: function (loadOptions) {
    //         var params = {
    //            // StoreID: $scope.StoreID,

    //         };

    //         return $http.get(NG_SETTING.apiServiceBaseUri + "/api/dxstore", { params: params })
    //             .then(function (response) {
                  
    //                 return {
    //                     data: response.data,
    //                     totalCount: 10
    //                 };
    //             }, function (response) {
    //                 return (response.data.ExceptionMessage) ? $q.reject(response.data.ExceptionMessage) : $translate.instant('InventoryRequirmentItem.Calculatingrequirments')
    //             });
    //     }
    // });
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxstore",
        }),
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
           // { type: "buttons", width: 50, buttons: [{ hint: "edit", icon: "edit", onClick: function (e) { location.href = '#/app/store/store/edit/' + e.row.data.id; } }] },
            { caption: $translate.instant('STORE.name'), dataField: "name", dataType: "string" },
            { caption: $translate.instant('STORE.OperationDate'), dataField: "OperationDate", dataType: "string" },
            { caption: $translate.instant('STORE.isActiveFilter'), dataField: "isActiveFilter", dataType: "string" },
            { caption: $translate.instant('STORE.isActiveValue'), dataField: "isActiveValue", dataType: "string" },
            { caption: $translate.instant('STORE.isECREnabled'), dataField: "isECREnabled", dataType: "string" },

            {             
                caption: $translate.instant('unmappedorders.Commands'),
                //dataField: "Store",
                type: "buttons",
                buttons: ['edit', 'delete',{
                    text: "Tags",
                    icon: "tags",
                    hint: "Tags edit",
                    // visible: function (e) {
                    //     return !e.row.isEditing && e.row.data.AggregatorOrderStateID == 1;//!e.row.isEditing && !isChief(e.row.data.Position);
                    // },
                    onClick: function (e) {

                        var modalInstance = $modal.open({
                            templateUrl: 'assets/views/Tags/ObjectTagEditModalContent.html',
                            controller: 'TagModalCtrl',
                            size: '',
                            backdrop: '',
                            resolve: {
                                ObjectID: function () {
                                    return e.row.data.id;
                                }
                            }
                        });               
                        
                    
                },
            }
                ]
            }
            
          
          
            
        ],
        summary: {
            totalItems: [
                 { column: "name", summaryType: "count", displayFormat: "{0}" },
             
            ],
        //     groupItems: [
        //         // { column: "Inventory.name", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
        //         { column: "OrdersCount", summaryType: "count",  displayFormat: "{0}", alignByColumn: true },
        //         { column: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
              
        //     ]
         },
         onRowClick: function (rowInfo,e,row) {
               location.href = '#/app/store/store/edit/' + rowInfo.data.id;
         
        },
        export: {
            enabled: true,
            fileName: "unpaiddeliveries",
        },
        scrolling: { mode: "virtual" },
        height: 600
    };
  
    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("storelistCtrl");
    });
};
