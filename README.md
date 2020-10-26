# eslint-plugin-grapes

A one-rule ESLint plugin to corral your file structure.

## Rule Details

This plugin exposes a single rule, `grapes/no-internal-import`, which prevents importing "internals", or submodules from other modules. It defines an internal as anything adjacent to, or a niece/nephew of, an `index` file. That's a little abstract -- it's easier to think of it visually. Consider the following file structure:

```
src/
├── index.tsx
├── directory/
│   ├── foo.ts
│   ├── bar.ts
│   └── baz.ts
├── Component/
│   ├── index.tsx
│   ├── Subcomponent.tsx
│   └── useHook.ts
└── myModule/
    ├── index.ts
    └── helperFunc.ts
```

With this rule enabled, you run into the following

```typescript
/*
    src/index.tsx
*/

// These imports are NOT problems
import Foo from "./directory/Foo";
import Bar from "./directory/Bar";
import Baz from "./directory/Baz";
import myModule from "./myModule";
import Component from "./Component";

// These imports ARE problems
import helperFunc from "./myModule/helperFunc";
import Subcomponent from "./Component/Subcomponent";
```

Because there is no `directory/index.*` file, we know that `directory/` is safe to dig into. Because `Component/index.tsx` exists, we assume that any other file under `Component/` is an internal, and should not be imported.

## Options

By default, we define an `index` file as any file whose name matches the default value `^index\.(j|t)sx?$`. (Effectively, `index.js`, `index.ts`, `index.jsx`, and `index.tsx`). This is to avoid false positives (`index.css`, or `index.test.js`).

This rule exposes a single, optional option, `indexFileRegex`, to allow you to change this. Let's say you also want to hit on `index.test.js` -- you can configure your rule like so:

```json
{
  "rules": {
    "grapes/no-internal-import": [
      "error",
      {
        "indexFileRegex": "^index\\.(test\\.)?(j|t)sx?$"
      }
    ]
  }
}
```

## Why is this useful?

This rules helps prevent your codebase from becoming a spaghettified dependency web. Folder structure, and the location of a file, inherently conveys information about where it is consumed. With this rule in place, I can make edits to `Component/Subcomponent.tsx`, and feel confident that I'm not going to inadvertently affect any part of the codebase other than `<Component />`. If a fellow engineer wants to use `<Subcomponent />`, they need to move the file out of the `Component/` folder, and into its own file, or a `/Shared` directory, or _something_, which in turn is a signal to future editors that this component is consumed more widly.

## How is this different from `import/no-internal-modules`?

They are barely different, with one important distinction -- how you determine what constitutes an internal import. This rule allows you to move through a file structure _until_ you hit an `index` file. You can still have a directory folder of util functions. (In the above example, `import/no-internal-modules` wouldn't let you reach in to `./directory/Foo`). You can still use aliases like `#/Components/shared`. This version of the rule provides similar protection, but significantly more flexibility.

## Why "grapes"?

I got the idea after getting drunk with a coworker, and trying to explain that a good JS codebase is _basically_ like a bunch of grapes -- from a given grape, you can go up and down stems, in and out of bunches all you want -- you just can't go into another grape.

It's not a very good metaphor.
