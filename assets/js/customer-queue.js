var app = angular
  .module("ropngCDApp", ["ngAudio"])
  .controller("CDAppCtrl", function ($scope, $location, ngAudio, $http) {
    //http://127.0.0.1:5502/customer-queue.html#?StoreID=100620224522
    var paramValue = $location.search();
    var connected = false;
    console.log(paramValue.StoreID);
    var groupName = paramValue.StoreID;
    var serverTime = "ServerTime";
    $scope.preparingOrders = [];
    $scope.preparedOrders = [];
    $scope.audio = ngAudio.load("assets/sound/doorbell.mp3");
    $scope.audio.volume = 1.0;
    //$scope.audio.pause();
    var connection = $.hubConnection("http://185.169.53.183:9065");
    var proxy = connection.createHubProxy("NGNotifyHub");
    proxy.on("CustomerQueueDataUpdate", onCustomerQueueDataUpdate);
    proxy.on("serverTime", function (data) {
      var now = new Date();
      var serverdate = new Date(data);
      //console.log("ServerTime Data: " + JSON.stringify(data));
      console.log("Server time: " + serverdate);
      //$rootScope.$broadcast("ServerTime", serverdate);
    });
    $http({
      method: "GET",
      url:
        "http://185.169.53.183:9065/api/tools/customerqueue?StoreID=" + groupName,
    }).then(
      function mySuccess(response) {
        onCustomerQueueDataUpdate(response.data);
        $scope.audio.play();
      },
      function myError(response) {
        //$scope.myWelcome = response.statusText;
      }
    );
    connection
      .start()
      .done(connectedToSignalR)
      .fail(function () {
        console.error("Error connecting to signalR");
      });
    function connectedToSignalR() {
      console.debug("connected to signalR, connection ID =" + connection.id);
      proxy
        .invoke("JoinGroup", groupName)
        .done(function () {
          console.log("Invocation of JoinGroup for store succeeded");
        })
        .fail(function (error) {
          console.log("SignalR error:", error);
        });
      proxy
        .invoke("JoinGroup", serverTime)
        .done(function () {
          console.log("Invocation of JoinGroup for ServerTime succeeded");
        })
        .fail(function (error) {
          console.log("SignalR error:", error);
        });
      connected = true;
    }
    function onCustomerQueueDataUpdate(data) {
      console.log("client.CustomerQueueDataUpdate " + JSON.stringify(data));

      // const removed = before.filter((x: any) => !after.includes(x));
      // const added = after.filter((x: any) => !before.includes(x));
      var added = data.PreparedOrders.filter(
        (o1) => !$scope.preparedOrders.some((o2) => o1.OrderID === o2.OrderID)
      );

      if (added.length > 0) {
        console.log("Added Prepared Order:" + added);
        for (var i = 0; i < added.length; i++) {
          $scope.audio.play();
        }
      }
      else {
        console.log("No new prepared Orders!");
      }
      $scope.preparingOrders = data.PreparingOrders;
      $scope.preparedOrders = data.PreparedOrders;
      //$scope.$apply();
    }
    proxy.connection.connectionSlow(function () {
      console.log(
        "We are currently experiencing difficulties with the connection."
      );
    });
    proxy.connection.error(function (error) {
      console.log("SignalR error: " + error);
    });
    proxy.connection.reconnecting(function () {
      console.log("SignalR Reconnecting...");
    });
    proxy.connection.disconnected(function () {
      connected = false;
      setTimeout(function () {
        proxy.connection.start().done(function () {
          connectedToSignalR();
        });
      }, 5000); // Restart connection after 5 seconds.
    });
  });
app.controller("MainController", function ($interval) {
  var controller = this;
  controller.date = new Date();
});
$(document).ready(function () {
  $(".marquee").marquee({
    delayBeforeStart: 0,
    duplicated: true,
    pauseOnHover: true,
  });
});
