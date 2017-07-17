angular.module('mean.system', []).controller('GameTourController', GameTourController);

function GameTourController($scope, game, $window) {
  $scope.game = game;
  $scope.$on('$locationChangeSuccess', () => {
    if ($scope.gameTour) {
      $scope.gameTour.exit();
    }
  });
  $scope.gameTour = introJs();
  $scope.awaitingPlayers = true;
  $scope.showQuestion = false;
  $scope.showAnswer = false;
  $scope.Time = false;
  $scope.gameOver = false;
  $scope.gameTour.setOption('showBullets', true);
  $scope.gameTour.setOptions({
    steps: [{
      intro: 'Welcome to the game Cards for Humanity, You want to rock this game then you need to learn the game, ride with me to play like me.'
    },
    {
      element: '#logo',
      intro: 'Cards for humanity official logo'
    },
    {
      element: '#finding-players',
      intro: 'Game needs a minimum of 3 players to start. You have to wait for the minimum number of players to join the game.',
      position: 'top'
    },
    {
      element: '#inner-timer-container',
      intro: 'Choose an answer to the current question. After time out, CZAR then select a favorite answer. whoever submitted CZARs favorite answer wins the round.'
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


  const beforeTourChange = (targetElement) => {
    switch (targetElement.id) {
      case 'finding-players':
        {
          $scope.$apply(() => {
            $scope.awaitingPlayers = true;
            $scope.showQuestion = false;
            $scope.showAnswer = false;
            $scope.Time = false;
          });
          break;
        }
      case 'isPlayer':
        {
          $scope.$apply(() => {
            $scope.awaitingPlayers = true;
            $scope.showQuestion = false;
            $scope.showAnswer = false;
            $scope.Time = false;
          });
          break;
        }
      case 'player-score':
        {
          $scope.$apply(() => {
            $scope.awaitingPlayers = true;
          });
          break;
        }
      case 'startButton':
        {
          $scope.$apply(() => {
            $scope.awaitingPlayers = true;
            $scope.showQuestion = false;
            $scope.showAnswer = false;
            $scope.Time = false;
          });
          break;
        }
      case 'inviteButton':
        {
          $scope.$apply(() => {
            $scope.awaitingPlayers = true;
            $scope.showQuestion = false;
            $scope.showAnswer = false;
            $scope.Time = false;
          });
          break;
        }
      case 'question':
        {
          $scope.$apply(() => {
            $scope.awaitingPlayers = false;
            $scope.showQuestion = true;
            $scope.showAnswer = true;
            $scope.Time = true;
          });
          break;
        }
      case 'cards':
        {
          $scope.$apply(() => {
            $scope.showAnswer = true;
            $scope.Time = true;
          });
          break;
        }
      case 'inner-timer-container':
        {
          $scope.$apply(() => {
            $scope.showQuestion = true;
            $scope.showQuestion = true;
            $scope.Time = true;
          });
          break;
        }
      case 'show-czar':
        {
          $scope.$apply(() => {
            $scope.gameOver = false;
            $scope.awaitingPlayers = false;
            $scope.Time = true;
            $scope.showQuestion = true;
            $scope.showAnswer = true;
          });
          break;
        }
      case 'gameover':
        {
          $scope.$apply(() => {
            $scope.showQuestion = false;
            $scope.showAnswer = false;
            $scope.Time = false;
            $scope.gameOver = true;
          });
          break;
        }
      default:
        {
          break;
        }
    }
  };
  $scope.gameTour.start()
       .onbeforechange(beforeTourChange);
}

