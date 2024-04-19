app.controller('companyCtrl', companyCtrl);
function companyCtrl($scope, $log, $modal, Restangular, ngTableParams, localStorageService, SweetAlert, toaster, $window, $rootScope, $filter, ngnotifyService, $element, $location, userService, $timeout, $translate, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("companyCtrl");
    var id = this;
    userService.userAuthorizated();
    $scope.item = {};
    $scope.translate = function () {
        $scope.trdefinitionsUnit = $translate.instant('main.definitionsUNIT');
        $scope.trPrice = $translate.instant('main.PRICE');
        $scope.trCompany = $translate.instant('main.COMPANY');
        $scope.trdefinitionsSupplyMethod = $translate.instant('main.definitionsSUPPLYMETHOD');
        $scope.trMinUnits = $translate.instant('main.MINUNITS');
        $scope.trMaxUnits = $translate.instant('main.MAXUNITS');
        $scope.trDeliveryDays = $translate.instant('main.DELIVERYDAYS');
        $scope.trDiscount = $translate.instant('main.DISCOUNT');
        $scope.trValidFrom = $translate.instant('main.VALIDFROM');
        $scope.trMultipliyer = $translate.instant('main.MULTIPLIER');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trValidTo = $translate.instant('main.VALIDTO');
        $scope.trStoreGroup = $translate.instant('main.STOREGROUP');
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
            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/company", { params: params })
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
            { type: "buttons", width: 50, buttons: [{ hint: "edit", icon: "edit", onClick: function (e) { location.href = '#/app/definitions/companyedit/' + e.row.data.id; } }] },
            { dataField: "id", dataType: "number", visible: false },
           { caption: $translate.instant('company.Name'), dataField: "Name", dataType: "string" },
            { caption: $translate.instant('company.ItemCode'), dataField: "ItemCode", dataType: "string" },
            { caption: $translate.instant('company.ContactPerson'), dataField: "ContactPerson", dataType: "string" },
            { caption: $translate.instant('company.Phone'), dataField: "Phone", dataType: "string" },
            { caption: $translate.instant('company.Fax'), dataField: "Fax",dataType: "string"  },
            { caption: $translate.instant('company.Email'), dataField: "Email",dataType: "string"},
            
            { caption: $translate.instant('company.isActiveValue'), dataField: "isActiveValue",dataType: "string"  },
            { caption: $translate.instant('company.OracleIntegration'), dataField: "OracleIntegration",dataType: "string",visible: false},
       
        ],
        export: {
            enabled: true,
            fileName: "company",
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
        location.href = '#/app/definitions/company/edit/new';
    };
    $scope.coppyDeal = function (itemID) {
        Restangular.one('definitionsdeal/copydeal').get({id:itemID}).then(function (restresult) {
            $scope.Showspinner = true;
            location.href = '#/app/definitions/company/edit/' + restresult.id;
            id.tableParams.reload();
        }, function (response) {
            $scope.Showspinner = false;
            toaster.pop('warning', " Error!", response.data.Message);
        });
    };
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/definitions/company/edit/' + $scope.SelectedItem;
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
        $rootScope.uService.ExitController("companyCtrl");
    });
};
