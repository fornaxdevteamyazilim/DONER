var app = angular
  .module('ropngSSApp', ['dx', 'ngStorage'])
    .controller('SSAppCtrl', function ($scope, $localStorage, $interval, $rootScope, $element) {
      $scope.$storage = $localStorage.$default({
          customerItems: [],
      });
      var pages=['hutla-katla','hutla-katlas','hutla-katlass','page-active'];
      var pageIndex=0;
      $scope.bgIndex = pages[pageIndex];
      $interval(function () {
        pageIndex++;
        if (pageIndex>pages.length-1)
          pageIndex=0;
        $scope.bgIndex = pages[pageIndex];      
      }, 10000);
    });
app.controller('MainController', function ($interval) {

    var controller = this;
    controller.date = new Date(); 
  
});