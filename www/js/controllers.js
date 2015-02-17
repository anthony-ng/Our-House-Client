


angular.module('starter.controllers', ['ionic', 'ngCordova'])

// LoginCtrl.js
.controller('LoginCtrl', function($scope, auth, $state, store, $http, userService) {
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
    $http.post('http://localhost:3000/users', store.inMemoryCache.profile).then(function(response){
      userService.setCurrentUser(response.data)
      store.set('currentUser', response.data);
    })
    $state.go('tab.home');
  }, function(error) {
    console.log("There was an error logging in", error);
  });
})

.controller('WelcomeCtrl', function() {
})

.controller('HomeCtrl', function($scope, $http, auth, store, $state) {
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    // store.remove('currentUser');

    $state.go('login');
  }


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


// .controller('ProfileCtrl', function($scope, SharedProperties) {

//   $scope.userImageUrl = SharedProperties.userImageUrl().replace("sz=50", "sz=150")

//   $scope.settings = {
//     enableFriends: true
//   };
// })

.controller('HousemateCtrl', function($scope, userService, userFactory, auth, store, $state, $http, $ionicModal, userService) {

  console.log('INSIDE USERCTRL')
  // refactor into a helper???
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login');
  }
    userFactory.getHousemates().then(function(data){
      $scope.housemates = data
    })


  // userService.getUsers().then(function(data){
  //   $scope.users = data;
  // })

  // Use for DEVELOPMENT TAB to test the housemates button
  // tied to button to click "Get Users"
  // *****************************************************
  // $scope.clickToGetUsers = function() {
  //   userService.getUsers().then(function(data){
  //     var alertData = [];
  //     for(var i=0; i<data.length; i++) {
  //       alertData.push(
  //         data[i].name);
  //     }
  //     alert(alertData);
  //     // $scope.users = data;
  //   })
  // }

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

// PAYMENT CONTROLLER
.controller('PaymentCtrl', function($scope, paymentService, auth, store, $state, $http){
  $scope.payment = {}

  $scope.sendPayment = function() {
    $http.post('http://localhost:3000/venmo', $scope.payment).then(function(response){
      //DO SOMETHING ON SUCCESS (REMOVE FIELDS, SUCCESS MODAL...ETC)
    })
  }
  var user = store.inMemoryCache.profile.user_id
  var venmoAuthUrl = "https://api.venmo.com/v1/oauth/authorize?client_id=2374&scope=make_payments%20access_profile%20access_email%20access_phone%20access_balance&response_type=code&state=" + user

  $scope.venmoLogin = function(){
    var ref = window.open(venmoAuthUrl, '_blank', 'location=no');
    ref.addEventListener('loadstart');
    ref.addEventListener('loadstart', function() { alert(event.url); });
    ref.addEventListener('loadstop', function(event){
      if (event.url.match("/close")) {
        ref.close();
      }
    })
  }

  paymentService.getPayments().then(function(data){
    $scope.payments = data;
  })
  //1 should be repalced with the variable id, i.e. getPayment(id) 
  paymentService.getPayment(1).then(function(data){
    $scope.payment = data;
  })

  $scope.clickToGetPayments = function() {
    paymentService.getPayments().then(function(data){
      console.log(data); // returns an array
      // $scope.payment = data;
    })
  }

  $scope.getPayment = function(paymentId) {
    paymentService.getPayment(paymentId).then(function(data){
      console.log(data.description);
      // $scope.payment = data;
    })
  }
})

// HOUSE CONTROLLER
.controller('HouseCtrl', function($scope, houseService, auth, store, $state, $http){

  // needs to pass in params from a form - the params are currently hard coded in the factory helper
  $scope.clickToCreate = function() {
    houseService.createHouse().then(function(data){
      console.log("House has successfully been created");
    })
  }

  $scope.clickToGetHouse = function() {
    houseService.getHouse().then(function(data){
      console.log("House name: " + data.name);
    })
  }
})

.controller('MessageCtrl', function($scope, messageService, auth, store, $state, $http){

  $scope.clickToGetMessages = function() {
    messageService.getMessages().then(function(data){
      console.log(data);
    })
  }

  $scope.getMessage = function() {
    messageService.getMessage().then(function(data){
      console.log(data);
    })
  }

  $scope.createMessage = function(message) {
    messageService.createMessage(message).then(function(data){
      console.log(data);
    })
  }
})







