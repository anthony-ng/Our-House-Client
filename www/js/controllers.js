angular.module('starter.controllers', ['ng-token-auth'])

.controller('DashCtrl', function($scope, Auth, SharedProperties) {
  //OAUTH SIGN IN
  $scope.signIn = function() {
    Auth.signIn().then(function(data){
      $scope.currentUser = data;
      SharedProperties.setUser(data)
    })
  }
  //OAUTH SIGN OUT
  $scope.signOut = function() {
    Auth.signOut()
    $scope.currentUser = null
  }
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

.controller('ProfileCtrl', function($scope, SharedProperties) {
  $scope.userImageUrl = SharedProperties.userImageUrl()
  debugger
  $scope.settings = {
    enableFriends: true
    //cool example of settings in an object
  };
});
