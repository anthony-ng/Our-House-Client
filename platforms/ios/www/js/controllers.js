angular.module('starter.controllers', ['ionic', 'ngCordova'])

// ******************************** LOGIN CONTROLLER **********************************************
.controller('LoginCtrl', function($scope, auth, $state, store, $http) {
  auth.signin({
    closable: false,
    authParams: {
      scope: 'openid offline_access'
    }
  }, function(profile, idToken, accessToken, state, refreshToken) {
    store.set('profile', profile);
    store.set('token', idToken);
    store.set('refreshToken', refreshToken);
    $http.post('http://localhost:3000/users', store.inMemoryCache.profile).then(function(response){
      store.set('currentUser', response.data);
      $state.go('tab.home');
    })
  }, function(error) {
    console.log("There was an error logging in", error);
  });
})

.controller('HomeCtrl', function($timeout, $scope, $ionicModal, $http, store, $state, userService, houseService, userFactory, messageService, auth) {
  $scope.check = {};
  $scope.check.Notif = true;
  $scope.check.Activity = true;
  $scope.check.Task = true;
  $scope.currentUser = store.get('currentUser')
  $scope.house = {}
  $scope.addHousemates = false;
  messageService.getMessages().then(function(response){
    $scope.messages = response;
  })

  $scope.doRefresh = function() {
    messageService.getMessages().then(function(response){
      $scope.messages = response;
      $scope.$broadcast('scroll.refreshComplete');
    })
  };

  $scope.deleteMessage = function(message){
    messageService.deleteMessage(message.view.id)
    $scope.messages.splice($scope.messages.indexOf(message),1)
    $scope.closemessageDetailModal(message)
  }


  //show message detail modal
  $ionicModal.fromTemplateUrl('templates/tab-message-detail-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.messageDetailModal = modal;
  });
  $scope.openMessageDetailModal = function(message) {
    var id = "message" + message.id
    $scope[id] = true
    $scope.messageDetailModal.show();
    message.view.read = true;
    messageService.readMessage(message.view.id)
  };
  $scope.closemessageDetailModal = function(message) {
    var id = "message" + message.id
    $scope[id] = false;
    $scope.messageDetailModal.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.messageDetailModal.remove();
  });
  $scope.$on('messageDetailModal.hidden', function() {
  });
  $scope.$on('messageDetailModal.removed', function() {
  });


  //show feed filter modal
  $ionicModal.fromTemplateUrl('templates/viewFeedFilterHome.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.feedFilterModal = modal;
  });
  $scope.openfeedFilterModal = function() {
    $scope.feedFilterModal.show();
  };
  $scope.closefeedFilterModal = function() {
    $scope.feedFilterModal.hide();
  };
  $scope.$on('$destroy', function() {
    $scope.feedFilterModal.remove();
  });
  $scope.$on('feedFilterModal.hidden', function() {
  });
  $scope.$on('feedFilterModal.removed', function() {
  });



  //logic to decide if they need to add/create a house
  if ($scope.currentUser.house_id === null) {
    $scope.NoHouse = true;
  } else {
    $scope.NoHouse = false;
  }
  userFactory.getHousemates().then(function(data){
      $scope.housemates = data
  })

  //for adding housemates
  $scope.newHousemates = [{"email":"" }]
  $scope.addNewHousemate = function() {
    $scope.newHousemates.push({"email":"" })
  }

  $scope.findOrCreateHouse = function() {
    houseService.createHouse($scope.house.name, $scope.currentUser.id).then(function(){
      $scope.addHousemates = true;
      $scope.NoHouse = false;
    })
  }

  $scope.sendInvite = function() {
    $scope.addHousemates = false; //hides the add housemate section
  }

  //logging out, duh
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    store.remove('currentUser');
    $state.go('login');
  }
})

// ******************************** HOUSEMATE CONTROLLER *******************************************
.controller('HousemateCtrl', function($ionicPopup, $scope, userFactory, auth, store,
                                      $state, $http, $ionicModal, messageService, $ionicSlideBoxDelegate) {

  // Feature code for Housemates View
  $scope.newHousematesToBeAdded = [ { "email": "" } ];
  // Set up basic templating function
  $scope.addNewHousemate = function() {
    $scope.newHousematesToBeAdded.push({"email":""});
  }

  // logout
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    store.remove('currentUser');
    $state.go('login');
  };

  $scope.currentUser = store.get('currentUser');

  userFactory.getHousemates().then(function(data){
    $scope.housemates = data
  });

// HOUSEMATE MODAL
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
    $scope.newHousemates = [ {"email": ""}]
  };
  $scope.submitAddHousemateModal = function() {
    // invoke a factory to submit a post request to update the users
    // and invite them to the house
    // $scope.newHousemates
    $scope.addHousemateModal.hide();
  }

// PROFILE Modal
  $ionicModal.fromTemplateUrl('templates/profileOverviewModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.profileModal = modal;
  });
  // Get Individual Profile Modal
  $scope.openProfileModal = function(userId) {
    userFactory.getHousemate(userId).then(function(data) {
      $scope.currentUserProfile = data;
    })
    $scope.profileModal.show();
  };
  $scope.closeProfileModal = function() {
    $scope.profileModal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.profileModal.remove();
  });
  // Execute action on hide modal
  $scope.$on('profileModal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('profileModal.removed', function() {
    // Execute action
  }); // END PROFILE MODAL


  $scope.messages = [];
  messageService.getMessages().then(function(response){
    $scope.messages = response;
    console.log($scope.messages);
  });

// PROFILE DETAILS MODAL
  $ionicModal.fromTemplateUrl('templates/features/profileDetailModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.profileDetailModal = modal;
  });
  $scope.openProfileDetailModal = function() {
    console.log($ionicSlideBoxDelegate.currentIndex());
    $scope.profileDetailModal.show();
  }
  $scope.closeProfileDetailModal = function() {
    $scope.profileDetailModal.hide();
  }

  $scope.firstTab = true;
  $scope.updateSelectedTab = function(index) {
    console.log("running updateSelectedTab function");
    console.log(index);

    $scope.firstTab = false;
    $scope.secondTab = false;
    $scope.thirdTab = false;
    switch (index){
      case 0:
        $scope.firstTab = true;
        break;
      case 1:
        $scope.secondTab = true;
        break;
      case 2:
        $scope.thirdTab = true;
        break;
    }
  };

  $scope.slideTop = function(index) {
    console.log("slideTo invoked");
    // $ionicSlideBoxDelegate.slide(index);
    // $scope.updateSelectedTab(index);
  };

  var getSliderIndex = function() {
    return $ionicSlideBoxDelegate.currentIndex();
  };

})


// ******************************** PAYMENT CONTROLLER ********************************************
.controller('PaymentCtrl', function($scope, paymentService, auth, store, $state, $http, $ionicPopup){

  $scope.payment = {}
  $scope.currentUser = store.get('currentUser');

  $scope.sendPayment = function() {
    $http.post('http://localhost:3000/venmo', $scope.payment).then(function(response){
      $scope.showAlert()
      $scope.payment = {}
    })
  }

  $scope.venmoLogin = function(){
    var ref = window.open("http://api.venmo.com/v1/oauth/authorize?client_id=2374&scope=make_payments%20access_profile%20access_email%20access_phone%20access_balance&response_type=code&state=" + $scope.currentUser.id, '_blank', 'location=yes'); return false;

  }

  $scope.doRefresh = function() {
    $http.post('http://localhost:3000/users', store.inMemoryCache.profile).then(function(response){
      store.set('currentUser', response.data);
      $scope.currentUser = store.get('currentUser');
      $scope.ass = true;
      $scope.$broadcast('scroll.refreshComplete');
    })
  };

  $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: "Payment Successfully Sent"
   });
   alertPopup.then(function(res) {
   });
 };
})

// ******************************** HOUSE CONTROLLER **********************************************
.controller('HouseCtrl', function($scope, houseService, auth, store, $state, $http, userService){
// removed content - this contained only development functions
})


.controller('CreateMessageCtrl', function($scope, messageService, auth, store, $state, $http){
  $scope.message = { content: "", type: "" };

  $scope.createMessage = function() {
    // console.log($scope.message)
    messageService.createMessage($scope.message).then(function(data){
      console.log(data);
      $scope.message = { content: "", type: "" };
    })
  }
})







