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

.controller('HomeCtrl', function($scope, $http, store, $state, userService, houseService, userFactory, messageService) {
  //set default values based on user state
  $scope.Notif = true;
  $scope.Task = true;
  $scope.Activity = true;
  $scope.noMessageDetail = true;
  $scope.currentUser = store.get('currentUser')
  $scope.house = {}
  $scope.addHousemates = false;
  messageService.getMessages().then(function(response){
    $scope.messages = response;
  })

  $scope.showMessageDetail = function(message){
    messageService.readMessage(message.view.id)
    var id = "message" + message.id
    $scope.noMessageDetail = false
    $scope[id] = true
  }
  $scope.closeMessageDetail = function(message){
    var id = "message" + message.id
    $scope.noMessageDetail = true
    $scope[id] = false
  }

  $scope.deleteMessage = function(message){
    var id = "message" + message.id
    messageService.deleteMessage(message.view.id)
    $scope.noMessageDetail = true
    $scope[id] = false
    $scope.messages.slice($scope.messages.indexOf(message),1)
  }

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
})

// ******************************** HOUSEMATE CONTROLLER *******************************************
.controller('HousemateCtrl', function($scope, userFactory, auth, store, $state, $http, $ionicModal, messageService) {

  // Feature code for Housemates View
  $scope.newHousematesToBeAdded = [ { "email": "" } ];
  // Set up basic templating function
  $scope.addNewHousemate = function() {
    $scope.newHousematesToBeAdded.push({"email":""});
  }

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
    // empty out the template form
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

// PROFILE DETAILS
// ACHIEVEMENTS MODAL
  $ionicModal.fromTemplateUrl('templates/features/achievementsModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.achievementsModal = modal;
  });
  $scope.openAchievementsModal = function() {
    $scope.notifsModal.hide();
    $scope.activitiesModal.hide();
    $scope.achievementsModal.show();
  }
  $scope.closeAchievementsModal = function() {
    $scope.achievementsModal.hide();
  }

// NOTIFS MODAL
  $ionicModal.fromTemplateUrl('templates/features/notifsModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.notifsModal = modal;
  });
  $scope.openNotifsModal = function() {
    $scope.activitiesModal.hide();
    $scope.achievementsModal.hide();
    $scope.notifsModal.show();
  }
  $scope.closeNotifsModal = function() {
    $scope.notifsModal.hide();
  }

// ACTIVITIES MODAL
  $ionicModal.fromTemplateUrl('templates/features/activitiesModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.activitiesModal = modal;
  });
  $scope.openActivitiesModal = function() {
    $scope.notifsModal.hide();
    $scope.achievementsModal.hide();
    $scope.activitiesModal.show();
  }
  $scope.closeActivitiesModal = function() {
    $scope.activitiesModal.hide();
  }
})

// ******************************** PAYMENT CONTROLLER ********************************************
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







