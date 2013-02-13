/**
 * @file
 * @author Ivan Popov
 * @email <vantuziast@odserve.org>
 *
 * Реализация файлового API для конкретной платформы.
 */


if (a.info.support.api.webWorker) {

    //Add remote files with threads

    function RemoteFileThread () {
        RemoteFileThread.superclass.constructor.apply(this, arguments);
    }

    a.extend(RemoteFileThread, a.FileThread);

    RemoteFileThread.prototype._pThreadManager
        = new ThreadManager(BUILD_PATH('RemoteFile.thread.js', 'files/threads/'));
    a.RemoteFile = RemoteFileThread;

    if (a.info.support.api.fileSystem) {

        function LocalFileThread () {
            LocalFileThread.superclass.constructor.apply(this, arguments);
        }

        a.extend(LocalFileThread, a.FileThread);

        LocalFileThread.prototype._pThreadManager
            = new ThreadManager(BUILD_PATH('LocalFile.thread.js', 'files/threads/'));
        a.LocalFile = LocalFileThread;
    }
    else if (a.info.support.api.localStorage) {
        warning('used simplified realisation for local files, based on local storage');
        If(FILE_MODULES_IMPLEMENTATION);
        a.require(BUILD_PATH('LocalFileSimplified.plug.js', 'files/plugins/'));
        Elseif();
        Include('LocalFileSimplified.js');
        Endif();
    }
    else {
        error('Your browser not support file system!');
    }


}
else if (a.info.support.api.fileSystem) {

    If(FILE_MODULES_IMPLEMENTATION);
    a.require(BUILD_PATH('LocalFile.plug.js', 'files/plugins/'));
    Elseif();
    Include('LocalFile.js');
    Endif();


    warning('Not-thread remote file not implemented yet.');
}
else {
    warning('Your browser not support local files.');
}


/**
 * @property fopen(String sUri, String sMode = 'r')
 * @param sUri uri.
 * @param sMode Файловый мод.
 */

/**
 * @property fopen(String sUri, Enumeration eMode = a.io.IN)
 * @param sUri uri.
 * @param eMode Файловый мод.
 */

/**
 * Функция получения файлового дескриптора.
 * @tparam String sUri uri.
 */
a.fopen = function (sUri) {
    var pMode = arguments[1] || a.io.IN;
    var pUri = a.uri(sUri);

    if (pUri.protocol == 'filesystem') {
        pUriLocal = a.uri(pUri.path);

        assert(!(pUriLocal.protocol && pUriLocal.host != a.info.uri.host),
               'Поддерживаются только локальные файлы в пределах текущего домена.');

        var pFolders = pUriLocal.path.split('/');

        if (pFolders[0] == '' || pFolders[0] == '.') {
            pFolders = pFolders.slice(1);
        }
 
        assert(pUri.host == 'temporary',
               'Поддерживаются только файловые системы типа "temporary".');

        return new a.LocalFile(pFolders.join('/'), pMode);
    }

    return new a.RemoteFile(sUri, pMode);
}

