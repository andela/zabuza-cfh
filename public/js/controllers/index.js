/* global angular */
angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', 'socket', '$http', '$window', 'game', 'AvatarService', function ($scope, Global, $location, socket, $http, $window, game, AvatarService) {
    $scope.global = Global;
    $scope.formData = {};

    $scope.playAsGuest = function () {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function () {
      if ($location.search().error) {
        return $location.search().error;
      }
      return false;

    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function (data) {
        $scope.avatars = data;
      });

    $scope.signUp = () => {
      $http.post('api/auth/signup', JSON.stringify($scope.formData))
        .success((data) => {
          if (data.success === true) {
            $window.localStorage.setItem('user-token', data.token);
            $window.location.href = '/';
          } else {
            $scope.showMessage = data.message;
          }
        }).error(function (error, status) {
          $scope.showMessage = `${status} : ${error}`;
        });
    };
  }]);
