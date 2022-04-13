# top-calculator
## The Odin Project, Foundations Path, JavaScript Basics "Calculator" project

Design based on Windows 10 calculator functionality.
I believe I covered all the EXTRA CREDIT stuff and some additional features.

I'm not a UI person, I'm not concerned with pretty, just aligned and functional.  My priority is making it work and making the code readable.
I did want to add a flash on the corresponding button whey you type on the keyboard, but not sure I want to spend any more time on interface stuff, I want to move on to next course.

I may have made it a little over complicated.
I wanted to avoid hard coded crap, did not want a bunch of if statements comparing key values.
Also did not want a bunch of separate event bindings; I wanted it to be driven by the key value.

There are some known issues
- This is not responsive by design, buttons sizes are static, one hack to make the display field wrap, had to use a fixed width.
- Using a bunch of globals, haven't done anything with modules or classes yet, future projects will suck less.
- Not doing anything to validate numbers out of range, assuming it will result in NaN.
