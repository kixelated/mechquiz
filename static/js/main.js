(function() {
  $(function() {
    var itemReq = $.getJSON('cache/www.dota2.com/jsfeed/itemdata');
    var abilityReq = $.getJSON('cache/www.dota2.com/jsfeed/abilitydata');
    var quizReq = $.getJSON('data/quiz.json');

    var allReq = $.when(itemReq, abilityReq, quizReq);

    allReq.done(function(itemRes, abilityRes, quizRes) {
      var items = itemRes[0].itemdata;
      var abilities = abilityRes[0].abilitydata;
      var questions = quizRes[0].questions;

      _.each(questions, function(question) {

      });
    });

    allReq.fail(function() {
      alert("failed to load dependencies, please refresh the page");
    });
  });
})();
