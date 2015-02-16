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

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [{
    id: 0,
    name: 'Ben Sparrow',
    notes: 'Enjoys drawing things',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    notes: 'Odd obsession with everything',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlen',
    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    notes: 'I think he needs to buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    notes: 'Just the nicest guy',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];


  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
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

.factory('SharedProperties', function($auth) {
  var currentUser = {}
  return {
    setUser: function(user) {
      currentUser = user
    },
    userImageUrl: function() {
      return currentUser.image
    },
    userName: function() {
      return currentUser.name
    }
  }
})

// USERS FACTORY
.factory('userService', function($http) {
  var users = [];
  return {
    getUsers: function(){
      // CURRENT USER IS NOT WORKING
      // pass in params of user_id because current_user not working on server side yet
      // hard coded current user to be user_id: 1
      return $http.get("http://localhost:3000/users", 
                      { params: { user_id: 1 } })
      .then(function(response){
        users = response.data;
        return users;
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
  var house;
  var createdHouse;
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

// example of post factory
// return $http.post("https://www.yoursite.com/method",{param: value}).then(function(response){
//   users = response;
//   return users;
// });


















