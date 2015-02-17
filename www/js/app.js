// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
  'starter.controllers',
  'starter.services',
  'auth0',
  'angular-storage',
  'ngCordova',
  'angular-jwt'])



.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider, authProvider, $httpProvider,
  jwtInterceptorProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl',
  })

  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    data: {
        requiresLogin: true
    }
  })

  .state('tab.welcome', {
    url: '/welcome',
    views: {
      'tab-welcome': {
        templateUrl: 'templates/features/tab-welcome.html',
        controller: 'WelcomeCtrl',
        data: {
        }
      }
    }
  })

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-landing': {
        templateUrl: 'templates/features/tab-landing.html',
        controller: 'HomeCtrl',
        data: {
        requiresLogin: true
        }
      }
    }
  })

  .state('tab.payments', {
    url: '/payments',
    views: {
      'tab-payments': {
        templateUrl: 'templates/features/tab-payments.html',
        controller: 'PaymentCtrl',
        data: {
          requiresLogin: true
        }
      }
    }
  })

  .state('tab.housemates', {
    url: '/housemates',
    views: {
      'tab-housemates': {
        templateUrl: 'templates/features/tab-housemates.html',
        controller: 'HousemateCtrl',
        data: {
          requiresLogin: true
        }
      }
    }
  })

  .state('tab.development', {
    url: '/development',
    views: {
      'tab-development': {
        templateUrl: 'templates/features/tab-development.html',
        controller: 'developmentCtrl',
        data: {
          requiresLogin: true
        }
      }
    }
  });

  // Configure Auth0
  authProvider.init({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    loginState: 'login'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

  jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
    var idToken = store.get('token');
    var refreshToken = store.get('refreshToken');
    if (!idToken || !refreshToken) {
      return null;
    }
    if (jwtHelper.isTokenExpired(idToken)) {
      return auth.refreshIdToken(refreshToken).then(function(idToken) {
        store.set('token', idToken);
        return idToken;
      });
    } else {
      return idToken;
    }
  }

  $httpProvider.interceptors.push('jwtInterceptor');
}).run(function($rootScope, auth, store) {
  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        auth.authenticate(store.get('profile'), token);
      }
    }

  });
});