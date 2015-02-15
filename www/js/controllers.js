angular.module('starter.controllers', ['ng-token-auth'])

.controller('DashCtrl', function($scope, $auth, $http, Auth) {
  //OAUTH SIGN IN
  $scope.signIn = function() {
    $scope.user = Auth.signIn()
  }
  //OAUTH SIGN OUT
  $scope.signOut = function() {
    Auth.signOut()
  }

  $scope.currentUser = Auth.currentUser()

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
