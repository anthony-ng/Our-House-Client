angular.module('starter.controllers', ['ionic'])

// LoginCtrl.js
.controller('LoginCtrl', function($scope, auth, $state, store) {
  auth.signin({
    closable: false,
    // This asks for the refresh token
    // So that the user never has to log in again
    authParams: {
      scope: 'openid offline_access'
    }
  }, function(profile, idToken, accessToken, state, refreshToken) {
    store.set('profile', profile);
    store.set('token', idToken);
    store.set('refreshToken', refreshToken);
    $state.go('tab.dash');
  }, function(error) {
    console.log("There was an error logging in", error);
  });
})

.controller('DashCtrl', function($scope, $http) {

  // here we want to do a get request to obtain all of the messages and payments
  // think about refactoring to use helpers to obtain all messages/payments and
  // to list them as individual color coded notifications/widgets that appear as a notice item

})

.controller('MessagesCtrl', function($scope, Chats, $ionicModal) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
    }


    $ionicModal.fromTemplateUrl('templates/filterModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openFilterModal = function() {
      $scope.modal.show();
    };
    $scope.closeFilterModal = function() {
      $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });



    $ionicModal.fromTemplateUrl('templates/createMessageModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openMessageModal = function() {
        $scope.modal.show();
      };
      $scope.closeMessageModal = function() {
        $scope.modal.hide();
      };
      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });
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
  $scope.logout = function() {
  auth.signout();
  store.remove('profile');
  store.remove('token');
}
  // $scope.userImageUrl = SharedProperties.userImageUrl().replace("sz=50", "sz=150")

  $scope.settings = {
    enableFriends: true
    //cool example of settings in an object
  };
})

.controller('UserCtrl', function($scope, userService, auth, store, $state, $http, $ionicModal) {
  // refactor into a helper???
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login');
  }

  $scope.housemates = [{ 'name': 'Brian', 'image': 'https://lh6.googleusercontent.com/-HnwngPrmnwg/AAAAAAAAAAI/AAAAAAAAEBc/eK_JEkkF8PU/photo.jpg?sz=115' },
                       { 'name': 'Ali', 'image': 'https://lh6.googleusercontent.com/-mwCXAtzGIkI/VOHexGey4qI/AAAAAAAAAGk/XNZGMzXhb5w/Ali.jpg?sz=115' },
                       { 'name': 'Joseph', 'image': 'https://lh4.googleusercontent.com/-aM_REDBqm_Y/VJi8SkkpF_I/AAAAAAAAAz0/sFd0I5s4xcU/9a5fec30-83a1-423e-870a-2723782d19e1?sz=115' },
                       { 'name': 'Charles', 'image': 'https://lh3.googleusercontent.com/-nHuV3Iw9jS8/T6d2GmpDX4I/AAAAAAAAADU/sZRTWXlsA8Q/122.png?sz=115' },
                       { 'name': 'Anthony', 'image': 'https://lh5.googleusercontent.com/-1Y-ZXEXERWE/VBeSkL18LUI/AAAAAAAAExM/XFA1xNMzvH4/new%2Bprofile%2Bpic1.jpg?sz=115' }
                       ]

  $scope.newHousemates = [{"email":"" }]
  $scope.addNewHousemate = function() {
    $scope.newHousemates.push({"email":"" })
  }
  userService.getUsers().then(function(data){
    $scope.users = data;
  })
  // debugger;

  // // Written as example in order to call API based on a button click
  // $scope.callApi = function() {
  //   // Just call the API as you'd do using $http
  //   $http({
  //     url: 'http://localhost:3000/users',
  //     method: 'GET'
  //   }).then(function() {
  //     alert("We got the secured data successfully");
  //   }, function() {
  //     alert("Please download the API seed so that you can call it.");
  //   });
  // }
  // debugger;


    $ionicModal.fromTemplateUrl('templates/addHousemateModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.addHousemateModal = modal;
    });
    $scope.openAddHousemateModal = function() {
      $scope.addHousemateModal.show();
    };
    $scope.closeAddHousemateModal = function() {
      $scope.addHousemateModal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.addHousemateModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('addHousemateModal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('addHousemateModal.removed', function() {
      // Execute action
    });


})


.controller('PaymentCtrl', function($scope, paymentService, auth, store, $state, $http){
  // refactor into a helper???
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login');
  }

  paymentService.getPayments().then(function(data){
    $scope.payments = data;
  })

})
