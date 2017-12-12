## On all the flags in the tsconfig

# ECMA

Before we start, we need to briefly cover the history of JavaScript standards: In the beginning there was ES3.

# JavaScript the Language

> I'm always told that JavaScript was created in 10 days, which is a cute anecdote, but JavaScript has evolved for the next 21 years. The JavaScript you wrote 10 years ago would still run, however modern JavaScript is an amazing and expressive programming language once you start using modern features.
>
> Sometimes these features aren't available in node, or your browser's JavaScript engine, you can work around this by using a transpiler, which takes your source code and backports the features you are using to an older version of JavaScript.
>
> ### ES6
>
> JavaScript is run by a committee. Around the time that people were starting to talk about HTML5 and CSS3, work was started on a new specification for JavaScript called ECMAScript 6.
>
> ES6 represents the first point at which JavaScript really started to take a lot of the best features from transpile to JavaScript languages like CoffeeScript. Making it feasible for larger systems programming to be possible in vanilla JavaScript.
> 
> ### ES2015
> 
> It took forever for [ES6](#es6) to come out, and every time they created / amended a specification there were multiple implementations of the specification available for transpiling via [babel](#babel). This I can imagine was frustrating for developers wanting to use new features, and specification authors trying to put out documentation for discussion as a work in progress. This happened a lot [with the Promises](#promises) API.
> 
> To fix this they opted to discuss specification features on a year basis. So that specifications could be smaller and more focused, instead of major multi-year projects. Quite a SemVer jump from 6 to 2015.
> 
> ### Stages
> 
> Turns out that didn't work out too well, so the terminology changed again. The change is mainly to set expectations between the Specification authors and developers transpiling those specifications into their apps.
> 
> Now an ECMAScript language improvement specification moves through a series of stages, depending on their maturity. I [believe starting][stages] at 0, and working up to 4. 0 Idea, 1 Proposal, 2 Draft, 3 Accepted and 4 Done.
> 
> So a ECMAScript Stage 0 feature is going to be really new, if you're using it via a transpiler then you should expect a lot of potential API changes and code churn. The higher the number, the longer the spec has been discussed, and the more likely for the code you're transpiling to be the vanilla JavaScript code in time.
> 
> The committee who discussed these improvements are the [TC39][tc39] committee, the cool bit is that you can see [all the proposals][tc39-github] as individual GitHub repos so it's convenient to browse.

With that knowledge in mind, lets dig in to the compiler options.

## `target`

Target represents the expected baseline support of ECMAScript that you want to compile against.

TypeScript:

```ts
const myFunc = () => "Hello world"
```

turns into:

ES3:

```js
var myFunc = function() {
  return "Hello world"
}
```

And y'know what, if we make it ES2017 - it turns into this, Which was a little suprising:

ES2017:

```js
var myFunc = function() {
  return "Hello world"
}
```

^ fix this

## `module`

Represents the way in which the source for of a module should be created inside your project. Generally speaking commonJS is the
way that people have been handling the import/export for the last 8 years.

TypeScript

```ts
export const helloWorld = "Hi"
```

CommonJS

```js
"use strict"
exports.__esModule = true
exports.helloWorld = "Hi"
```

Which is the long-standing example of how to do an export within the JS eco-system, until we got to ES6. This
is the point at which the `import`/`export` syntax were added.

ES6 (with target ES5) (default)

```js
export var helloWorld = "Hi"
```

## `lib`

The `lib` option is used to describe what exists inside your JavaScript environment. These are about the assumptions you can
make for the place which you are running the complied code. TypeScript will not add additional code for you. The available options are:

`ES5`, `ES6`, `ES2015`, `ES7`, `ES2016`, `ES2017`, `ESNext`, `DOM`, `DOM.Iterable`, `WebWorker`, `ScriptHost`, `ES2015.Core`, `ES2015.Collection`, `ES2015.Generator`, `ES2015.Iterable`, `ES2015.Promise`, `ES2015.Proxy`, `ES2015.Reflect`, `ES2015.Symbol`, `ES2015.Symbol.WellKnown`, `ES2016.Array.Include`, `ES2017.object`, `ES2017.SharedMemory`, `ES2017.TypedArrays`, `esnext.asynciterable`.

There's a lot, but at least a bunch of them are subsets of mainly three things:

* Browser Support (`DOM`, `DOM.Iterable`, `WebWorker`)
* ESx Languages (`ES5`, `ES6`, `ES2015`, `ES7`, `ES2016`, `ES2017`)
* ES201x Language Feature (`ES2015.Core`, `ES2015.Collection`, `ES2015.Generator`, `ES2015.Iterable`, `ES2015.Promise`, `ES2015.Proxy`, `ES2015.Reflect`, `ES2015.Symbol`, `ES2015.Symbol.WellKnown`, `ES2016.Array.Include`, `ES2017.object`, `ES2017.SharedMemory`, `ES2017.TypedArrays`, `esnext.asynciterable`)

## `allowJs`

When running the compiler against JS files when compiling. For example, this JS file:

```js
export const helloWorld = "Hi"
```

When imported into this TypeScript file:

```ts
import { helloWorld } from "./def"

console.log(helloWorld)
```

raises an error without `allowJs`:

```sh
ex.ts(1,28): error TS7016: Could not find a declaration file for module './def'. '/examples/allowJS/def.js' implicitly has an 'any' type.
```

This is used as a way to incrementally add TypeScript files into JS projects. It assumes that JS is the majority of the code and that the way it works right now is fine.

## `checkJs`

When you just use `allowJs` it assumes your JS project is perfect. `checkJs` let's the TypeScript compiler let everyone know just how wrong we all are.

E.g. this incorrect JS

```js
export const pi = parseFloat(3.124) // parseFloat only takes a string
```

With this TS

```ts
import { pi } from "./def"

console.log(pi)
```

Compiles just fine with `allowJs`, but turn on `checkJs` and you get:

```js
def.js(1,30): error TS2345: Argument of type '3.124' is not assignable to parameter of type 'string'.
```

## `jsx`

Three options: `preserve`, `react`, and `react-native`.

The first one is pretty simple, you write `<View color="red">` and it compiles to `<View color="red">`.
`react` will handle the JSX transformation for you, so `<View color="red">` turns to the real JS verions of
`React.createElement("View", { color: "red" })`. So, preserve is if you expect babel to do some work after.

Both of these two options will ensure that the output file is a `thing.jsx` - setting it to `react-native` will allow.
The filetype will be a `.js` file instead. 

## `declaration`

Generate `d.ts` files for every file converted into JavaScript, these are used when importing a project from elsewhere.

This TypeScript:

```ts
export const helloWorld = "hi"
```

Generates this JS:

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = "hi";
```

and this `d.ts`:

```js
export declare const helloWorld = "hi";
```

## `sourceMap`

Adds a source map file for your project for every compiled file, so for this TS file:

```ts
export declare const helloWorld = "hi";
```

It creates this JS file:

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = "hi";
//# sourceMappingURL=ex.js.map
```

And this json map:
```json
{"version":3,"file":"ex.js","sourceRoot":"","sources":["../ex.ts"],"names":[],"mappings":";;AAAa,QAAA,UAAU,GAAG,IAAI,CAAA"}
```

It's way beyond the scope of this talk to cover how this works, but you can see that it adds an extra file that represents
source maps.

## `outFile`

Compiles all of the entire project into a single file. It's not a replacement for something like webpack, but it can
be useful. It's quite complicated, so you probably might prefer to use webpack TBH. I did.

## `outDir`

Copies your source roots into corresponding folder.

## `rootDir`

Works with `outDir` to specify what should be the root folder for all you TypeScript files if it's not the current working directory.

## `removeComments`

Provides an option comments from the outputted JS. The default is true, so generally it's used as the inverse.

TS:

```TS
export declare const helloWorld = "hi";
```

Without setting `removeComments` or having it as `true` :

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = "hi";
```

When set to false
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Used to show the user a hello message */
exports.helloWorld = "hi";
```

Which will show up in compiled code. It can be useful if you aren't shipping `d.ts` files.

## `noEmit`

Don't actually ship JavaScript files, only run the compiler and output the errors. Useful for running
type checks, or when you want Babel to do the transpilation work, but TypeScript to do the dev-time work.

## `importHelpers`

```ts
export const helloWorld = { ...{ hello: "world"} }
```

With `importHelpers` off:

```js
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = __assign({ hello: "world" });
```

This stuff is included in _every_ file. That adds up. So TSC can instead move all that code into
a single library, and have it imported. So, with `importHelpers` on:

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
exports.helloWorld = tslib_1.__assign({ hello: "world" });
```

## `downlevelIteration`

Takes a `for..of` loop, and instead of transforming it into a `for` loop, it turns it into a real iterator.
This means more genrated source code, but at the trade-off of more accuracy in what you're iterating.

```ts
const helloWorld = () => {
  for (const char of "Hello World") {
      console.log(char)
  }
}
```

Without, a simple loop:

```js
"use strict";
var helloWorld = function () {
    for (var _i = 0, _a = "Hello World"; _i < _a.length; _i++) {
        var char = _a[_i];
        console.log(char);
    }
};
```

With, a complex iterator:

```js
"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var helloWorld = function () {
    try {
        for (var _a = __values("Hello World"), _b = _a.next(); !_b.done; _b = _a.next()) {
            var char = _b.value;
            console.log(char);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        }
        finally { if (e_1) throw e_1.error; }
    }
    var e_1, _c;
};
```

See: https://blog.mariusschulz.com/2017/06/30/typescript-2-3-downlevel-iteration-for-es3-es5

## `isolatedModules`

The name is bad, but all the other options were bad too: 'separateCompilation', 'singleFileEmit', 'disablGlobalOptimizations', 'safeForTranspile', 'isolated', 'singleFileScope'. 

So I'd think of it as a 'screw it' flag, that says, just ship what I am sending. Don't try do type
checking outside of the current file. This means its faster to transpile.

See: https://github.com/Microsoft/TypeScript/issues/2499

## `strict`

OK, this is where it gets fun. By default TypeScript is in easy mode. Most of our Artsy projects
are on easy mode. Honestly, I was pretty turned off by Swift's strictness in the type system. However, 
I've slowlt been moving all my personal projects to have `strict` to be true.

`"strict": true` is a statement that you want the compiler to turn on the upcoming strict rules, which are off
by default. You can just use this setting and new versions of the compiler will add new rules for you. 

Meaning updates will break your app ;)

## `noImplicitAny`

TypeScript uses type inferrence so that you don't have to always include the types in every function and variable. However,
it's not perfect = nor should it be. If TypeScript cannot figure something out, it will class the object as an `any`. 

This is a pretty good get-out clause, but if you want total security in your code - you might want to know when that's happening. This flag will take code like:

```ts
const myFunc = value => value * 2
```

And raise an error because it doesn't know what the type of `value` is.

```sh
ex.ts(1,16): error TS7006: Parameter 'value' implicitly has an 'any' type.
```

This is a pretty strict rule, and is not on by default. I try to turn it on at the start of every project. 

## `strictNullChecks`

This is one of the big checks, it will not allow you to pass in a null or undefined value when a function does not
expect it. Take `parseInt` - it only accepts a string. If we have a function that could sometimes return null, the
compiler will give an error saying that the types don't match.

```ts
const getUserAge = () : string | null => "32"

// getUserAge could return null - but 
// parseInt only takes a string
parseInt(getUserAge())
```

Error:

```sh
ex.ts(5,10): error TS2345: Argument of type 'string | null' is not assignable to parameter of type 'string'.
  Type 'null' is not assignable to type 'string'.
```

This is useful because nullability crashes happen all the time.

## `strictFunctionTypes`

Dan talked about this last week. It basically has more checks on how well the arguments of a parameter confrom ot the interfaces you set.

## `noImplicitThis`

Raises when `this` has been set to any. 

```ts
let o = {
  n: 101,
  explicitThis: function (m: number) {
      return m + this.n.length; // error, 'length' does not exist on 'number'
  },
};
```

```sh
ex.ts(4,25): error TS2339: Property 'length' does not exist on type 'number'.
```

I barely understand how `this` works, so it's hard for me to provide a fresh explaination of this. Basically if 
the TypeScript compiler can't be certain of what the object is when it needs to understand the code for the `this`
it would normally just call it an `any`. This will make it raise when that happens.

## `alwaysStrict`

Ensures that all TS files are treated as though they were in the same strict mode which is available to JavaScript.

## `noUnusedLocals`

What it says on the tin. Doens't allow unused local variables.

```ts
const myFunc = () => {
  const onething = 1
  return "Hello"
}
```

Raises with

```sh
ex.ts(2,9): error TS6133: 'onething' is declared but its value is never read.
```

## `noUnusedParameters`


What it says on the tin. Doesn't allow unused params in functions.

```ts
const myFunc = value => "Hi"
```

Raises with

```sh
ex.ts(1,16): error TS6133: 'value' is declared but its value is never read.
```

## `noImplicitReturns`

Ensures that all of the code paths within a function return something (when it declares that it will)

```ts
function foo(isError: boolean): string {
  if (isError === true) {
      return undefined;
  }
}
```

```ts
ex.ts(1,41): error TS7030: Not all code paths return a value.
```

## `noFallthroughCasesInSwitch`

Ensures that any non-empty case inside a switch statement includes either `break` or `return`. This means
you won't accidentally ship a case fallthrough bug.

```ts
const a:number = 6

switch (a) {
  case 0:
      console.log("even");
  case 1:
      console.log("odd");
      break;
}
```

returns
sh
```
ex.ts(4,3): error TS7029: Fallthrough case in switch.
```

## `moduleResolution`

This is an old setting, basically if you want some _real old_ TypeScript behavior, you can use "classic". Otherwise 
you get the same module resolution as node.

## `baseUrl`

Let's you do some custom work in the module resolution. You can define a root folder where you can do absolute file
resolution. E.g.

```sh
baseUrl/
├── ex.ts
├── hello
│   └── world.ts
└── tsconfig.json
```

With `"baseUrl": "./"` allows for importing without "./".

```ts
import { helloWorld } from "hello/world"

console.log(helloWorld)
```

If you get tired of imports always looking like `"../"` or `"./"`. Or needing
to change as you move files, this is a great way to fix that.

## `paths`

Allows you to make some exceptions to the resolver. Like for instance if you were include jQuery in a 
distribution folder. It's effectively a way to crete shortcuts within the module resolver.

```json
  "baseUrl": ".",
  "paths": {
    "jquery": ["node_modules/jquery/dist/jquery"] // This mapping is relative to "baseUrl"
  }
```

## `rootDirs`

rootDirs are a list of folders whose contents are expected to merge at run-time.

## `typeRoots`

This is a bit of an old setting, there's now `@types` which handles type definitions in general. You
can use this folder to include library definition files in any file you want. TBH, don't use this.

## `types`

Allows you to force a subset of your available types via the `@type` folder in your node_modules. 
e.g. `"types" : ["node", "lodash", "express"]` will ignore definitions like: `node_modules/@types/voca`. 

Generally this seems to exist so you can ignore them all, e.g. `"types" : []`.

## `allowSyntheticDefaultImports`

This is one you see all the time. Instead of:

```ts
import * as React from "React"
```

You can write:

```ts
import React from "React"
```

I want to explain why and what all this stuff is, but I'll run out of time.

https://github.com/Microsoft/TypeScript/issues/10895
https://code.visualstudio.com/docs/languages/javascript#_common-questions

## `preserveSymlinks`

Lets you use a symlink and when true, will put the file in the position of where it is linked from.

## `sourceRoot`

Used by the debugger to determine file paths when working with source maps.

## `mapRoot`

Used by the debugger to determine source maps paths.

## `inlineSourceMap`

Adds the source map into the transpiled file:

```ts
/** Used to show the user a hello message */
export const helloWorld = "hi"
```

JS:
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Used to show the user a hello message */
exports.helloWorld = "hi";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9leC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUE0QztBQUMvQixRQUFBLFVBQVUsR0FBRyxJQUFJLENBQUEifQ==
```


## `inlineSources`

Extends the source map for a file definition to include the entire source code of the TypeScript file:

TS:

```ts
/** Used to show the user a hello message */
export const helloWorld = "hi"
```

JS:
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Used to show the user a hello message */
exports.helloWorld = "hi";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9leC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUE0QztBQUMvQixRQUFBLFVBQVUsR0FBRyxJQUFJLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogVXNlZCB0byBzaG93IHRoZSB1c2VyIGEgaGVsbG8gbWVzc2FnZSAqL1xuZXhwb3J0IGNvbnN0IGhlbGxvV29ybGQgPSBcImhpXCJcbiJdfQ==
```

or when using separate map files:

```js
{"version":3,"file":"ex.js","sourceRoot":"","sources":["../ex.ts"],"names":[],"mappings":";;AAAA,4CAA4C;AAC/B,QAAA,UAAU,GAAG,IAAI,CAAA","sourcesContent":["/** Used to show the user a hello message */\nexport const helloWorld = \"hi\"\n"]}
```

## `experimentalDecorators`

_Only_ for classes and class functions. Allows for annotation functions by using other functions. This is an ES7 feature
that TypeScript has support for.

```ts
const track = (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
  console.log("Analytics event")
  return descriptor
}  

class MyApp {
  @track
  method() { return "hello world" }
}
```

https://stackoverflow.com/questions/29775830/how-to-implement-a-typescript-decorator

## `emitDecoratorMetadata`

Expands on decorators via a reflection API using an external module. This can allow for 
even more metaprogramming inside a decorator. It's based onb the ES7 reflector API.

Without:

```ts
var MyApp = /** @class */ (function () {
    function MyApp() {
    }
    MyApp.prototype.method = function () { return "hello world"; };
    __decorate([
        track
    ], MyApp.prototype, "method", null);
    return MyApp;
}());

```

With:

```ts
var MyApp = /** @class */ (function () {
    function MyApp() {
    }
    MyApp.prototype.method = function () { return "hello world"; };
    __decorate([
        track,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MyApp.prototype, "method", null);
    return MyApp;
}());
```
