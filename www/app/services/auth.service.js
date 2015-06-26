angular.module('gisMobile')
    .factory('Auth', function($base64, $http, $resource){
        var auth = {};

        function login(){
            // modify the Authorization header to send the username &amp; password
            // $http.defaults.headers.common.Authorization = 'Basic ';
            // get the Resource object w/ custom "get" method
            var res = $resource('/auth', {
                grant_type: 'password',
                username: 'my-user',
                password: 'my-password',
                scope: 'read'
            }, 
               {
                get: {
                    method: 'POST', 
                    headers: {
                        Authorization: 'Basic ' + $base64.encode('my-client:')
                    }
                }
            });
            // need to actually execute the request; do whatever with this
            res.get(function(res){
                auth.accessToken = res.access_token;
                auth.refreshToken = res.refresh_token;
                // console.log(res)
                console.log(auth);

            }, function(e){console.log(e)});
        }

        function isLoggedIn(){
            return !!auth.accessToken;
        }

        function accessToken(){
            return auth.accessToken;
        }

        function logout(){
            //Do something to logout ...
        }

        return {
            login: login,
            isLoggedIn: isLoggedIn,
            accessToken: accessToken
        }

    });