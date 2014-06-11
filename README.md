## Build

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