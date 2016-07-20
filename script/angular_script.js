
var app = angular.module("citymoodApp", ["firebase","ngRoute"]) 

app.run(["$rootScope", "$location", function($rootScope, $location) 
{
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) 
  {
    if (error === "AUTH_REQUIRED") 
	{
      $location.path("/");
    }
  });
}]);

app.config( function($routeProvider) 
{
  $routeProvider.when('/', 
  {
   controller: 'SignInCtrl',
    templateUrl: 'templates/sign_in.html',
    resolve: 
	{ 
      "currentAuth":  function($firebaseAuth) 
	  {
        return $firebaseAuth().$waitForSignIn();
      }
    }
  }) .when('/profile/:id/:name/:hometown', 
  {
    controller:'ProfileCtrl',
    templateUrl:'templates/profile.html',
    resolve: 
	{
     "currentAuth":function($firebaseAuth) 
	  {
        return $firebaseAuth().$waitForSignIn();
      }
    }
  })

  var formatDate = function(d)
    {
      date = new Date(d)
      var dayOfPost = date.getDay();
      return dayOfPost;
    }

Array.prototype.most= function(num){
  if(Number(num) !== NaN)
  {
    var L= this.length, freq= [], unique= [], 
    tem, max= 1, index, count;
    while(L>= max){
        tem= this[--L];
        if(unique.indexOf(tem)== -1){
            unique.push(tem);
            index= -1, count= 0;
            while((index= this.indexOf(tem, index+1))!= -1){
                ++count;
            }
            if(count> max){
                freq= [tem];
                max= count;
            }
            else if(count== max) freq.push(tem);
        }
    }
  }
  return [freq];
}
  /*.when('/signup', 
  {
    controller: 'SignupCtrl',
    templateUrl: 'templates/signup.html',
    resolve: 
	{
     "currentAuth":function($firebaseAuth) 
	  {
        return $firebaseAuth().$waitForSignIn();
      }
    }
  }).when('/channel/:channelId', 
  {
    controller: 'ChannelCtrl',
    templateUrl: 'templates/channel.html',
    resolve: 
	{
     "currentAuth":function($firebaseAuth) 
	  {
        return $firebaseAuth().$requireSignIn();
      }
    }
  }) */;
});

app.controller("AppController", function($scope, $firebaseArray, $firebaseAuth,$routeParams,$location,$window,$location) 
{
	/* $scope.authObj = $firebaseAuth();
	$scope.sign_out=function()
	{
		localStorage.greeted=0;
		$scope.authObj.$signOut()
		$location.path("/");
	} */
});

app.controller("ProfileCtrl", function($scope, $firebaseArray, $firebaseAuth,$routeParams,$location,$window,currentAuth) 
{
	$scope.userName = $routeParams.name;		
	console.log($scope.userName);
		
		/* $scope.authObj = $firebaseAuth();
		$scope.login= function()
		{	

			$scope.authObj.$signInWithEmailAndPassword($scope.email, $scope.password)
			.then(function(firebaseUser)
			{
				$scope.nagative_message=false;
				console.log("Signed in as:", firebaseUser.uid);
				$location.path("/channels");
				
			}).catch(function(error) 
			{
				$scope.nagative_message=true;
				console.error("Authentication failed:", error);
			});
		}; */

});

app.controller("SignInCtrl", function($scope, $firebaseArray, $firebaseAuth,$routeParams,$location,$window,currentAuth) 
{
		


});

 /*  app.controller("SignupCtrl", function($scope, $firebaseArray, $firebaseAuth,$routeParams) 
 {
    $scope.authObj = $firebaseAuth();
	$scope.signUp= function() 
	  {
		$scope.authObj.$createUserWithEmailAndPassword($scope.email, $scope.password)
		  .then(function(firebaseUser) 
		  {
			var ref = firebase.database().ref().child("Users");
			$scope.users = $firebaseArray(ref);
			$scope.users.$add
			({
			  userName:$scope.name,
			  userId:firebaseUser.uid,
			  created_at:Date.now()
			});
		    window.location.href="#/channels";
			console.log("User " + firebaseUser.uid + " created successfully!");
		  }).catch(function(error) 
		  {
			$scope.nagative_message=true;
			console.error("Error: ", error);
		  });
	   };
 });



	
app.controller("HomeCtrl", function($firebaseObject,$document,$scope, $firebaseArray, $firebaseAuth,$routeParams,$location,$window,currentAuth,$location) 
{
	
	 if(localStorage.greeted!=1)
	 {
		angular.element(document.querySelector( '#lightbox' )).addClass('isVisible');
		var shadow = document.querySelectorAll(".lightbox")[0];
		
		shadow.onclick = function()
		{
			angular.element(document.querySelector( '#lightbox' )).removeClass('isVisible ');

			
			localStorage.greeted=1;
			
		}
	  }
	  
	 /*+++++++++++++++++++++++++++++++++++++++++++++++++++*
	   var users = firebase.database().ref().child("Users");
	   var users_obj = $firebaseObject(users);
	
	   //get Logged in user ID
	   $scope.authObj = $firebaseAuth();
	   var firebaseUser = $scope.authObj.$getAuth();
		
	   users_obj.$loaded().then(function() {
		   angular.forEach(users_obj, function(value, key) 
		  {
			if(firebaseUser.uid==value.userId)
			{
			 $scope.name=value.userName;
			}
          }); 
       });
	   /*+++++++++++++++++++++++++++++++++++++++++++++++++++*
	
	


  var ref = firebase.database().ref().child("channels");
	/////////////==New Channel==///////////////
	$scope.channels = $firebaseArray(ref);
	$scope.createChannel = function() 
	{
		$scope.channels.$add({
		channel:$scope.channelName,
		created_at:Date.now()
		});
	};

  
});

 app.controller("ChannelCtrl", function($scope,$firebaseObject, $firebaseArray, $firebaseAuth,$routeParams,currentAuth,$location) 
 {
 
	   /*+++++++++++++++++++++++++++++++++++++++++++++++++++*
	   var users = firebase.database().ref().child("Users");
	   var users_obj = $firebaseObject(users);

	   //get Logged in user ID
	   $scope.authObj = $firebaseAuth();
	   var firebaseUser = $scope.authObj.$getAuth();
		
	   users_obj.$loaded().then(function() {
		   angular.forEach(users_obj, function(value, key) 
		  {
			if(firebaseUser.uid==value.userId)
			{
			 $scope.name=value.userName;
			}
          }); 
       });
	   /*+++++++++++++++++++++++++++++++++++++++++++++++++++*
		
 
	   var ref = firebase.database().ref().child("messages").child($routeParams.channelId);
	   $scope.messages = $firebaseArray(ref);

	  $scope.channel_id=$routeParams.channelId;
	  /////////////==New Message==//////////////
	  $scope.sendMessage = function() 
	  {
		$scope.messages.$add({
		  sender:$scope.name,
		  text: $scope.newMessage, 
		  created_at:Date.now()
		});
		
		$scope.newMessage="";
	  }; 

	  
 });
 */
















