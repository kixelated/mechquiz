dota.io : Advanced Mechanics Quiz
=================================

This is a pure Javascript/HTML quiz about Dota 2 items and ability interactions. All contributions are apprechiated as Dota 2 is a VERY complicated game and the number of potential questions is mind-numbing.

Setup
-----

If you are only adding questions and don't want to test your changes, you can skip this section.

To run the quiz locally, you will need to be running a simple webserver. Here is a [list of simple web servers](https://gist.github.com/willurd/5720255) if you have any of these languages installed (easy on OSX or Linux). If you're using Windows then it's more difficult, and something like [Mongoose](https://code.google.com/p/mongoose/) might be easiest.

Once you have a webserver setup, you'll need to clone the repository. If you've never used GitHub before then you should find a guide online. With the files in place and the webserver running, open a browser and visit localhost to see the quiz in action.


Questions
---------

All of the questions can be found in one big file: `data/quiz.json`. There are a few guidelines:

* Order matters. The first option is always cast first and that sometimes affects the outcome.
* Keep it simple. There are a lot of very complex interactions in Dota that are difficult to summerize. If you find yourself writing a super-specific option (and obvious answer) then its better to ignore that case or the question altogether.
* Try to keep it sorted. It's first grouped by primary item (Black King Bar, Linkens, Blink, etc) and then sorted alphabetically by the options. There is no requirement that the questions remain sorted but it makes it MUCH easier to modify questions.
* Follow conventions. When writing text options, try to use "only" instead of "no" when possible.

All abilities and items use their internal names which can be confusing at times. You can confirm that you are using the correct name by referencing the file names in the `img/ability` and `img/item` folders. There will be messages in your browser console if any of the questions have invalid options or answers.
