(function() {
  var questions, abilities, items, activeQuestions;
  var score = 0, combo = 0;

  var finish = function() {
    $("#score").delay(2000).animate({ "line-height": "300px" }, 500);
  };

  var next = function() {
    var question = activeQuestions.pop();
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

    var answered = false;

    $(".option", dom).click(function(event) {
      var elem = $(event.target);

      if (answered) return;
      if (elem.hasClass("correct") || elem.hasClass("incorrect")) return;

      var correct = elem.hasClass("answer");
      if (correct) answered = true;

      elem.addClass(correct ? "correct" : "incorrect");

      if (correct) combo = Math.max(combo + 1, 0);
      else combo = Math.min(combo - 1, -1);

      if (combo != 0) {
        var diff = combo * 10;
        score += diff;

        $("#score .value").text(score);

        var change = $("#score .change");
        change.css({ opacity: 1 }).animate({ opacity: 0 }, 500);
        change.toggleClass("positive", correct);
        change.toggleClass("negative", !correct);

        if (diff > 0) diff = "+" + diff;
        change.text(diff);
      }

      if (correct) {
        answered = true;

        dom.delay(1500).fadeOut(500, function() { dom.remove() });
        next();
      } else {
        var remaining = $(".option:not(.incorrect)", dom).length;

        if (remaining < 2) {
          answered = true;
          $(".option.answer", dom).addClass("correct");

          dom.delay(2500).fadeOut(500, function() { dom.remove() });
          next();
        }
      }
    });
  };

  var start = function() {
    $(".difficulty").click(function(event) {
      var diff = $(event.target).data("value");

      $("#instructions, #difficulties").fadeOut(500);
      $("#score").slideDown(500);

      activeQuestions = _.filter(questions, function(q) { return q.difficulty == diff });
      activeQuestions = _.shuffle(activeQuestions);

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
