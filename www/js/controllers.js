angular
  .module('rotowiki.controllers', []


  )
  .controller('MainCtrl', function($scope, $http, $state, ROTOWIKI_URL) {
    $scope.latestUpdatedDocuments = [];

    var currentPage = 0;
    $scope.hasMoreDocument = true;
    var API_URL = ROTOWIKI_URL + '/api/documents?asc=-1&page={page}&pageCount=10&sort=updatedAt';

    $scope.loadNextDocuments = function(){
      currentPage = currentPage + 1;
      $http
        .get(API_URL.replace(/{page}/, currentPage))
        .success(function(documents){
          if(documents.length === 0 || documents.length < 10){
            $scope.hasMoreDocument = false;
          }
          var content;
          for(var i = 0; i < documents.length;i++ ){
            content = documents[i].content;
            if(content && content !== '' && content.length > 0){
              if(content.length > 50){
                documents[i].contentPreview = content.substring(0, 50) + '..';
              }else{
                documents[i].contentPReview = content;
              }
            }
            $scope.latestUpdatedDocuments.push(documents[i]);
          }

          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.$on('$stateChangeSuccess', function() {
      $scope.loadNextDocuments();
    });

    $scope.randomDocument = function(){
      $http
        .get(ROTOWIKI_URL + '/api/documents/random')
        .success(function(randomDocument){
          $state.go('tab.document', {title:randomDocument.title});
        });
    };

    $scope.loadNextDocuments();
  })

  .controller('DocumentFindCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('DocumentCtrl', function($scope, ROTOWIKI_URL, $state, $stateParams, $http, markdownService) {
  $http
    .get('http://roto.wiki/api/documents/' + $stateParams.title)
    .success(function(document){
      document.content = markdownService.toHTML(document.content);

      // 이미지 링크가 전부 내부링크라 앱에선 깨지므로 정규식으로 치환
      document.content = document.content.replace(/"\/api\/documents\/(\W*)\/files\/(\S*)"/g, '"http://roto.wiki/api/documents/$1/files/$2"');
      $scope.document = document;
    })
    .error(function(){
      $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
          title: '헉!!',
          template: '문서 로딩 중 오류가 발생했습니다. 개발자를 갈구세요.'
        });
        alertPopup.then(function(res) {
          console.log('Thank you for not eating my delicious ice cream cone');
        });
      };
    });

    // TODO 중복 없애자.
    $scope.randomDocument = function(){
      $http
        .get(ROTOWIKI_URL + '/api/documents/random')
        .success(function(randomDocument){
          $state.go('tab.document', {title:randomDocument.title});
        });
    };
})

.controller('SettingCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
