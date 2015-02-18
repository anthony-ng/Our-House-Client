


angular.module('starter.controllers', ['ionic', 'ngCordova'])

// LOGIN CONTROLLER
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

.controller('HomeCtrl', function($scope, $http, store, $state, userService, houseService, userFactory) {
  $scope.currentUser = store.get('currentUser')
  $scope.house = {}
  $scope.addHousemates = false;
  if ($scope.currentUser.house_id === null) {
    $scope.NoHouse = true;
    debugger;
  } else {
    $scope.NoHouse = false;
    debugger;
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

})

.controller('HousemateCtrl', function($scope, userFactory, auth, store, $state, $http, $ionicModal) {

  console.log('INSIDE USERCTRL')
  // refactor into a helper???
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    store.remove('currentUser');
    $state.go('login');
  }

  $scope.newHousemates = [{"email":"" }]
  $scope.addNewHousemate = function() {
    $scope.newHousemates.push({"email":"" })
  };

  $scope.currentUser = store.get('currentUser');

  userFactory.getHousemates().then(function(data){
    $scope.housemates = data
  });

  // DEVELOPMENT ONLY
  $scope.clickToGetUsers = function() {
    userFactory.getHousemates().then(function(data){
      console.log(data);
    })
  };

  // DEVELOPMENT ONLY
  $scope.getHousemate = function(userId) {
    userFactory.getHousemate(userId).then(function(data){
      console.log(data);
    })
  }

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

//DEVELOPMENT CONTROLLER
.controller('developmentCtrl', function($scope, userFactory, auth, store, $state, $http, $ionicModal) {

  console.log('INSIDE USERCTRL')
  // refactor into a helper???
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    store.remove('currentUser');
    $state.go('login');
  }
    $scope.currentUser = store.get('currentUser')
    userFactory.getHousemates().then(function(data){
      $scope.housemates = data
    })
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

  // DEVELOPMENT ONLY
  paymentService.getPayments().then(function(data){
    $scope.payments = data;
  })

  // DEVELOPMENT ONLY ***** replace hard coded payment ID *******
  paymentService.getPayment(1).then(function(data){
    $scope.payment = data;
  })

  // DEVELOPMENT ONLY
  $scope.clickToGetPayments = function() {
    paymentService.getPayments().then(function(data){
      console.log(data); // returns an array
      // $scope.payment = data;
    })
  }

  // DEVELOPMENT ONLY
  $scope.getPayment = function(paymentId) {
    paymentService.getPayment(paymentId).then(function(data){
      console.log(data.description);
      // $scope.payment = data;
    })
  }
})

// HOUSE CONTROLLER
.controller('HouseCtrl', function($scope, houseService, auth, store, $state, $http){

  // DEVELOPMENT ONLY
  $scope.clickToCreate = function(house) {
    houseService.createHouse(house).then(function(data){
      console.log(data.data);
    })
  }

  // DEVELOPMENT ONLY
  $scope.clickToGetHouse = function() {
    houseService.getHouse().then(function(data){
      console.log("House name: " + data.name);
    })
  }
})

.controller('MessageCtrl', function($scope, messageService, auth, store, $state, $http){

  // DEVELOPMENT ONLY
  $scope.clickToGetMessages = function() {
    messageService.getMessages().then(function(data){
      console.log(data);
    })
  }

  // DEVELOPMENT ONLY
  $scope.getMessage = function(messageId) {
    messageService.getMessage(messageId).then(function(data){
      console.log(data);
    })
  }

  // DEVELOPMENT ONLY
  $scope.createMessage = function(message) {
    messageService.createMessage(message).then(function(data){
      console.log(data);
    })
  }
})







