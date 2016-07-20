var app = angular.module("CitiMood", ["firebase", "ngRoute" ]);

app.config(function($routeProvider) 
{
	$routeProvider.when('/user_name/user_id', {
	controller: 'MainCtrl',
	templateUrl: 'Day4/home.html',
	})
});

var dateConverter = function timeConverter(UNIX_timestamp)
{
  	var a = new Date(UNIX_timestamp);
  	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  	var year = Math.round(a.getFullYear());
  	var month = months[a.getMonth()];
  	var date = a.getDate();
  	var hour = a.getHours();
  	var min = a.getMinutes();
  	var sec = a.getSeconds();
  	var amm = " AM";
  	if(hour>=12)
  	{
  		amm = " PM";
  	}
  	var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min+amm;
  	return time;
}  

app.controller("MainCtrl", function($scope, $firebaseArray) 
{
  $scope.userName = user_name;
  $scope.userId = user_id;
  $http({
    url: "http://graph.facebook.com/search?",
    method: "GET",
    params: {
        /* text:"good news everyday", */
      access_token:"269074203460979|0A8ZaIb9i_getYTt6aw_5I6LnbA",
      q: "$scope.userName"
    }
  }).then(function(response) 
  {
    console.log(response);
  })
});