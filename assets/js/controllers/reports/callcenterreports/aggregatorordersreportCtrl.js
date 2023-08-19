"use strict";
app.controller("aggregatorordersreportCtrl", aggregatorordersreportCtrl);
function aggregatorordersreportCtrl(
  $scope,
  $filter,
  $modal,
  $log,
  Restangular,
  SweetAlert,
  $timeout,
  toaster,
  $window,
  $rootScope,
  $compile,
  $location,
  $translate,
  ngnotifyService,
  $element,
  NG_SETTING,
  localStorageService,
  $q,
  $http
) {
  var ctrl = this;
  $scope.Time = ngnotifyService.ServerTime();

  if (
    !$rootScope.user ||
    !$rootScope.user.UserRole ||
    !$rootScope.user.UserRole.Name
  ) {
    $location.path("/login/signin");
  }
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
      value: new Date().addDays(-2),
      labelLocation: "top", // or "left" | "right"
    },
    toDate: {
      max: new Date(),
      min: new Date(2019, 0, 1),
      displayFormat: "dd.MM.yyyy",
      bindingOptions: {
        value: "DateRange.toDate.value",
      },
      value: new Date().addDays(-1),
      label: {
        location: "top",
        alignment: "right", // or "left" | "center"
      },
    },
  };
  $scope.isInitialized = false;
  $scope.reportButtonOptions = {
    text: $translate.instant("reportcommands.GetData"),
    onClick: function () {
      var dataGrid = $("#gridContainer").dxDataGrid("instance");
      if (!$scope.isInitialized) {
        dataGrid.option(
          "dataSource",
          new DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxAggregatorOrders",
            onBeforeSend: function (method, ajaxOptions) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {

                    ajaxOptions.headers = {
                        Authorization: 'Bearer ' + authData.token
                    };
                }
            },
            remoteOperations: true,
          })
        );
        $scope.isInitialized = true;
      }
      var gridDS = dataGrid.getDataSource();
      dataGrid.clearFilter();
      gridDS.filter(getFilter());
      dataGrid.refresh();
    },
  };
  function BuildUserStoresArray(src) {
    var result = [];
    if (src) {
      for (var i = 0; i < src.length; i++) {
        result.push(["StoreID", "=", src[i].id]);
        if (src.length > 0) result.push("or");
      }
    } else return null;
    return result;
  }
  function getFilter() {
    //"and",["!",["OrderType","=",""]]
    var fdate = new Date(
      $scope.DateRange.fromDate.value.getFullYear(),
      $scope.DateRange.fromDate.value.getMonth(),
      $scope.DateRange.fromDate.value.getDate()
    );
    var tdate = new Date(
      $scope.DateRange.toDate.value.getFullYear(),
      $scope.DateRange.toDate.value.getMonth(),
      $scope.DateRange.toDate.value.getDate()
    );

    if ($scope.StoreID) {
      return [
        [["OperationDate", ">=", fdate], "and", ["OperationDate", "<=", tdate]],
        "and",
        ["StoreID", "=", $scope.StoreID],
      ];
    } else {
      //var s= BuildUserStoresArray($rootScope.user.userstores);
      //if (s)
      //    return [["OperationDate", ">=", fdate], "and", ["OperationDate", "<=", tdate], [s]];
      //else
      return [
        ["OperationDate", ">=", fdate],
        "and",
        ["OperationDate", "<=", tdate],
      ];
    }
  }
  $scope.gridOptions = {
    // dataSource: DevExpress.data.AspNet.createStore({
    //     key: "id",
    //     loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxAggregatorOrders",
    //     //onBeforeSend: function (method, ajaxOptions) {
    //     //    ajaxOptions.xhrFields = { withCredentials: true };
    //     //}
    //     //loadParams: {
    //     //    filter: JSON.stringify(getFilter()),
    //     //},
    //     filter: ["id","=",1],

    //     remoteOperations: true,
    // }),
    //filter: getFilter(),
    remoteOperations: true,
    columns: [
      {
        dataField: "id",
        caption: "MapID",
        width: 80 
      },
      { dataField: "Aggregator", caption: "Aggregator",width: 80 },
      {
        dataField: "MapDate",
        alignment: "right",
        dataType: "datetime",
        width: 100,
        format: "dd.MM.yyyy HH:mm",
      },
      {
        dataField: "OperationDate",
        alignment: "right",
        dataType: "date",
        width: 80,
        format: "dd.MM.yyyy",
      },
      {
        dataField: "OrderID",
        caption: "Order ID",
        width: 100 
      },
      {
        dataField: "OrderNumber",
        width: 100 
      },
      {
        dataField: "StoreName",
        caption: "Store Name",
        width: 180 
      },
      {
        dataField: "TransferTimeMinutes",
        caption: "Transfer Time",
        width: 80 ,
        visible: false
      },
      {
        dataField: "CustomerMappingTime",
        caption: "Customer Mapping Time",
        width: 80 ,
        visible: false
      },
      {
        dataField: "AggregatorOrderID",
        caption: "Aggregator Order #",
        width: 180 
      },
      {
        dataField: "isCustomerMapRequired",
        caption: "Customer Map",
        width: 80 ,
        visible: false
      },
      {
        dataField: "Notes",
        caption: "Notes",
        width: 100 
      },
      {
        dataField: "OrderStatus",
        caption: "OrderStatus",
        width: 80 
      },
      { dataField: "Total", dataType: "number", caption: "Total", format: { type: "fixedPoint", precision: 2 } },
      {
        dataField: "PaymentType",
        caption: "PaymentType",
        width: 100 
      },
    ],
    filterRow: {
      visible: true,
    },
    headerFilter: {
      visible: true,
    },
    export: {
      enabled: true,
      fileName: "YemekSepetiStatDetails",
    },
    scrolling: {
      mode: "virtual",
    },
    height: 600,
    showBorders: true,
    masterDetail: {
      enabled: true,
      template: "detail",
    },
    columnChooser: {
      enabled: true,
    },
    //summary: {
    //    totalItems: [{
    //        column: "id",
    //        summaryType: "count"
    //    }]
    //}
  };
  $scope.getTabPanelOptions = function () {
    return {
      items: [{
        title: 'Order',
        template: 'ordersTab',
      }, {
        title: 'Items',
        template: 'orderitemsTab',
      }],
    };
  };
  $scope.getDetailGridSettings = function (key) {
    return {
      dataSource: new DevExpress.data.CustomStore({
        key: "id",
        load: function (loadOptions) {
          var params = {OrderID: key};
          return $http.get(NG_SETTING.apiServiceBaseUri + "/api/aggregator/order", {params: params})
            .then(
              function (response) {
                return {
                  data: response.data,
                  totalCount: 10,
                };
              },
              function (response) {
                return $q.reject("Data Loading Error");
              }
            );
        },
      }),
      columnAutoWidth: true,
      showBorders: true,
      scrolling: {
        mode: "virtual",
      },
      allowColumnResizing: true,
      columnAutoWidth: true,
      showRowLines: true,
      rowAlternationEnabled: true,
      showBorders: true,
      allowColumnReordering: true,
      columns: [
        { dataField: "Name", caption: "Name",width: 180 },
        { dataField: "ClientPhone", caption: "ClientPhone",width: 180 },
        { dataField: "Address", caption: "Address",width: 180 },
        { dataField: "AddressDescription", caption: "AddressDescription",width: 180 },
        { dataField: "Store", caption: "Store",width: 180 },       
        { dataField: "Total", dataType: "number", caption: "Total", format: { type: "fixedPoint", precision: 2 } }
      ],      
    };
  };
  $scope.getOIGridSettings = function (key) {
    return {
      dataSource: new DevExpress.data.CustomStore({
        //key: "Name",
        load: function (loadOptions) {
          var params = {OrderID: key};
          return $http.get(NG_SETTING.apiServiceBaseUri + "/api/aggregator/orderitems", {params: params})
            .then(
              function (response) {
                return {
                  data: response.data,
                  totalCount: 10,
                };
              },
              function (response) {
                return $q.reject("Data Loading Error");
              }
            );
        },
      }),
      columnAutoWidth: true,
      showBorders: true,
      scrolling: {
        mode: "virtual",
      },
      allowColumnResizing: true,
      columnAutoWidth: true,
      showRowLines: true,
      rowAlternationEnabled: true,
      showBorders: true,
      allowColumnReordering: true,
      columns: [
        "Name",
        { dataField: "Quantity", dataType: "number", caption: "Quantity", format: { type: "fixedPoint", precision: 0 } }
      ],      
    };
  };
  $scope.LoadData = function () {};
  $scope.$on("$destroy", function () {
    $element.remove();
  });

  $scope.Back = function () {
    $window.history.back();
  };
}