# warp-node
warp is a cli tool that was created with a goal of streamlining multi-project navigation.

It does so by giving you a way to save references to your projects. Those references are called **gates**. Gates are essentialy named absolute paths, implemented via a map (JSON file, to be exact).

When working with warp, you can add and remove those gates and then quickly reopen your code editor at gate's **absolute path** via integrated terminal window.

Warp is especially useful when working with monorepos, or when you want to copy a piece of code from one project to another with them being at vastly distant points in your folder structure, without all of the hassle that comes with using file browsers in these scenarios.

## Usage

- `warp [gatename]` reopens your terminal at specified gate ***(currently non-functional)***.
- `warp blink [gatename]` reopens your code editor ***(currently VScode only)*** at specified gate.
- `warp add [gatename]` add new gate to your list of gates.
- `warp remove [gatename]` remove gate from your list of gates.
- `warp list` displays all of your gates and their associated absolute paths.
