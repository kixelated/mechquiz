(function() {
  var questions, abilities, items, currentQuestions;
  var score = 0, combo = 0;
  var statsCorrect, statsTotal;
  var started = false;

  var speed = 1000;

  var finish = function() {
    setTimeout(function() {
      started = false;
      $("#spacer, #difficulties").toggleClass("slideUp slideDown");

      setTimeout(function() {
        if (started) return;

        $("#stats").toggleClass("slideUp slideDown");
        $("#stats .correct").text(statsCorrect);
        $("#stats .incorrect").text(statsTotal - statsCorrect);
      }, speed * 2);
    }, speed * 3);
  };

  var next = function(prev, delay) {
    if (prev) {
      setTimeout(function() {
        prev.addClass("fadeOut");
        prev.delay(speed * 2).queue(function() { prev.remove() });
      }, delay);
    }

    var question = currentQuestions.pop();
    if (!question) {
      return finish();
    }

    var remaining = currentQuestions.length;
    $("#remaining .value").text(remaining);

    var dom = $("<div>").addClass("question animate slideUp");
    dom.prependTo("#questions");
    setTimeout(function() { dom.toggleClass("slideDown slideUp") }, 1);

    var textNode;

    _.each(question.q, function(option) {
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

        if (option == question.a) {
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

        if (option == question.a) {
          odom.addClass("answer");
        }
      } else if (type == "text") {
        if (!textNode) {
          textNode = $("<div>").appendTo(dom);
        }

        var odom = $("<div>").appendTo(textNode).addClass("option text");
        odom.text(name.replace(/_/g, " "));

        if (option == question.a) {
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

      if (correct && combo > 0) {
        statsCorrect += 1;
      }

      if (combo != 0) {
        var diff = combo * 10;
        score += diff;

        $("#score .value").text(score);

        var change = $("#score .change");
        change.toggleClass("animate animageOff");
        change.toggleClass("fadeIn fadeOut");

        change.toggleClass("positive", correct);
        change.toggleClass("negative", !correct);

        if (diff > 0) diff = "+" + diff;
        change.text(diff);

        setTimeout(function() {
          change.toggleClass("animate animageOff");
          change.toggleClass("fadeIn fadeOut");
        }, 1);
      }

      if (correct) {
        answered = true;

        next(dom, 2 * speed);
      } else {
        var remaining = $(".option:not(.incorrect)", dom).length;

        if (remaining < 2) {
          answered = true;
          $(".option.answer", dom).addClass("correct");
          next(dom, 3 * speed);
        }
      }
    });
  };

  var start = function(target) {
    if (started) return;
    started = true;

    $("#stats, #spacer, #difficulties").addClass("slideUp").removeClass("slideDown");
    $("#score").addClass("slideDown").removeClass("slideUp");
    $("#instructions").addClass("fadeOut").delay(speed).queue(function() { this.remove() });

    currentQuestions = _.sortBy(questions, function(question) {
      return Math.abs(target - question.q.length) + 2.0 * Math.random();
    }).slice(0, 40);
    currentQuestions = _.shuffle(currentQuestions);

    statsCorrect = 0;
    statsTotal = currentQuestions.length;

    next();
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
      if (location.hostname == "localhost") {
        /*
        var whitelist = [ "item/diffusal_blade", "item/black_king_bar", "item/blink", "item/sphere", "item/invis_sword", "item/ghost", "ability/slark_pounce", "ability/doom_bringer_doom", "ability/faceless_void_chronosphere", "ability/abaddon_aphotic_shield" ];

        var sorted = _.sortBy(questions, function(q) {
          var primary = whitelist.indexOf(q.q[0]);
          var temp = whitelist.indexOf(q.q[1]);

          if (primary == -1 || (temp != -1 && temp < primary)) primary = temp;
          if (primary == -1) {
            console.log("no primary for " + q.q[0] + " " + q.q[1]);
            return;
          }

          return whitelist[primary] + " " + q.q[0] + " " + q.q[1];
        });

        sorted = { "questions": sorted };
        console.log(JSON.stringify(sorted, null, "  "));
        */

        _.each(questions, function(question) {
          var answered = false;

          _.each(question.q, function(option) {
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

            if (option == question.a) answered = true;
          });

          if (!answered) {
            console.log("impossible answer " + question.a);
          }
        });
      }

      $(".difficulty").click(function(event) {
        var target = $(event.target).data("target");
        start(target);
      });
    });

    allReq.fail(function() {
      alert("failed to load dependencies, please refresh the page");
    });
  });
})();
