'use strict';

// Articles controller
angular.module('profile').controller('ProfileController', ['$scope', '$stateParams', '$location', 'Authentication', 'Profiles',
  function ($scope, $stateParams, $location, Authentication, Profiles) {
    $scope.authentication = Authentication;
/*
    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('articles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;

      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };
*/
    $scope.inFriendsList = function() {
      if (Authentication.user.friends.indexOf($scope.Profile.profileId) > -1) {
        return true;
      } else {
        return false;
      }
    };

    $scope.sendFriendRequestFromProfile = function() {
      console.log("Send Friend Request Clicked");
      $scope.message = Profiles.friendRequest();
      /*
          things to check:
            is user the same person?
            is user already friends?
            is user banned/flagged?
            does other friend/user actually exist? (resolve check)
            ?max friend requests?

      */
    };

    // Find existing Article
    $scope.findOne = function () {
      if (!$stateParams.profileId) {
        $stateParams.profileId = Authentication.user._id;
      }
      $scope.Profile = Profiles.get({
        profileId: $stateParams.profileId
      });
    };
  }
]);
