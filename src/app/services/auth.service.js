angular.module('gisMobile')
    .run(function($rootScope, $injector, Auth){
        $injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
          if (Auth.isLoggedIn()) {
            headersGetter()['Authorization'] = "Bearer " + Auth.accessToken();
          }
          if (data) {
            console.log(data);
            return angular.toJson(data);
          }
        };
    })
    .factory('Auth', function($base64, $http, $resource, $q, LOGIN_URL, LOGIN_CLIENT, localStorage, LOGIN_TEST_URL){
        var auth = {};

        function login(username, password){
            var defer = $q.defer();
            // modify the Authorization header to send the username &amp; password
            // $http.defaults.headers.common.Authorization = 'Basic ';
            // get the Resource object w/ custom "get" method
            var res = $resource(LOGIN_URL, {
                grant_type: 'password',
                username: username,
                password: password,
                scope: 'read'
            }, 
               {
                get: {
                    method: 'POST', 
                    headers: {
                        Authorization: 'Basic ' + $base64.encode(LOGIN_CLIENT + ':')
                    }
                }
            });

            // need to actually execute the request; do whatever with this
            res.get(function(res){
                auth.id = LOGIN_CLIENT;

                auth.accessToken = res.access_token;
                auth.refreshToken = res.refresh_token;

                localStorage.saveAuth(auth)
                .then(function(){
                    return defer.resolve(defer);
                });
            }, function(e){ 
                return defer.reject(e);
            });

            return defer.promise;
        }

        function isLoggedIn(){
            return !!auth.accessToken;
        }

        function accessToken(){
            return auth.accessToken;
        }

        function refreshToken(){
            var defer = $q.defer();

            auth.accessToken = false;
            var res = $resource(LOGIN_URL, {
                grant_type: 'refresh_token',
                refresh_token: auth.refreshToken,
                scope: 'read'
            }, 
               {
                get: {
                    method: 'POST', 
                    headers: {
                        Authorization: 'Basic ' + $base64.encode(LOGIN_CLIENT + ':')
                    }
                }
            });

            // need to actually execute the request; do whatever with this
            res.get(function(res){
                auth.id = LOGIN_CLIENT;

                auth.accessToken = res.access_token;
                auth.refreshToken = res.refresh_token;

                localStorage.saveAuth(auth)
                .then(function(){
                    return defer.resolve(defer);
                });
            }, function(e){
                return defer.reject(e);
            });

            return defer.promise;
        }

        function testConnection(){
            var defer = $q.defer();
            auth = {};
            
            localStorage.getAuth()
            .then(function(storedAuth){
                auth = storedAuth;
                return $http.get(LOGIN_TEST_URL)
                .catch(function(e){
                    return refreshToken();
                });
            })
            .then(function(){
                defer.resolve(true);
            })
            .catch(function(e){
                console.log(e);
                defer.resolve(false);
            });
            return defer.promise;
        }

        function logout(){
            auth = {};
            return localStorage.removeAuth();
        }

        return {
            login: login,
            logout: logout,
            isLoggedIn: isLoggedIn,
            accessToken: accessToken,
            testConnection: testConnection
        }

    });