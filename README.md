## Build

Build all:

```
grunt
```

Build core:

```
grunt build:core
```

Build addons:

```
grunt build:addon-:name
```

For example:

```
grunt build:addon-navigation
```

Build with declaration(*.d.ts):

```
grunt decl
grunt decl:addon-navigation
``` 

Release/Debug build:

```
grunt --configuration Release
grunt --configuration Debug
```

By default configuration is 'Debug'.

View debug info:

```
grunt --debug
```