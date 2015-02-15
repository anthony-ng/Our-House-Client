angular.module('starter.controllers', ['ng-token-auth'])

.controller('DashCtrl', function($scope, $auth, $http, Auth) {

  //OAUTH SIGN IN
  $scope.handleBtnClick = function() {
    $auth.authenticate('google')
    .then(function(resp) {
      //handle success
    })
    .catch(function(resp) {
      // handle errors
    });
  }

  //OAUTH SIGN OUT
  $scope.handleSignOutBtnClick = function() {
    $auth.signOut()
    .then(function(resp) {
        // handle success response
    })
    .catch(function(resp) {
        // handle error response
    });
  };
})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
