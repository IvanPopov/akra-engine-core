akraFiles = {
  'akraCore': [
    'src/akra/akra.ts',
  ],

  'akraParser': [
     // 'src/akra/common.ts',
     // 'src/akra/logger.ts',
     // 'src/akra/parser/symbols.ts',
     // 'src/akra/parser/Item.ts',
     // 'src/akra/parser/State.ts',
     // 'src/akra/parser/ParseTree.ts',
     // 'src/akra/parser/Lexer.ts',
     'src/akra/parser/Parser.ts',
  ],

  'akraPlugins': {
    // 'ngAnimate': [
    //   'src/ngAnimate/animate.js'
    // ],
  },

  'akraUI': [
    'src/akra-ui/ui/UI.ts',
    'src/akra-ui/ui/IDE.ts'
  ],

  'akraAddons': {
      'navigation': [
        'src/akra-addons/addons/navigation.ts'
      ],
      'filedrop': [
        'src/akra-addons/addons/filedrop/filedrop.ts'
      ]
  }
};

akraFiles['akraSrcModules'] = [].concat();

//TODO
akraFiles["all"] = [].concat(
    akraFiles["akraCore"],
    akraFiles["akraParser"]
);

if (exports) {
  exports.files = akraFiles;
  exports.mergeFilesFor = function() {
    var files = [];

    Array.prototype.slice.call(arguments, 0).forEach(function(filegroup) {
      akraFiles[filegroup].forEach(function(file) {
        // replace @ref
        var match = file.match(/^\@(.*)/);
        if (match) {
          files = files.concat(akraFiles[match[1]]);
        } else {
          files.push(file);
        }
      });
    });

    return files;
  };
}
