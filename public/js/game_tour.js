angular.module('mean').controller('GameTourController', GameTourController);

function GameTourController($scope, game) {
   $scope.game = game;
    $scope.$on('$locationChangeSuccess', () => {
      if ($scope.gameTour) {
        $scope.gameTour.exit();
      }
    });
    $scope.gameTour = introJs();
    $scope.gameTour.setOptions({
      steps: [{
        intro: 'Welcome to the game Cards for Humanity, You want to rock this game then you need to learn the game, ride with me to play like me.'
      },
      {
        element: '#logo',
        intro: 'Cards for humanity official logo'
      },
      {
        element: '#abandon-game-button',
        intro: 'Played enough? Quit game to exit'
      },
      {
        element: '#tweet-container',
        intro: 'share game experience with friends on twitter'
      },
      {
        element: '#question-container-outer',
        intro: 'start game and  awaiting players to join the game'
      },
      {
        element: '#rules',
        intro: 'rules of the game'
      },
       {
        element: '.chatbox',
        intro: 'chat with other players in the game'
      },
      ]
    });

    $scope.gameTour.start();
}