/*
*Trim 
*removes whitespace on start and end of string
*/
String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}