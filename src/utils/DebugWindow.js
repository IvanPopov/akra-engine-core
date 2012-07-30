/**
 * @file
 * @author IvanPopov
 * @brief Создание всплывающих окон, с возможностью печати в них.
 */

/**
 * Класс для создания всплывающих окон.
 * @ctor
 * Конструктор.
 * @tparam String sCaption
 */
function DebugWindow (sCaption) {

    this.win = window.open("",
        (sCaption ? sCaption : 'console'),
        "width=640,height=230,resizable=no,scrollbars=yes,status=no,menubar=no,location=no");

    this.win.focus();

    var me = this;
    window.onunload = function () {me.win.close();};

    this.print("<!DOCTYPE html><html><head>", 1);
    this.print("<title>" + (sCaption ? sCaption : 'console') + "</title>", 1);
    this.print("</head>", 1);
    this.print("<body id='log' style=\"text-align:left;padding: 2px;margin:0px;\">", 1);
    this.print("</body></html>", 1);

    this.log = this.win.document.getElementById('log');
}
;

/**
 * Печать текста в окна.
 * @tparam String sData Текст для отображения.
 * @tparam Boolean isDoc
 */
DebugWindow.prototype.print = function (sData, isHtml) {
    if (isHtml) {
        this.win.document.write(sData);
    }
    else {
        this.log.innerHTML += sData + '<div style="border-top: 1px dotted #999;width:100%;margin:0px;" ></div>';
    }
};

a.DebugWindow = DebugWindow;