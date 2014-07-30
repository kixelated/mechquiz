(function() {
  var questions, abilities, items, remainingQuestions;
  var score = 0, combo = 0;

  var finish = function() {
    $("#score").delay(2000).animate({ "line-height": "300px" }, 500);
  };

  var next = function() {
    var question = remainingQuestions.pop();
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
        var odom = $("<div>").appendTo(wdom).addClass("option icon item");
        var cdom = $("<div>").appendTo(wdom).addClass("caption");

        if (!items[name]) {
          console.log("invalid option: " + name);
        } else {
          //odom.css("background-image", "url('http://cdn.dota2.com/apps/dota2/images/items/" + name + "_lg.png')");
          odom.css("background-image", "url('img/item/" + name + ".png')");
          cdom.text(items[name].dname);
        }

        if (option == question.answer) {
          odom.addClass("answer");
        }
      } else if (type == "ability") {
        var wdom = $("<div>").appendTo(dom);
        var odom = $("<div>").appendTo(wdom).addClass("option icon ability");
        var cdom = $("<div>").appendTo(wdom).addClass("caption");

        if (!abilities[name]) {
          console.log("invalid option: " + name);
        } else {
          //odom.css("background-image", "url('http://cdn.dota2.com/apps/dota2/images/abilities/" + name + "_hp1.png')");
          odom.css("background-image", "url('img/ability/" + name + ".png')");
          cdom.text(abilities[name].dname);
        }

        if (option == question.answer) {
          odom.addClass("answer");
        }
      } else if (type == "text") {
        if (!textNode) {
          textNode = $("<div>").appendTo(dom);
        }

        var odom = $("<div>").appendTo(textNode).addClass("option text");
        odom.text(name.replace(/_/g, " "));

        if (option == question.answer) {
          odom.addClass("answer");
        }
      } else {
        console.log("unknown type " + type);
      }
    });

    var answeredCorrectly = false, answeredIncorrectly = false;

    $(".option", dom).click(function(event) {
      var elem = $(event.target);

      if (answeredCorrectly) return;
      if (elem.hasClass("correct") || elem.hasClass("incorrect")) return;

      var correct = elem.hasClass("answer");

      if (correct) {
        elem.addClass("correct");
        answeredCorrectly = true;
      } else {
        elem.addClass("incorrect");
        answeredIncorrectly = true;
      }

      if (!correct || !answeredIncorrectly) {
        if (correct) {
          combo = Math.max(combo + 1, 1);
        } else {
          combo = 0;
        }

        var diff = combo * 10;
        score += diff;

        if (diff > 0) {
          $("#score .value").text(score);

          var change = $("#score .change");
          change.css({ opacity: 1 }).animate({ opacity: 0 }, 500);
          change.text("+" + diff);
        }
      }

      if (!answeredCorrectly) {
        var remaining = $(".option:not(.incorrect)", dom).length;

        if (remaining < 2) {
          $(".option.answer", dom).addClass("correct");

          dom.delay(2500).fadeOut(500, dom.remove);
          next();
        }
      } else {
        dom.delay(1500).fadeOut(500, dom.remove);
        next();
      }
    });
  };

  var start = function() {
    $(".difficulty").click(function(event) {
      var diff = $(event.target).data("value");

      $("#instructions").fadeOut(500);
      $("#score").slideDown(500);

      remainingQuestions = _.filter(questions, function(q) { return q.difficulty == diff });
      remainingQuestions = _.shuffle(remainingQuestions);

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

      // Verify that all of the questions are valid.
      _.each(questions, function(question) {
        var answered = false;

        _.each(question.options, function(option) {
          var parts = option.split("/");
          var type = parts[0], name = parts[1];

          if (type == "item") {
            if (!items[name]) {
              console.log("unknown item " + name);
            }
          } else if (type == "ability") {
            if (!abilities[name]) {
              console.log("unknown ability " + name);
            }
          } else if (type != "text") {
            console.log("unknown type " + type);
          }

          if (option == question.answer) answered = true;
        });

        if (!answered) {
          console.log("impossible answer " + question.answer);
        }
      });

      start();
    });

    allReq.fail(function() {
      alert("failed to load dependencies, please refresh the page");
    });
  });
})();
