angular.module('starter.services', [])

.factory('Messages', function() {
  // Might use a resource here that returns a JSON array

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  }
})

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
////// .factory('userService', function($http) {
.factory('userFactory', function($q, $http, userService) {
  return {
    getUsers: function(){
      console.log('inside Factory function');
      var d = $q.defer();
      // CURRENT USER IS NOT WORKING
      // pass in params of user_id because current_user not working on server side yet
      // hard coded current user to be user_id: 1
      $http.get("http://localhost:3000/users",
        { params: { user_id: 1 } })
      .success(function(response){
        console.log(response);
        d.resolve(response.data);
      }).error(function(error) {
        console.log(error);
        d.reject(error);
      });
      return d.promise;
    },

    getUser: function(userId){
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

.factory('userService', function () {
  var currentUser = {};
  return {
    currentUser: function(){
      return currentUser;
    },
    setCurrentUser: function(user) {
      currentUser = user;
    },
    removeCurrentUser: function() {
      currentUser = null;
    }
  } 
})

// PAYMENTS FACTORY
.factory('paymentService', function($http) {
  var payments = [];
  var payment;
  return {
    getPayments: function(){
      // hard coded params for now - need to refactor to use $stateParams
      // need to check if routes are correct - does not show payment
      // need to be refactored to show all payments for all users in current house
      return $http.get("http://localhost:3000/users/1/houses/1/payments")
      .then(function(response){
        payments = response.data;
        return payments;
      });
    },


    
    getPayment: function(paymentId){
      // hard coded params for now - need to refactor to use $stateParams
      return $http.get("http://localhost:3000/users/1/houses/1/payments/" + paymentId)
      .then(function(response){
        payment = response.data;
        return payment;
      });
    }
  }
})

// HOUSE FACTORY
.factory('houseService', function($http) {
  var house, createdHouse;
  return {
    getHouse: function(){
      // hard coded params for now - need to refactor to use $stateParams
      return $http.get("http://localhost:3000/users/1/houses/1")
      .then(function(response){
        house = response.data;
        return house;
      });
    },

      // Want to refactor this to pass in form-data from the view into this function and pass in form-data
      // as second argument to $http.post method
      // Check to see if current_user is being updated to the newly created house
    createHouse: function(){

      return $http.post("http://localhost:3000/users/6/houses", 
                       { "house": { "name": "DevBootCamp Test House" } },
                       { headers: { 'Content-Type': 'application/json' } })
    }
  }
})

.factory('messageService', function($http) {
  var message, messages;
  return {
    getMessages: function(){
      return $http.get("http://localhost:3000/users/1/houses/1/messages")
      .then(function(response){
        message = response.data;
        return message;
      })
    },

    getMessage: function(){
      return $http.get("http://localhost:3000/users/1/houses/1/messages/1")
      .then(function(response){
        messages = response.data;
        return messages;
      })
    },

    createMessage: function(message){
      console.log(message)
      return $http.post('http://localhost:3000/users/1/houses/1/messages', 
                       { "message": message },
                       { headers: { 'Content-Type': 'application/json' } }) 
    }
  }
})


















