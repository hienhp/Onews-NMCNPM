(function () {
  'use strict';

  angular
    .module('Onews')
    .factory('AuthenticationService', AuthenticationService);

  AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', 'UserService', 'Base64Service', 'md5'];
  function AuthenticationService($http, $cookies, $rootScope, $timeout, UserService, Base64Service, md5) {
    var service = {};

    service.Login = Login;
    service.Register = Register;
    service.SetCredentials = SetCredentials;
    service.ClearCredentials = ClearCredentials;

    return service;

    function Login(loginInfo, callback) {
      var password = md5.createHash(loginInfo.password);
      var passwordBase64 = Base64Service.encode(loginInfo.password);

      $http.post('/user/authentication', { username: loginInfo.username, password: password })
        .then(function (response) {
          callback(response, passwordBase64);
        });

    }

    function Register(user, callback) {
      var passwordBase64 = Base64Service.encode(user.password);
      user.password = md5.createHash(user.password || '');
      

      UserService.Create(user)
        .then(function (response) {
          callback(response, passwordBase64);
        });
    }

    function SetCredentials(currentUser) {

      $rootScope.globals.currentUser = currentUser;
      // if (currentUser.password) {
      //   $rootScope.globals.currentUser.password = Base64Service.encode(currentUser.password);
      // }

      //$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;

      var cookieExp = new Date();
      cookieExp.setDate(cookieExp.getDate() + 7);
      $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
    }

    function ClearCredentials() {
      $rootScope.globals = {};
      $cookies.remove('globals');
      $http.defaults.headers.common.Authorization = 'Basic';
    }
  }

})();