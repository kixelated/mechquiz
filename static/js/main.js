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

      var next = function() {
        var question = questions.pop();

        var dom = $("<div>").addClass("question").prependTo("#questions");
        dom.slideUp().slideDown(500);

        if (!question) {
          dom.addClass("score").text("Final score: 42");
          return;
        }

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

        $(".option", dom).click(function(event) {
          var elem = $(event.target);

          if (elem.hasClass("answer")) {
            elem.addClass("correct");
          } else {
            elem.addClass("incorrect");
            $(".option.answer", dom).addClass("correct");
          }

          dom.delay(5000).fadeOut(500, dom.remove);
          setTimeout(next, 500);
        });

        console.log(question);
      };

      next();
    });

    allReq.fail(function() {
      alert("failed to load dependencies, please refresh the page");
    });
  });
})();
