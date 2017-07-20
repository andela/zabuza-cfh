/* global angular */
angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', 'socket', '$http', '$window', 'game', 'AvatarService', function ($scope, Global, $location, socket, $http, $window, game, AvatarService) {
    $scope.global = Global;
    $scope.formData = {};

    $scope.showRegion = function () {
      const myModal = $('#select-region');
      myModal.modal('show');
    };

    $scope.showRegionGuest = function () {
      const myModal = $('#select-region-guest');
      myModal.modal('show');
    };

    $scope.playAsGuest = function () {
      game.joinGame();
      $location.path('/app');
    };
    $scope.playWithStrangers = function () {
      if ($scope.region === undefined) {
        alert('Please Select your Region');
        return;
      }
      $scope.data = { player_region: $scope.region };
      $http.post('/setregion', $scope.data)
        .success(function (data) {
          console.log(data);
        });
      const myModal = $('#select-region');
      myModal.modal('hide');
      $window.location.href = '/play';
    };

    $scope.playWithFriends = function () {
      if ($scope.region === undefined) {
        alert('Please Select your Region');
        return;
      }

      $scope.data = { player_region: $scope.region };
      $http.post('/setregion', $scope.data)
        .success(function (data) {
          console.log(data);
        });
      const myModal = $('#select-region');
      myModal.modal('hide');
      $window.location.href = '/play?custom';
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

    $scope.signIn = function () {
      $http.post('api/auth/login', JSON.stringify($scope.formData))
        .success((data) => {
          if (data.success === true) {
            $window.localStorage.setItem('user-token', data.token);
            $window.location.href = '/';
          } else {
            $scope.showMessage = data.message;
          }
        }).error(function (error, status) {
          $scope.showMessage = 'wrong email or password';
        });
    };
  }]);