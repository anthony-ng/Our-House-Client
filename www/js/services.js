angular.module('starter.services', [])

.factory('Auth', function($auth) {
  var user = null
  return {
    signIn: function() {
      return $auth.authenticate('google')
      .then(function(response) {
        console.log("hello from factory")
        console.log(response)
        return response;
      })
      .catch(function(response) {
        // handle errors
      })
    },
    signOut: function() {
      $auth.signOut()
      .then(function(resp) {
      })
      .catch(function(resp) {
        // handle error response
      })
    }
  }
})

// USERS FACTORY
.factory('userFactory', function($http) {
  var housemates;
  return {
    getHousemates: function(){
      // hard coded params for now - need to refactor to use $stateParams
      return $http.get("http://localhost:3000/users")
      .then(function(response){
        housemates = response.data;
        return housemates;
      });
    },

    getHousemate: function(userId){
      // console.log("Hit the getUser function call in Factory!")
      // hard coded params for now - need to refactor to use $stateParams
      return $http.get("http://localhost:3000/users/" + userId)
      .then(function(response){
        user = response.data;
        return user;
      })
    }
  }
})

.factory('userService', function(store, $http) {
  return {
    updateCurrentUser: function(userId){
      $http.get('http://localhost:3000/users/'+ userId).then(function(response){
        store.set('currentUser', response.data);
      })
    },
    currentUser: function() {
      return store.get('currentUser');
    }
  }
})

// PAYMENTS FACTORY
.factory('paymentService', function($http, userService) {
  var payments = [];
  var payment;
  var currentUser = userService.currentUser();

  return {
    getPayments: function(){
      // hard coded params for now - need to refactor to use $stateParams
      // need to check if routes are correct - does not show payment
      // need to be refactored to show all payments for all users in current house
      return $http.get("http://localhost:3000/users/"
                      + currentUser.id
                      + "/houses/"
                      + currentUser.house_id
                      + "/payments")

      .then(function(response){
        payments = response.data;
        return payments;
      });
    },
    getPayment: function(paymentId){
      // hard coded params for now - need to refactor to use $stateParams
      return $http.get("http://localhost:3000/users/"
                      + currentUser.id
                      + "/houses/"
                      + currentUser.house_id
                      + "/payments/"
                      + paymentId)

      .then(function(response){
        payment = response.data;
        return payment;
      });
    }
  }
})

// HOUSE FACTORY
.factory('houseService', function($http, userService) {
  var house, createdHouse;
  var currentUser = userService.currentUser();

  return {
    getHouse: function(){
      // hard coded params for now - need to refactor to use $stateParams
      return $http.get("http://localhost:3000/users/"
                        + currentUser.id
                        + "/houses/"
                        + currentUser.house_id)

      .then(function(response){
        house = response.data;
        return house;
      });
    },

      // Want to refactor this to pass in form-data from the view into this function and pass in form-data
      // as second argument to $http.post method
      // Check to see if current_user is being updated to the newly created house

    //THIS IS NOT IMPLIMENTED ON SERVER YET - where am I trying to use this? Come back and review -Brian
    findHouse: function(code){
      return $http.post("http://localhost:3000/users/" + store.get('currentUser').id + "/houses", code)
    },
    createHouse: function(house, userId){
      return $http.post("http://localhost:3000/users/"
                        + userId
                        + "/houses",

                       { "house": { "name": house } },
                       { headers: { 'Content-Type': 'application/json' } })
      .then(function(response){
        userService.updateCurrentUser(userId);
      }, function(error){
        //handle failure
      })
    }
  }
})

.factory('messageService', function($http, userService) {
  var message, messages;
  var currentUser = userService.currentUser();

  return {
    getMessages: function(){
      return $http.get("http://localhost:3000/users/"
                      + currentUser.id
                      + "/houses/"
                      + currentUser.house_id
                      + "/messages")

      .then(function(response){
        message = response.data;
        return message;
      })
    },

    getMessage: function(messageId){
      return $http.get("http://localhost:3000/users/"
                      + currentUser.id
                      + "/houses/"
                      + currentUser.house_id
                      + "/messages/"
                      + messageId)

      .then(function(response){
        messages = response.data;
        return messages;
      })
    },

    createMessage: function(message){
      return $http.post("http://localhost:3000/users/"
                      + currentUser.id
                      + "/houses/"
                      + currentUser.house_id
                      + "/messages",

                       { "message": message },
                       { headers: { 'Content-Type': 'application/json' } })
    }
  }
})


















