angular.module('rotowiki.services', [])
.factory('Documents', function($resources){

})
.service('markdownService', function () {
  return {
    scriptBurst: function(markdownText){
      return markdownText
        .replace(/(<[sS][cC][rR][iI][pP][tT].*>)/gm, '')
        .replace(/(\/<[sS][cC][rR][iI][pP][tT].*>)/gm, '');
    },
    toHTML: function(markdownText) {
      markdownText = this.scriptBurst(markdownText);
      markdownText = this.applyCustomHTMLSyntax(markdownText);
      markdownText = window.marked(markdownText);

      return markdownText;
    },
    applyCustomHTMLSyntax: function(markdownText){
      var regExps = [
        {
          regExp: '(&amp;|&)\\[(.*?)\\|(.*?)\\]', // ex) &[link title|document_title]
          replace: '[$2](/document/$3)'
        },
        {
          regExp: '(&amp;|&)\\[(.*?)\\]', // ex) &[document_title]
          replace: '[$2](/document/$2)'
        },
        {
          regExp: '-\\[(.*?)\\]', // ex) -[text]
          replace: '<strike>$1</strike>'
        },
        {
          regExp: '\\*\\[(.*?)\\|(.*?)\\]', // ex) *[text|external_link]
          replace:'<a href="$2" target="_blank">$1<i class="fa fa-external-link"></i></a>'
        },
        {
          regExp: '\\^\\[(0-9)\\|(.*?)\\]', // ex) ^[3|내용]
          replace: '' // TODO tooltip 만들자.
        }
        //'(```)([\\w]*)\\n([\\d\\D]*){1,}(```)': '<pre><code class="language-$2">$3</code></pre>',
      ];

      for(var i = 0; i < regExps.length; i++){
        markdownText = markdownText.replace(new RegExp(regExps[i].regExp, 'gm'), regExps[i].replace);
      }
      return markdownText;

    }
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

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
  };
});
