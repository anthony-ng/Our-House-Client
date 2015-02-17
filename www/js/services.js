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

.factory('userService', function(store, $http) {
  return {
    updateCurrentUser: function(user){
      $http.get('http://localhost:3000/users/'+ user.id).then(function(response){
        store.set('currentUser', response.data);
      })
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
.factory('houseService', function($http, store) {
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
    createHouse: function(houseName){
      return $http.post("http://localhost:3000/users/" + store.get('currentUser').id + "/houses", {"house": {"name": houseName}})
    },
    //THIS IS NOT IMPLIMENTED ON SERVER YET
    findHouse: function(code){
      return $http.post("http://localhost:3000/users/" + store.get('currentUser').id + "/houses", code)
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


















