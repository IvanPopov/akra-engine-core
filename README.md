<blockquote>
Unfortunately, no one else to engage in the development of this project, so if you want to know anything, you can contact me and I'll try to answer your questions.
</blockquote>

## Overview

AkraEngine is a game engine designed to create 3D browser games and web applications. It is based on modern HTML5 technologies like WebGL, Web Workers and others.

Engine is written in JavaScript and TypeScript. No plugins, third-party SDK and libraries are needed for work.

Official site - http://odserve.org

----
<i>Akra Engine features / WebGL Game Engine</i>
 
[![Alt text for your video](http://img.youtube.com/vi/ATKItjpDC7I/0.jpg)](http://youtu.be/ATKItjpDC7I)

### Demos

You can see the demos from this repo here - http://dev.odserve.org/demos/

### Build

Build all:

```
grunt all
```

Build core:

```
grunt build:core [--release | --debug | -dev] [--webgl-debug] [--pretty_print] 
```

Build addons:

```
grunt build:addon-{name}
```

For example:

```
grunt build:addon-navigation [--release | --debug | -dev]
```

Build demo:

```
grunt demo:{name} [--release | --debug | -dev]
```
