var Mastertime=function(){function t(){var t=this,e=-1,r=[],n={fullDateRegex:/([\d]{2}\.[\d]{2}\.[\d]{4})\ ([\d]{2}\:[\d]{2}\:[\d]{2})/,dateRegex:/([\d]{2}\.[\d]{2}\.[\d]{4})/,timeRegex:/([\d]{2}\:[\d]{2}\:[\d]{2})/};this._getRegex=function(t){return t?n[t]:n},this._getTimeBase=function(){return r},this._createTimeBaseRoom=function(){var t=r.length;return r[t]=[],t},this._putTimeBaseRoom=function(t,e){r[t].push(e)},this._getLastRoomIndex=function(){return e},this._setLastRoomIndex=function(t){e=t},this._resetLastRoomIndex=function(){e=-1},this._firstLetterToLowerCase=function(t){var e=t.split("");return e[0]=e[0].toLowerCase(),e.join("")},this._wayDetector=function(e){if("number"==typeof e.start)"number"==typeof e.end?e.start>e.end?e.way="down":e.way="up":e.way||(e.end=e.start>0?0:1/0,e.way=e.start>0?"down":"up");else if(e.date){var r=t._dateDiff(e.date)<0?-t._dateDiff(e.date):t._dateDiff(e.date);t._dateDiff(e.date)<0?e.way="up":e.way="down",delete e.date,e.start=Math.floor(r)}return e},this._leftPad=function(t,e){if(!e||!e.leftPad)return t;var r;r=!0===e.leftPad?["Y","M","W","D","h","m","s"]:e.leftPad.split(":");var n,a={};for(n in t)r.indexOf(n)>-1&&(a[n]=parseInt(t[n])<10?"0"+t[n]:t[n]);return Object.assign(t,a),t},this._dateComplete=function(e){var r=t._getRegex("fullDateRegex").exec(e);if(r)return r[0];var n=t._getRegex("dateRegex").exec(e);if(n)return n[0]+" 00:00:00";var a=t._getRegex("timeRegex").exec(e);return a?(new Date).toLocaleDateString()+" "+a[0]:(new Date).toLocaleString()},this._dateFormat=function(e){if(!t._getRegex("fullDateRegex").exec(e))return e;var r=e.split(" "),n=r[0],a=r[1],i=n.split("."),o=i[0],s=i[1],f=i[2];return(s=["January","February","March","April","May","June","July","August","September","October","November","December"][Number(s)-1])+" "+o+", "+f+" "+a},this._dateDiff=function(e){return e?(e=t._dateFormat(t._dateComplete(e)),(new Date(e).getTime()-(new Date).getTime())/1e3):0},this._templateApply=function(e,r,n){e||(e="{h}:{m}:{s}");var a,i,o;for(a in n&&n.leftPad&&(r=t._leftPad(r,n)),r)e=(o=new RegExp("[^\\/&^\\[]{0}\\[([^\\&^\\[&^\\]]*)\\{(.)\\}([^\\[]*)[^\\/]\\]".replace(".",a),"gmi")).exec(e)?parseInt(r[a])?e.replace(o,"$1"+r[a]+"$3"):e.replace(o,""):(i=new RegExp("\\/(\\[[^\\!&^\\[&^\\]]*)\\{(.)\\}([^\\[&^\\]]*)\\/(\\])".replace(".",a),"gmi")).exec(e)?e.replace(i,"$1"+r[a]+"$3$4"):e.replace("{"+a+"}",r[a]);return e},this._timeFormat=function(t,e){t=parseInt(t.toString()),isNaN(t)&&(t=0);var r,n,a=1e3*t,i={Y:31556926e3,M:2629743830,W:6048e5,D:864e5,h:36e5,m:6e4,s:1e3};r=e?e.timeFormat.split(":"):["Y","M","W","D","h","m","s"];var o={};for(n in i)r.indexOf(n)>-1&&(o[n]=Math.floor(a/i[n]),a%=i[n]);return o},this._machine=function(e){"number"==typeof e.start||e.date||clearInterval(e.process);if(e.config=Object.assign({timeFormat:"h:m:s",leftPad:"h:m:s"},e.config),e.onInterval&&e.onInterval(e),e.target){var r=t._templateApply(e.template,t._timeFormat(e.start,e.config),e.config);e.target.innerHTML!==r&&(e.target.innerHTML=r)}if("up"===e.way?e.start++:e.start--,e.start===e.end-1)return clearInterval(e.process),e.onEnd&&e.onEnd(e),!1}}return t.prototype.add=function(t){if(!t)return this;for(var e,r=this._createTimeBaseRoom(),n=0,a=(e=Array.isArray(t)?t:[t]).length;n<a;n++){var i=this._wayDetector(e[n]);if(i.start||i.date)if(i.target)for(var o=document.querySelectorAll(e[n].target),s=0,f=o.length;s<f;s++){var u=o[s],m=Object.assign({},i);m.target=u,m.template=m.template||u.innerHTML,this._putTimeBaseRoom(r,m)}else this._putTimeBaseRoom(r,Object.assign({},i))}return this._setLastRoomIndex(r),this},t.prototype.build=function(t,e){if(!t)return this;var r=document.querySelectorAll(t);if(0===r.length)return this;for(var n=this._createTimeBaseRoom(),a=["mtDate","mtStart","mtEnd","mtOnStart","mtOnInterval","mtOnEnd","mtName","mtTemplate","mtWay","mtAgo"],i=0,o=r.length;i<o;i++){for(var s=r[i],f={},u=0,m=a.length;u<m;u++){var c=s.getAttribute(a[u]);if(c)s.removeAttribute(a[u]),f[this._firstLetterToLowerCase(a[u].substr(2,10))]=c}if(f.start||f.date){var d={};f.onStart&&"string"==typeof f.onStart&&(d.onStart=new Function("event",f.onStart)),f.onInterval&&"string"==typeof f.onInterval&&(d.onInterval=new Function("event",f.onInterval)),f.onEnd&&"string"==typeof f.onEnd&&(d.onEnd=new Function("event",f.onEnd));var l=Object.assign({},this._wayDetector(f),d,{target:s,config:e});this._putTimeBaseRoom(n,l)}}return this._setLastRoomIndex(n),this},t.prototype.run=function(){var t=this,e=this._getLastRoomIndex();if(-1===e)return!1;for(var r=this._getTimeBase()[e],n=0,a=r.length,i=function(){var e=r[n];e.onStart&&e.onStart(e),o._machine(e),e.process=setInterval(function(){t._machine(e)},1e3)},o=this;n<a;n++)i();this._resetLastRoomIndex()},t}();