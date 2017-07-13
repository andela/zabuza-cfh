angular.module('mean.directives', [])
  .directive('player', function (){
    return{
      restrict: 'EA',
      templateUrl: '/views/player.html',
      link: function(scope, elem, attr){
        scope.colors = ['#7CE4E8', '#FFFFa5', '#FC575E', '#F2ADFF', '#398EC4', '#8CFF95'];
      }
    };
  }).directive('answers', function() {
    return {
      restrict: 'EA',
      templateUrl: '/views/answers.html',
      link: function(scope, elem, attr) {

        scope.$watch('game.state', function() {
          if (scope.game.state === 'winner has been chosen') {
            var curQ = scope.game.curQuestion;
            var curQuestionArr = curQ.text.split('_');
            var startStyle = "<span style='color: "+scope.colors[scope.game.players[scope.game.winningCardPlayer].color]+"'>";
            var endStyle = "</span>";
            var shouldRemoveQuestionPunctuation = false;
            var removePunctuation = function(cardIndex) {
              var cardText = scope.game.table[scope.game.winningCard].card[cardIndex].text;
              if (cardText.indexOf('.',cardText.length-2) === cardText.length-1) {
                cardText = cardText.slice(0,cardText.length-1);
              } else if ((cardText.indexOf('!',cardText.length-2) === cardText.length-1 ||
                cardText.indexOf('?',cardText.length-2) === cardText.length-1) &&
                cardIndex === curQ.numAnswers-1) {
                shouldRemoveQuestionPunctuation = true;
              }
              return cardText;
            };
            if (curQuestionArr.length > 1) {
              var cardText = removePunctuation(0);
              curQuestionArr.splice(1,0,startStyle+cardText+endStyle);
              if (curQ.numAnswers === 2) {
                cardText = removePunctuation(1);
                curQuestionArr.splice(3,0,startStyle+cardText+endStyle);
              }
              curQ.text = curQuestionArr.join("");
              // Clean up the last punctuation mark in the question if there already is one in the answer
              if (shouldRemoveQuestionPunctuation) {
                if (curQ.text.indexOf('.',curQ.text.length-2) === curQ.text.length-1) {
                  curQ.text = curQ.text.slice(0,curQ.text.length-2);
                }
              }
            } else {
              curQ.text += ' '+startStyle+scope.game.table[scope.game.winningCard].card[0].text+endStyle;
            }
          }
        });
      }
    };
  }).directive('question', function() {
    return {
      restrict: 'EA',
      templateUrl: '/views/question.html',
      link: function(scope, elem, attr) {}
    };
  })
  .directive('timer', function(){
    return{
      restrict: 'EA',
      templateUrl: '/views/timer.html',
      link: function(scope, elem, attr){}
    };
  })
  .directive('landing', function() {
    return {
      restrict: 'EA',
      link: function(scope, elem, attr) {
        scope.showOptions = true;

        if (scope.$$childHead.global.authenticated === true) {
          scope.showOptions = false;
        }
      }
    };
  })
  .directive('chatbox', ['socket', socket => ({
    restrict: 'AE',
    replace: true,
    link: (scope, element) => {
       // Send chat message
      scope.sendChatMessage = () => {
        const chat = {};
        chat.message = $('#chatInput').val();
        if (!chat.message) return;
        chat.date = new Date().toString();
        chat.avatar = window.localStorage.getItem('avatar');
        chat.username = window.localStorage.getItem('username');
        socket.emit('chat message', chat);
        $('#chatInput').val('');
      };

      // display a chat message
      const displayChat = (chat) => {
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const date = new Date(chat.date);
        const time = date.toLocaleTimeString().replace(/:\d+ |\CDT/g, ' ');
        element.append(
          `<div class="chat"> <div class="chat-meta">
          <img width="10" height="45" src="${chat.avatar}"> <b>${chat.username}</b> &emsp;<small style="color:#bbb"=>${time}</small><br>
           <div class="chat-message">${chat.message}</div>
           </div>
          <div class="clearfix"></div>
          </div>`
        );
        $('#chatContent').scrollTop(element.height());
        if (chat.username !== window.localStorage.getItem('username')) {
          $('#chatNotification').show();
          const chatNum = Number(window.localStorage.getItem('chatCount')) + 1;
          window.localStorage.setItem('chatCount', chatNum);
          $('#chatCount').show();
          $('#chatCount').html(chatNum);
        }
      };

      // set current players details to localStorage
      scope.setPlayer = (avatar, username) => {
        window.localStorage.setItem('avatar', avatar);
        window.localStorage.setItem('username', username);
        window.localStorage.setItem('chatcount', 0);
        scope.isPlayerSet = true;
      };
        // listen for chat messages
      socket.on('chat message', (chat) => {
        displayChat(chat);
      });

        // Submit the chat when the 'enter' key is pressed
      $('body').on('keyup', '#chatInput', (event) => {
        if (event.which === 13) {
          $('#chatInput').trigger('blur');
          scope.sendChatMessage();
        }
      });
    },
  })]);
