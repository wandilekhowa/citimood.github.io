
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
  }) .when('/profile/:userID/:name/:hometown', 
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



var summation = function(arrayNums)
{
	var count=0;
   	for (var i=0;i<arrayNums.length;i++) 
   	{
       count+=arrayNums[i];
   	}
   	return count;
};

var formatDate = function(d)
    {
      date = new Date(d)
      var dayOfPost = date.getDay();
      return dayOfPost;
    };

    var ConvertUTCTimeToLocalTime = function(UTCDateString)
    {
        var convertdLocalTime = new Date(UTCDateString);

        var hourOffset = convertdLocalTime.getTimezoneOffset() / 60;

        convertdLocalTime.setHours( convertdLocalTime.getHours() + hourOffset ); 

        return convertdLocalTime;
    };

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

app.controller("ProfileCtrl", function($scope, $http, $firebaseArray, $firebaseAuth, $firebaseObject,$routeParams,$location,$window,currentAuth) 
{
	$scope.grandTotal = 0;
	$scope.bestPosts = [];
	$scope.sumL = 0;
	$scope.sumC = 0;
	$scope.userName = $routeParams.name;		
	console.log($scope.userName);
	$scope.profilePic = "";
	$scope.pictures = "";
	$scope.count = 0;
	$scope.captionScores = [];
  var id = $routeParams.userID;
  $scope.ref = firebase.database().ref().child("Users");
  $scope.Users = $firebaseArray($scope.ref.child($routeParams.userID));
  $scope.pictures = [];
  console.log($routeParams.userID);
  $scope.home = $routeParams.userHometown;
  FB.api('/me?fields=id,name,cover,hometown,about,bio,gender,picture,locale,location,updated_time,timezone,work', function(response) 
  {
    console.log(response);
    $scope.profilePic = response.picture.data.url;
    $scope.coverPic = response.cover.source;
    $scope.ref.child($routeParams.userID).child("Personal").push(response);
  });

  FB.api('/'+$routeParams.userID+'/albums?fields=id,count,cover_photo,created_time,description,event,from,link,location,name,place,privacy,type,updated_time', function(response) 
  {
    $scope.days = [];
    $scope.picsArray = [];
    $scope.postsArray = [];
      $scope.picLikes = 0;
      $scope.commentTotal = 0;
       $scope.albumID = response.data[1].id;
       $scope.profAlbum = response.data[2].id;
       console.log(response);
       FB.api('/'+$scope.albumID+'/photos?fields=id,count,cover_photo,comments,likes,source,caption,created_time,description,event,from,link,location,name,place,privacy,type,updated_time', function(response) 
       {
            console.log(response);
            $scope.ref.child($routeParams.userID).child("Photos").push(response.data);
            var users = firebase.database().ref().child("Users");
            var userObject = $firebaseObject(users);

            userObject.$loaded().then(function() 
            {
              console.log("I am inside");
                angular.forEach(userObject, function(value, key)
                {
                  if(key==id)
                  {
                    console.log(value);
                    $scope.myPhotos = value.Photos;
                    angular.forEach($scope.myPhotos, function(value, key)
                    {
                      if(key==Object.keys($scope.myPhotos)[0])
                      {
                        for(var i=0; i<value.length;i++)
                        {
                            $scope.count += 1;
                            $scope.days.push(formatDate(value[i].created_time));
                            try
                            {
                              $scope.days.push(formatDate(value[i].created_time));
                              $scope.picLikes += value[i].likes.data.length;
                              if(value[i].likes.data.length >= $scope.sumL)
                              {
                              	$scope.sumL = value[i].likes.data.length;
                              	$scope.bestPic = value[i];
                              }
                            }
                            catch(error)
                            {

                            }
                            try
                            {
                              $scope.commentTotal += value[i].comments.data.length;
                            }
                            catch(error)
                            {

                            }
                            try
                            {
                              $scope.picsArray.push(value[i].name);
                            }
                            catch(error)
                            {

                            }
                        }
                      }
                    });
                  }
                });
            });
       });
  });

  FB.api('/'+$routeParams.userID+'/events?fields=id,attending_count,cover,category,description,declined_count,end_time,interested_count,maybe_count,name,place,start_time,timezone,type,updated_time', function(response) 
  {
      $scope.ref.child($routeParams.userID).child("Events").push(response.data);
  });

  FB.api('/'+$routeParams.userID+'/feed?fields=likes,comments,message,place,created_time, updated_time', function(response) 
  {
      $scope.postLikes = 0;
      $scope.postComments = 0;
      console.log("fetching feed");
      console.log(response);
      $scope.ref.child($routeParams.userID).child("Posts").push(response.data);
            var users = firebase.database().ref().child("Users");
            var userObject = $firebaseObject(users);
            userObject.$loaded().then(function() 
            {
              console.log("I am inside posts");
                angular.forEach(userObject, function(value, key)
                {
                  if(key==id)
                  {
                    console.log(value);
                    $scope.myPosts = value.Posts;
                    angular.forEach($scope.myPosts, function(value, key)
                    {
                      if(key==Object.keys($scope.myPosts)[0])
                      {
                        console.log(value);
                        for(var i=0; i<value.length;i++)
                        {
                          $scope.count += 1;
                            try
                            {
                              //$scope.days.push(formatDate(value[i].created_time));
                              $scope.postLikes += value[i].likes.data.length;
                            }
                            catch(error)
                            {

                            }
                            try
                            {
                              $scope.postComments += value[i].comments.data.length;
                              if(value[i].comments.data.length >= $scope.sumC)
                              {
                              	$scope.sumC = value[i].comments.data.length;
                              	$scope.bestPost = value[i];
                              }
                            }
                            catch(error)
                            {

                            }
                            try
                            {
                              $scope.postsArray.push(value[i].message);
                            }
                            catch(error)
                            {

                            }
                        }
                        $scope.totalLikes = $scope.picLikes + $scope.postLikes;
                        $scope.totalComments = $scope.postComments + $scope.commentTotal;
                        console.log("Total likes: "+$scope.totalLikes);
                        console.log("Total comments: "+$scope.totalComments);
                        console.log($scope.days.length);
                        var commonDay = $scope.days.most();
                        var differntDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                        $scope.finalDay = differntDays[commonDay[0][0]];
                        $scope.bestPosts.push($scope.bestPic);
                        $scope.bestPosts.push($scope.bestPost);
                        //$scope.bestPosts[0].created_time = ConvertUTCTimeToLocalTime($scope.bestPosts[0].created_time);
                        //$scope.bestPosts[0].updated_time = ConvertUTCTimeToLocalTime($scope.bestPosts[0].updated_time);
                        console.log($scope.finalDay);
                        console.log($scope.bestPosts);
                        console.log($scope.picsArray.length+" "+$scope.postsArray.length);
                        analyzeSentiments($scope.picsArray);
                        analyzeSentiments($scope.postsArray);
                        // console.log(summation($scope.captionScores)+" "+$scope.grandTotal);
                      }
                    });
                  }
                });
            });
  });

  var analyzeSentiments = function(mySentiments) 
  {
    // when you call this function, $scope.picArray should have an array of all 
    // your instas. Use the sentiment analysis API to get a score of how positive your 
    // captions are
    	for(var i=0;i<5;i++)
    	{
    		$http({
				url:"https://twinword-sentiment-analysis.p.mashape.com/analyze/",
				method: "GET",
				headers: {
					"X-Mashape-Key": "Fmjs327SMdmshHTjtTjZ8WXuN8ANp1NAEJwjsniGMiICvKhpSG",
				},
				params:{
					text: mySentiments[i]
				}
			}).then(function(response) {
				try
				{
					$scope.grandTotal += response.data.score;
					$scope.captionScores.push((response.data.score).toFixed(2));
				}
				catch(error)
				{

				}
			})
		}
		console.log(summation($scope.captionScores)+" "+$scope.grandTotal);
		// $http({
		// 		url:"https://api.clarify.io:443/v1/bundles",
		// 		method: "GET",
		// 		headers: {
		// 			"Authorization": "Bearer {WJvnnK8AFLQ2ch8WARAKtV3h2nS7AY}",
		// 		},
		// 	}).then(function(response) {
		// 		console.log(response);
		// 	})
}
		
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