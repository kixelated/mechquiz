dota.io : Advanced Mechanics Quiz
=================================

This is a pure Javascript/HTML quiz about Dota 2 items and ability interactions. All contributions are apprechiated as Dota 2 is a VERY complicated game and the number of potential questions is mind-numbing.

Setup
-----

If you are only adding questions and don't want to test your changes, you can skip this section.

To run the quiz locally, you will need to be running a simple webserver. Here is a [list of simple web servers](https://gist.github.com/willurd/5720255) if you have any of these languages installed (easy on OSX or Linux). If you're using Windows then it's more difficult, and something like [Mongoose](https://code.google.com/p/mongoose/) might be easiest.

Once you have a webserver setup just open a browser and navigate to localhost. You'll need to refresh the page after making changes.


Questions
---------

All of the questions can be found in one big file: `data/quiz.json`. There are a few guidelines:

* Order matters. The first option is always cast first and that sometimes affects the outcome.
* Keep it simple. There are a lot of very complex interactions in Dota that are difficult to summerize. If you find yourself writing a super-specific option (and obvious answer) then its better to ignore that case or the question altogether.
* Try to keep it sorted. It's first grouped by primary item (item/black_king_bar, item/sphere, item/blink, etc) and then sorted alphabetically by the options. There is no requirement that the questions remain sorted but it makes it MUCH easier to modify questions.
* Follow conventions. When writing text options, try to use _only instead of no_ unless needed (such as when there are 3 options but 2 effects occur).

All abilities and items use their internal names which can be confusing at times. You can confirm that you are using the correct name by referencing the files in the `img/ability` and `img/item` folders that have been extracted from the game. If you're hosting the quiz on localhost, you'll see messages in your console telling you if any questions are invalid.


