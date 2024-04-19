app.controller('inventorydeliveryinvoiceCtrl', inventorydeliveryinvoiceCtrl);
function inventorydeliveryinvoiceCtrl($scope, $log, $modal, Restangular, ngTableParams, localStorageService, SweetAlert, toaster, $window, $rootScope, $filter, ngnotifyService, $element, $location, userService, $timeout, $translate, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("inventorydeliveryinvoiceCtrl");
    var id = this;
    userService.userAuthorizated();
    $scope.item = {};
    $scope.translate = function () {
        $scope.trDateTime = $translate.instant('main.DATETIME');
        $scope.trDocumentNumber = $translate.instant('main.DOCUMENTNUMBER');
        $scope.trPaymentTerm = $translate.instant('main.PAYMENTTERM');
        $scope.trCompany = $translate.instant('main.COMPANY');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trNotes = $translate.instant('main.NOTE');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trVAT = $translate.instant('main.VAT');
        $scope.trDiscount = $translate.instant('main.DISCOUNT');
        $scope.trVATDiscount = $translate.instant('main.VATDISCOUNT%');
        $scope.trPaymentTerm = $translate.instant('main.PAYMENTTERM');
        $scope.trIntegrationId = $translate.instant('main.INTEGRATIONID');
        $scope.trisAccounted = $translate.instant('main.ISACCOUNT');
        $scope.trGrandTotal = $translate.instant('main.GRANDTOTAL');
        $scope.addnewdelivery = $translate.instant('main.ADDNEWDELIVERY');
        $scope.showinvoices = $translate.instant('main.SHOWINVOICES');
        $scope.seacrhbydocumentnumber = $translate.instant('main.SEARCHBYDOCUMENTNUMBER');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.translate();
    $scope.BuildSearchString = function () {
        var result = [];
        if ($scope.item.CompanyID)
            result.push("CompanyID='" + $scope.item.CompanyID + "'");
        if ($scope.item.StoreID)
            result.push("StoreID='" + $scope.item.StoreID + "'");
        if ($scope.item.StoreGroupID)
            result.push("StoreGroupID='" + $scope.item.StoreGroupID + "'");
        if ($scope.item.ValidFrom)
            result.push("ValidFrom='" + $scope.item.ValidFrom + "'");
        return result;
    };
    // id.tableParams = new ngTableParams({
    //     page: 1,
    //     count: 10,
    // }, {
    //     getData: function ($defer, params) {
    //         Restangular.all('definitionsdeal').getList({
    //             pageNo: params.page(),
    //             pageSize: params.count(),
    //             search: $scope.BuildSearchString(),
    //         }).then(function (items) {
    //             params.total(items.paging.totalRecordCount);
    //             $defer.resolve(items);
    //         }, function (response) {
    //             toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
    //         });
    //     }
    // });
    // $scope.loadData = function () {
    //     id.tableParams.reload();
    // };
    var store = new DevExpress.data.CustomStore({
        key: "id",
        load: function (loadOptions) {
            var params = {
               
                pageSize: 1000,
                pageNo: 1,
               };
            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/inventorydeliveryinvoice", { params: params })
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
            { type: "buttons", width: 50, buttons: [{ hint: "edit", icon: "edit", onClick: function (e) { location.href = '#/app/inventory/inventorydeliveryinvoice/edit/' + e.row.data.id; } }] },
            { dataField: "id", dataType: "number", visible: false },
           { caption: $translate.instant('inventorydeliveryinvoice.DocumentNumber'), dataField: "DocumentNumber", dataType: "string" },
            { caption: $translate.instant('inventorydeliveryinvoice.Store'), dataField: "Store", dataType: "string" },
            { caption: $translate.instant('inventorydeliveryinvoice.Company'), dataField: "Company", dataType: "string" },
            { caption: $translate.instant('inventorydeliveryinvoice.InvoiceDate'), dataField: "InvoiceDate",dataType: "date"  },
            { caption: $translate.instant('inventorydeliveryinvoice.Notes'), dataField: "Notes", dataType: "string" },
            { caption: $translate.instant('inventorydeliveryinvoice.Description'), dataField: "Description",dataType: "string"  },
            { caption: $translate.instant('inventorydeliveryinvoice.Discount'), dataField: "Discount",dataType: "string"},
            
            { caption: $translate.instant('inventorydeliveryinvoice.VAT'), dataField: "VAT",dataType: "string"  },
            { caption: $translate.instant('inventorydeliveryinvoice.VATDiscount'), dataField: "VATDiscount",dataType: "number", format: { type: "percent", precision: 2 }},

            { caption: $translate.instant('inventorydeliveryinvoice.PaymentTerm'), dataField: "PaymentTerm",dataType: "string"  },
            { caption: $translate.instant('inventorydeliveryinvoice.IntegrationId'), dataField: "IntegrationId",dataType: "string",},
           // { caption: $translate.instant('inventorydeliveryinvoice.isAccounted'), dataField: "isAccounted",dataType: "string"},
            { caption: $translate.instant('inventorydeliveryinvoice.Amount'), dataField: "Amount",dataType: "string"  ,visible: false},
            { caption: $translate.instant('inventorydeliveryinvoice.GrandTotal'), dataField: "GrandTotal",dataType: "string"},
       
        ],
        summary: {
            totalItems: [
              
                { column: "OrdersCount", summaryType: "sum", displayFormat: "{0}" },
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
            fileName: "inventorydeliveryinvoice",
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
    $scope.DateValidFrom = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = new Date(item);
            $scope.item.ValidFrom = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.newDealItem = function () {
        location.href = '#/app/inventory/inventorydeliveryinvoice/edit/new';
    };
    $scope.coppyDeal = function (itemID) {
        Restangular.one('definitionsdeal/copydeal').get({id:itemID}).then(function (restresult) {
            $scope.Showspinner = true;
            location.href = '#/app/inventory/inventorydeliveryinvoice/edit/' + restresult.id;
            id.tableParams.reload();
        }, function (response) {
            $scope.Showspinner = false;
            toaster.pop('warning', " Error!", response.data.Message);
        });
    };
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventorydeliveryinvoice/edit/' + $scope.SelectedItem;
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.companies = [];
    $scope.loadEntities('cache/company', 'companies');
    $scope.storegroups = [];
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventorydeliveryinvoiceCtrl");
    });
};
