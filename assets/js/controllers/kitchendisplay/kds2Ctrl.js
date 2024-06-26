﻿app.controller("kds2Ctrl", kds2Ctrl);
function kds2Ctrl(
  $rootScope,
  $scope,
  $log,
  $modal,
  $translate,
  $interval,
  $timeout,
  Restangular,
  ngTableParams,
  SweetAlert,
  toaster,
  $window,
  $rootScope,
  $location,
  $filter,
  localStorageService,
  $translate,
  ngnotifyService,
  userService,
  ngAudio,
  $element,
  $localStorage
) {
  $rootScope.uService.EnterController("kds2Ctrl");
  $scope.item = {};
  $scope.audio = ngAudio.load("assets/sound/ringin.mp3");
  $scope.audio.volume = 0.8;
  $scope.audio.pause();
  userService.userAuthorizated();
  $scope.inProgress = false;
  $scope.KDIndex = 0;
  $scope.$storage = $localStorage.$default({
    KDisplayIndex: 0,
    StoreProductionID: null,
  });
  $scope.StoreProductions = [];
  $scope.completedOrdersCount = 0;
  var stopTime;
  var kd = this;
  $scope.BottonDblcilik = function () { };
  $scope.translate = function () {
    $scope.trQuantity = $translate.instant("main.QUANTITY");
    $scope.trProductName = $translate.instant("main.PRODUCTNAME");
    $scope.trState = $translate.instant("main.STATE");
    $scope.trDuration = $translate.instant("main.DURATION");
    $scope.trTimer = $translate.instant("main.TIMER");
    $scope.trDriverName = $translate.instant("main.DRIVERNAME");
    $scope.trVehicle = $translate.instant("main.VEHICLE");
    $scope.trTotalOrder = $translate.instant("main.TOTALORDER");
    $scope.trStateTime = $translate.instant("main.STATETIME");
    $scope.ordernumber = $translate.instant("main.ORDERNUMBER");
    $scope.productname = $translate.instant("main.PRODUCTNAME");
    $scope.materials = $translate.instant("main.MATERIALS");
    $scope.state = $translate.instant("main.STATE");
    $scope.duration = $translate.instant("main.DURATION");
    $scope.timer = $translate.instant("main.TIMER");
    $scope.timerstr = $translate.instant("main.TIMERSTR");
    $scope.fontselection = $translate.instant("main.FONTSELECTION");
    $scope.notes = $translate.instant("main.NOTES");
    $scope.ordernote = $translate.instant("main.ORDERSNOTE");
    $scope.kitchendisplayselection = $translate.instant(
      "main.KITCHENDISPLAYSELECTION"
    );
  };
  $scope.translate();
  var deregistration = $scope.$on(
    "$translateChangeSuccess",
    function (event, data) {
      // ON LANGUAGE CHANGED
      $scope.translate();
    }
  );
  //$rootScope.disableSessionTimeOut();
  var OrderRefresh = $scope.$on("OrderChange", function (event, data) {
    $scope.LoadOrderItemStates();
  });
  var KDSNotify = $scope.$on("KDSUpdate", function (event, data) {
    if (data.Beep)
      $scope.audio.play();
    $scope.audio.play();
    $scope.LoadOrderItemStates();
  });
  var BumpBarData = $scope.$on("BumpBarData", function (event, data) {
    var sID = $scope.$storage.KDisplayIndex ? $scope.$storage.KDisplayIndex : 0;
    if (data.StationID == sID) $scope.ApplyBumpBarData(data);
  });

  Restangular.all("cache/StoreProductions")
    .getList({
      StoreID: localStorageService.get("StoreID"),
    })
    .then(
      function (result) {
        $scope.StoreProductions = result;
      },
      function (response) {
        toaster.pop(
          "warning",
          $translate.instant("Server.ServerError"),
          response.data.ExceptionMessage
        );
      }
    );

  $scope.ApplyBumpBarData = function (data) {
    var key = -1;
    switch (data.Data) {
      case "a":
        key = 0;
        break;
      case "b":
        key = 4;
        break;
      case "c":
        key = 1;
        break;
      case "d":
        key = 5;
        break;
      case "e":
        key = 2;
        break;
      case "f":
        key = 6;
        break;
      case "g":
        key = 3;
        break;
      case "h":
        key = 7;
        break;
      case "1":
        key = 0;
        break;
      case "2":
        key = 1;
        break;
      case "3":
        key = 2;
        break;
      case "4":
        key = 3;
        break;
      case "5":
        key = 4;
        break;
      case "6":
        key = 5;
        break;
      case "7":
        key = 6;
        break;
      case "8":
        key = 7;
        break;
      case "9":
        key = 8;
        break;
      case "0":
        key = 9;
        break;
      case "I":
        key = -1;
        $scope.ShowCompletedOrder();
        break;
      default:
        key = -1;
    }
    if (key >= 0) $scope.RemoveItem($scope.orderitemstates[key].OrderID, key);
  };
  var interval = $interval(function () {
    $scope.UpdateOrderItemStatesTimers($scope.orderitemstates);
  }, 1000);
  $scope.orderitemstates = [];
  $scope.LoadOrderItemStates = function () {
    if ($scope.inProgress) return;
    $scope.inProgress = true;

    var params =

      $scope.$storage.KDisplayIndex == "0"
        ? {
          //StoreProductionID: $scope.$storage.StoreProductionID,
          OrderStateID: 4,
          StoreID: $rootScope.user.StoreID,
          KDisplayIndex: 0
        }
        : {
          StoreID: $rootScope.user.StoreID,
          StoreProductionID: $scope.$storage.StoreProductionID,
          OrderStateID: 4,
          CompletedOrdersCount: $scope.completedOrdersCount

        };

    Restangular.all("kds/getitems")
      .getList(params)
      .then(
        function (result) {
          // if (result.length > 0)
          //     $scope.audio.play();
          // else
          //     $scope.audio.pause();
          $scope.inProgress = false;
          $scope.UpdateOrderItemStates(
            result.plain()
          );
          //$scope.$broadcast("$$rebind::refresh");
        },
        function (response) {
          $scope.inProgress = false;
          toaster.pop(
            "error",
            $translate.instant("Server.ServerError"),
            response.data.ExceptionMessage
          );
        }
      );
  };
  // $scope.revertlastorder = function () {
  //   $scope.inProgress = true;
  //   Restangular.all('kds/revertlastorder').getList({}).then(function (result) {
  //       $scope.inProgress = false;
  //       toaster.pop('success', $translate.instant('Server.ServerError'));
  //   }, function (response) {
  //       $scope.inProgress = false;
  //       toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
  //   });
  // };
  $scope.revertlastorder = function (OrderID) {
    Restangular.one("kds/revertlastorder")
      .get({
        OrderID: OrderID,
      })
      .then(
        function (restresult) {
          toaster.pop(
            "success",
            $translate.instant("kitchendisplayf.Prepared"),
            $translate.instant("kitchendisplayf.Itemprepared")
          );
          $scope.LoadOrderItemStates();
        },
        function (restresult) {
          $scope.WaitForResult = false;
          toaster.pop(
            "error",
            $translate.instant("kitchendisplayf.Updatefailed"),
            restresult.data.ExceptionMessage
          );
          $scope.LoadOrderItemStates();
        }
      );
  };
  $scope.ShowCompletedOrder = function () {
    ++$scope.completedOrdersCount;
    $scope.LoadOrderItemStates();
  };
  $scope.LoadOrderItemStates();
  $scope.dataGridOptionsorder = function (items, itemBgColor) {
    return {
      dataSource: items,
      dataStructure: "tree",
      showRowLines: true,
      showBorders: true,
      columnAutoWidth: true,
      allowColumnResizing: true,
      showColumnLines: true,
      //rowAlternationEnabled: true,
      hoverStateEnabled: true,
      allowColumnReordering: true,
      //selectedRowKeys: [1, 29, 42],
      autoExpandAll: true,
      wordWrapEnabled: true,
      remoteOperations: { grouping: true },
      //keyExpr: 'id',
      //displayExpr: 'caption',
      parentIdExpr: "ParentItemID",
      virtualModeEnabled: true,
      autoExpandAll: true,
      //filterSyncEnabled: true,
      //headerFilter: { visible: true },
      //filterValue: ["DisplayOnKDS", "=", "true"],
      columns: [
        {
          name: "Product",
          dataField: "Product",
          caption: $scope.product,
          Width: "90%",
          cellTemplate(container, options) {
            const productname = options.data.Product;
            const pnotes = options.data.Notes;
            if (pnotes) {
                container
                    .append($('<span>', { class: 'name', text: productname }))
                    .append('<br>')
                    .append($('<span>', { class: 'name', text: pnotes }).css("font-style", "italic"));
                //.append($('<span>', { class: 'name', text: pnotes }).css("color", "blue").css("font-style", "italic"));
            }
            else {
                container
                    .append($('<span>', { class: 'name', text: productname }));
            }
        }
        },
        {
          name: "Quantity",
          dataField: "Quantity",
          caption: "#",
          format: { type: "fixedPoint", precision: 0 },
        },
      ],
      onRowPrepared: function (e) {
        if (e.rowType === "data") {
          if (e.data.ParentItemID == 0)
            e.rowElement.css("fontWeight", "bold");
          if ($scope.$storage.KDisplayIndex > -1 && e.data.states.length > 1) {
            if (e.data.states.some(st => !st.Completed && st.ProductStateID > 0)) {
              //hazır değil regi.
              e.rowElement.css("background", completedOrderBgColor);
            }
            else {
              //norma/hazır rengi
              e.rowElement.css("background", preparedItemBgColor);
            }
          }
          else {
            e.rowElement.css("background", preparedItemBgColor); //"Mutfak seçili ise"
          }
          // if (e.data.IsCompleted) {
          //     e.rowElement.css("background", completedOrderBgColor);
          // } else if (e.data.IsPrepared2) {
          //     e.rowElement.css("background", preparedItemBgColor);
          // } else {
          //     e.rowElement.css("background", itemBgColor);
          // }
        }
        else if (e.rowType === "header") {
          e.rowElement.css("background", itemBgColor);
        }
      },
    };
  };

  const threeMinutes = 180;
  const fiveMinutes = 300;
  const threeMinBgColor = "#f7fa55";
  const fiveMinBgColor = "#fa4343";
  const preparedItemBgColor = "#aaffa8";
  const completedOrderBgColor = "#d3d3d3";

  $scope.UpdateOrderItemStatesTimers = function (items) {
    if (items && items.length) {
      let refreshOrders = false;
      for (var i = 0; i < items.length; i++) {
        if (!items[i].data) {
          items[i].Timer = Math.round(
            moment
              .duration(
                moment(ngnotifyService.ServerTime()).diff(
                  moment(items[i].FirstOrderItemStateDate)
                )
              )
              .asSeconds() - items[i].TotalDuration
          );
          items[i].data = items[i].Timer;
        }
        const timerValue = ++items[i].Timer;
        items[i].isTimedOut = timerValue < 0;
        items[i].TimerStr = timerValue;

        // if (timerValue === threeMinutes || timerValue === fiveMinutes) {
        //   refreshOrders = true;
        // }
        if (items[i].IsCompleted) {
          items[i].bgColor = completedOrderBgColor;
          items[i].bgColorStyle = { background: completedOrderBgColor };
          items[i].headerBgColorStyle = { background: completedOrderBgColor };
        } else if (timerValue >= fiveMinutes) {
          items[i].bgColor = fiveMinBgColor;
          items[i].bgColorStyle = { background: fiveMinBgColor };
          items[i].headerBgColorStyle = { background: fiveMinBgColor };
        } else if (timerValue >= threeMinutes) {
          items[i].bgColor = threeMinBgColor;
          items[i].bgColorStyle = { background: threeMinBgColor };
          items[i].headerBgColorStyle = { background: threeMinBgColor };
        } else {
          items[i].bgColor = "#fff";
          items[i].bgColorStyle = { background: "#fff" };
          items[i].headerBgColorStyle = { background: "#f5f5f5" };
        }
        if (refreshOrders) $scope.LoadOrderItemStates();
      }
      return items;
    }
  };
  $scope.UpdateOrderItemStates = function (items) {
    for (var i = 0; i < items.length; i++) {
      var idx = ($scope.orderitemstates)?$scope.orderitemstates.findIndex(x => x.OrderID===items[i].OrderID):-1;
      if (idx>-1) {        
        if (!angular.equals($scope.orderitemstates[idx].orderItems, items[i].orderItems))
        $scope.orderitemstates[idx] = items[i];
      }
      else {
        $scope.orderitemstates.push(items[i]);
      }
    }
    for (var i = 0; i < $scope.orderitemstates.length; i++) {
      if (!items.some(x => x.OrderID === $scope.orderitemstates[i].OrderID)) {
        $scope.orderitemstates.splice(i, 1);
      }
    }
    $scope.UpdateOrderItemStatesTimers(items);
  }
  //$scope.RemoveItem = function (OrderID, index, AutoPrint) {
  //    $scope.orderitemstates.splice(index, 1);
  //    $scope.$broadcast('$$rebind::refresh');
  //    if ($scope.WaitForResult == true) {
  //        toaster.pop("warning", "Lütfen Bekleyin !", "Please Click Again!");
  //    }
  //    else {
  //        if (!AutoPrint) {  //if (!AutoPrint) olmalı
  //            SweetAlert.swal({
  //                title: "TOPLU ETİKET YAZDIRMA",
  //                text: "Etiketi Yazdırmak İstiyor musunuz ?",
  //                type: "warning",
  //                showCancelButton: true,
  //                confirmButtonColor: "#DD6B55",
  //                confirmButtonText: "Evet, Yazdır !",
  //                cancelButtonText: "Hayır, Yazdırma !",
  //                closeOnConfirm: true,
  //                closeOnCancel: true
  //            }, function (isConfirm) {
  //                $scope.updateOrder(OrderID, isConfirm);
  //            });
  //        }
  //        else {
  //            $scope.updateOrder(OrderID, true);
  //        }
  //    }
  //};
  //$scope.updateOrder = function (OrderID,autoPrint) {
  //    Restangular.one('kds/updateorder').get({
  //        OrderID: OrderID,
  //        AutoPrint: autoPrint
  //    }).then(function (restresult) {
  //        toaster.pop("success", "Hazır.", "Item prepared!");
  //    }, function (restresult) {
  //        $scope.WaitForResult = false;
  //        toaster.pop('error', "Güncelleme başarısız !", restresult.data.ExceptionMessage);
  //    })
  //};

  $scope.RemoveItem = function (OrderID, index) {
    const isCompleted = $scope.orderitemstates[index].IsCompleted == true;
    $scope.orderitemstates.splice(index, 1);
    //$scope.$broadcast("$$rebind::refresh");
    if ($scope.WaitForResult == true) {
      toaster.pop(
        "warning",
        $translate.instant("kitchendisplayf.PleaseWait"),
        $translate.instant("kitchendisplayf.PleaseClickAgain")
      );
    } else if (isCompleted) {
      $scope.completedOrdersCount = 0;
      $scope.LoadOrderItemStates();
    } else {
      $scope.completedOrdersCount = 0;
      $scope.updateOrder(OrderID);
    }
  };
  $scope.updateOrder = function (OrderID) {
    Restangular.one("kds/updateorder")
      .get({
        OrderID: OrderID,
        AutoPrint: false,
        KDisplayIndex: $scope.$storage.KDisplayIndex >= 0
          ? 1 //$scope.$storage.KDisplayIndex
          : 0,
        // StoreProductionID: $scope.$storage.StoreProductionID
        //   ? $scope.$storage.StoreProductionID
        //   : null, //bu eklenecek UI a
      })
      .then(
        function (restresult) {
          toaster.pop(
            "success",
            $translate.instant("kitchendisplayf.Prepared"),
            $translate.instant("kitchendisplayf.Itemprepared")
          );
          $scope.LoadOrderItemStates();
        },
        function (restresult) {
          $scope.WaitForResult = false;
          toaster.pop(
            "error",
            $translate.instant("kitchendisplayf.Updatefailed"),
            restresult.data.ExceptionMessage
          );
          $scope.LoadOrderItemStates();
        }
      );
  };
  $scope.setLocalStoregFont = function (data) {
    localStorageService.set("FontSize", data);
  };
  $scope.gettLocalStoregFont = function () {
    var data = localStorageService.get("FontSize");
    $scope.ngstyle = data ? data : "";
  };
  $scope.gettLocalStoregFont();
  $scope.Change = function (data) {
    $scope.ngstyle = data;
    $scope.setLocalStoregFont(data);
  };
  $scope.getLastOrders = function (addressID) {
    var modalInstance = $modal.open({
      templateUrl: "assets/views/kitchenDisplay/kdslastorders.html",
      controller: "kdslastordersCtrl",
      size: "lg",
      backdrop: "",
      resolve: {},
    });
    modalInstance.result.then(function () { });
  };
  var clockStop;
  $scope.FormatClock = function (val) {
    return $filter("date")(val, "HH:mm:ss");
  };
  $scope.GoToClockIn = function () {
    $location.path("/login/clockinout");
  };
  $scope.theClock = $scope.FormatClock(ngnotifyService.ServerTime());
  $scope.StartClock = function () {
    if (angular.isDefined(clockStop)) return;
    clockStop = $interval(function () {
      $scope.theClock = $scope.FormatClock(ngnotifyService.ServerTime());
    }, 1000);
  };
  var stopClock = function () {
    if (angular.isDefined(clockStop)) {
      $interval.cancel(clockStop);
      clockStop = undefined;
    }
  };
  $scope.StartClock();

  $scope.$on("$destroy", function () {
    //$timeout.cancel(interval);
   // $rootScope.app.layout.isNavbarFixed = ($rootScope.BRAND === 'KFC' || $rootScope.BRAND === 'KK');
    deregistration();
    clearInterval(interval);
    //$timeout.cancel(OrderRefreshTimeOut);
    OrderRefresh();
    KDSNotify();
    BumpBarData();
    stopClock();
    $element.remove();
    //$rootScope.updateSessionTimeOutState();
    $rootScope.uService.ExitController("kds2Ctrl");
  });
}