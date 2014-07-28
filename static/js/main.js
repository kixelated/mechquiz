(function() {
  var questions, abilities, items;

  var finish = function() {
    $("#score").delay(2000).animate({ "line-height": "300px" }, 500);
  };

  var next = function() {
    var question = questions.pop();
    if (!question) {
      return finish();
    }

    var dom = $("<div>").addClass("question").prependTo("#questions");
    dom.slideUp().slideDown(500);

    var textNode;

    _.each(question.options, function(option) {
      var temp = option.split("/");
      var type = temp[0], name = temp[1];

      if (type == "item") {
        var wdom = $("<div>").appendTo(dom);
        var odom = $("<div>").appendTo(wdom).addClass("option icon");
        var cdom = $("<div>").appendTo(wdom).addClass("caption");

        odom.css("background-image", "url('http://cdn.dota2.com/apps/dota2/images/items/" + name + "_lg.png')");
        cdom.text(items[name].dname);

        if (option == question.answer) {
          odom.addClass("answer");
        }
      } else if (type == "ability") {
        var wdom = $("<div>").appendTo(dom);
        var odom = $("<div>").appendTo(wdom).addClass("option icon");
        var cdom = $("<div>").appendTo(wdom).addClass("caption");

        odom.css("background-image", "url('http://cdn.dota2.com/apps/dota2/images/abilities/" + name + "_hp1.png')");
        cdom.text(abilities[name].dname);

        if (option == question.answer) {
          odom.addClass("answer");
        }
      } else if (type == "text") {
        if (!textNode) {
          textNode = $("<div>").appendTo(dom);
        }

        var odom = $("<div>").appendTo(textNode).addClass("option text");
        odom.text(name);

        if (option == question.answer) {
          odom.addClass("answer");
        }
      }
    });

    var answered = false;

    $(".option", dom).click(function(event) {
      var elem = $(event.target);

      if (answered) return;
      answered = true;

      if (elem.hasClass("answer")) {
        elem.addClass("correct");
      } else {
        elem.addClass("incorrect");
        $(".option.answer", dom).addClass("correct");
      }

      dom.delay(2000).fadeOut(500, dom.remove);
      next();
    });
  };

  var start = function() {
    $(".difficulty").click(function(event) {
      var diff = $(event.target).data("value");

      $("#instructions").fadeOut(500);
      $("#score").slideDown(500);

      next();
    });
  };

  $(function() {
    var quizReq = $.getJSON('data/quiz.json');
    var itemReq = $.getJSON('cache/www.dota2.com/jsfeed/itemdata');
    var abilityReq = $.getJSON('cache/www.dota2.com/jsfeed/abilitydata');

    var allReq = $.when(quizReq, itemReq, abilityReq);

    allReq.done(function(quizRes, itemRes, abilityRes) {
      questions = quizRes[0].questions;
      items = itemRes[0].itemdata;
      abilities = abilityRes[0].abilitydata;

      start();
    });

    allReq.fail(function() {
      alert("failed to load dependencies, please refresh the page");
    });
  });
})();
