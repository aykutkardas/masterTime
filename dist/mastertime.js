var Mastertime = /** @class */ (function () {
    function Mastertime() {
        var _this = this;
        var _lastRoomIndex = -1;
        var _storage = [];
        var _regexStorage = {
            fullDateRegex: /([\d]{2}\.[\d]{2}\.[\d]{4})\ ([\d]{2}\:[\d]{2}\:[\d]{2})/,
            dateRegex: /([\d]{2}\.[\d]{2}\.[\d]{4})/,
            timeRegex: /([\d]{2}\:[\d]{2}\:[\d]{2})/
        };
        this._getRegex = function (key) {
            return key ? _regexStorage[key] : _regexStorage;
        };
        this._getTimeBase = function () { return _storage; };
        this._createTimeBaseRoom = function () {
            var index = _storage.length;
            _storage[index] = [];
            return index;
        };
        this._putTimeBaseRoom = function (index, obj) {
            _storage[index].push(obj);
        };
        this._getLastRoomIndex = function () { return _lastRoomIndex; };
        this._setLastRoomIndex = function (index) {
            _lastRoomIndex = index;
        };
        this._resetLastRoomIndex = function () {
            _lastRoomIndex = -1;
        };
        this._firstLetterToLowerCase = function (str) {
            return (str = str[0].toLowerCase() + str.slice(1, str.length));
        };
        this._wayDetector = function (obj) {
            if (typeof obj.start === "string" && !isNaN(parseInt(obj.start)))
                obj.start = parseInt(obj.start);
            if (typeof obj.end === "string" && !isNaN(parseInt(obj.end)))
                obj.end = parseInt(obj.end);
            if (typeof obj.start === "number") {
                if (typeof obj.end === "number") {
                    if (obj.start > obj.end)
                        obj.way = "down";
                    else
                        obj.way = "up";
                }
                else {
                    if (!obj.way) {
                        obj.end = obj.start > 0 ? 0 : Infinity;
                        obj.way = obj.start > 0 ? "down" : "up";
                    }
                }
            }
            else if (obj.date) {
                var diff = _this._dateDiff(obj.date);
                diff = (diff < 0) ? -diff : diff;
                if (_this._dateDiff(obj.date) < 0)
                    obj.way = "up";
                else
                    obj.way = "down";
                delete obj.date;
                obj.start = Math.floor(diff);
            }
            return obj;
        };
        this._leftPad = function (obj, option) {
            if (!option || !option.leftPad)
                return obj;
            var selectedOption;
            if (option.leftPad === true)
                selectedOption = ["Y", "M", "W", "D", "h", "m", "s"];
            else
                selectedOption = option.leftPad.split(":");
            var timeType, newObj = {};
            for (timeType in obj) {
                if (selectedOption.indexOf(timeType) > -1)
                    newObj[timeType] = parseInt(obj[timeType]) < 10 ? "0" + obj[timeType] : obj[timeType];
            }
            Object.assign(obj, newObj);
            return obj;
        };
        this._dateComplete = function (date) {
            var fullDateRegex;
            fullDateRegex = _this._getRegex('fullDateRegex').exec(date);
            if (fullDateRegex)
                return fullDateRegex[0];
            var dateRegex;
            dateRegex = _this._getRegex('dateRegex').exec(date);
            if (dateRegex)
                return dateRegex[0] + ' 00:00:00';
            var timeRegex;
            timeRegex = _this._getRegex('timeRegex').exec(date);
            if (timeRegex)
                return new Date().toLocaleDateString() + ' ' + timeRegex[0];
            return new Date().toLocaleString();
        };
        this._dateFormat = function (date) {
            if (!_this._getRegex("fullDateRegex").exec(date))
                return date;
            var months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ];
            var _a = date.split(" "), dateStr = _a[0], timeStr = _a[1];
            var _b = dateStr.split("."), day = _b[0], month = _b[1], year = _b[2];
            month = months[Number(month) - 1];
            return month + " " + day + ", " + year + " " + timeStr;
        };
        this._dateDiff = function (date) {
            if (!date)
                return 0;
            var dateMs, nowDateMs;
            date = _this._dateFormat(_this._dateComplete(date));
            dateMs = new Date(date).getTime();
            nowDateMs = new Date().getTime();
            return (dateMs - nowDateMs) / 1000;
        };
        this._templateApply = function (template, timeObj, option) {
            var defaultTemplate = '{h}:{m}:{s}';
            if ('string' === typeof (template) && template.trim().length < 1)
                template = defaultTemplate;
            else if (!template)
                template = defaultTemplate;
            var bracketInner = '\\/(\\[[^\\!&^\\[&^\\]]*)\\{(.)\\}([^\\[&^\\]]*)\\/(\\])';
            var bracketPass = '[^\\/&^\\[]{0}\\[([^\\&^\\[&^\\]]*)\\{(.)\\}([^\\[]*)[^\\/]\\]';
            if (option && option.leftPad)
                timeObj = _this._leftPad(timeObj, option);
            var timeType;
            var bracketPassRegex;
            var bracketInnerRegex;
            var bracketInnerRegexMatch;
            var bracketPassRegexMatch;
            for (timeType in timeObj) {
                bracketInnerRegex = new RegExp(bracketInner.replace('.', timeType), 'gmi');
                bracketInnerRegexMatch = bracketInnerRegex.exec(template);
                if (bracketInnerRegexMatch) {
                    if (parseInt(timeObj[timeType]) === 0)
                        template = template.replace(bracketInnerRegex, '');
                    else
                        template = template.replace(bracketInnerRegex, "$1" + timeObj[timeType] + "$3");
                    continue;
                }
                bracketPassRegex = new RegExp(bracketPass.replace('.', timeType), 'gmi');
                bracketPassRegexMatch = bracketPassRegex.exec(template);
                if (bracketPassRegexMatch) {
                    template = template.replace(bracketPassRegex, "$1" + timeObj[timeType] + "$3$4");
                    continue;
                }
                template = template.replace("{" + timeType + "}", timeObj[timeType]);
            }
            return template;
        };
        this._timeFormat = function (second, option) {
            second = parseInt(second.toString());
            if (isNaN(second))
                second = 0;
            var ruler = {
                Y: 31556926,
                M: 2629743.83,
                W: 604800,
                D: 86400,
                h: 3600,
                m: 60,
                s: 1
            };
            var selectedFormat;
            if (!option)
                selectedFormat = ["Y", "M", "W", "D", "h", "m", "s"];
            else
                selectedFormat = option.timeFormat.split(":");
            var i;
            var output = {};
            for (i in ruler) {
                if (selectedFormat.indexOf(i) > -1) {
                    output[i] = Math.floor(second / ruler[i]).toString();
                    second %= ruler[i];
                }
            }
            return output;
        };
        this._machine = function (obj) {
            if (typeof obj.start !== "number" && !obj.date)
                clearInterval(obj.process);
            var defaultConfig = {
                timeFormat: "h:m:s",
                leftPad: "h:m:s"
            };
            obj.config = Object.assign(defaultConfig, obj.config);
            if (obj.onInterval)
                obj.onInterval(obj);
            if (obj.target) {
                if (!obj.template) {
                    obj.template = obj.target.innerHTML;
                }
                var content = _this._templateApply(obj.template, _this._timeFormat(obj.start, obj.config), obj.config);
                if (obj.target.tagName === "INPUT") {
                    var prevContent = obj.target.value;
                    if (prevContent !== content)
                        obj.target.value = content;
                }
                else {
                    var prevContent = obj.target.innerHTML;
                    if (prevContent !== content)
                        obj.target.innerHTML = content;
                }
            }
            if (obj.start === obj.end) {
                clearInterval(obj.process);
                if (obj.onEnd)
                    obj.onEnd(obj);
                return false;
            }
            if (obj.way === "up")
                obj.start++;
            else
                obj.start--;
        };
    }
    Mastertime.prototype.add = function (obj) {
        if (!obj)
            return this;
        var roomIndex = this._createTimeBaseRoom();
        var objs;
        if (!Array.isArray(obj))
            objs = [obj];
        else
            objs = obj;
        var i = 0;
        var len = objs.length;
        for (; i < len; i++) {
            var activeObj = this._wayDetector(objs[i]);
            if (!activeObj.start && !activeObj.date)
                continue;
            if (activeObj.target) {
                var elems = document.querySelectorAll(objs[i].target);
                var j = 0;
                var elemLen = elems.length;
                for (; j < elemLen; j++) {
                    var activeElement = elems[j];
                    var uniqueObj = Object.assign({}, activeObj);
                    uniqueObj.target = activeElement;
                    uniqueObj.template = uniqueObj.template || activeElement.innerHTML;
                    this._putTimeBaseRoom(roomIndex, uniqueObj);
                }
            }
            else {
                this._putTimeBaseRoom(roomIndex, Object.assign({}, activeObj));
            }
        }
        this._setLastRoomIndex(roomIndex);
        return this;
    };
    Mastertime.prototype.build = function (selector, option) {
        if (!selector)
            return this;
        var elems = document.querySelectorAll(selector);
        if (elems.length === 0)
            return this;
        var roomIndex = this._createTimeBaseRoom();
        var attrList = [
            "mtDate",
            "mtStart",
            "mtEnd",
            "mtOnStart",
            "mtOnInterval",
            "mtOnEnd",
            "mtName",
            "mtTemplate",
            "mtWay",
            "mtAgo"
        ];
        var i = 0;
        var len = elems.length;
        for (; i < len; i++) {
            var activeElement = elems[i];
            var rawObj = {};
            var j = 0;
            var attrListLen = attrList.length;
            for (; j < attrListLen; j++) {
                var val = activeElement.getAttribute(attrList[j]);
                if (val) {
                    activeElement.removeAttribute(attrList[j]);
                    var key = this._firstLetterToLowerCase(attrList[j].substr(2, 10));
                    rawObj[key] = val;
                }
            }
            if (!rawObj.start && !rawObj.date)
                continue;
            var eventObj = {};
            if (rawObj.onStart && typeof rawObj.onStart === "string")
                eventObj.onStart = new Function("event", rawObj.onStart);
            if (rawObj.onInterval && typeof rawObj.onInterval === "string")
                eventObj.onInterval = new Function("event", rawObj.onInterval);
            if (rawObj.onEnd && typeof rawObj.onEnd === "string")
                eventObj.onEnd = new Function("event", rawObj.onEnd);
            var timerObj = Object.assign({}, this._wayDetector(rawObj), eventObj, {
                target: activeElement,
                config: option
            });
            this._putTimeBaseRoom(roomIndex, timerObj);
        }
        this._setLastRoomIndex(roomIndex);
        return this;
    };
    Mastertime.prototype.run = function () {
        var _this = this;
        var roomIndex = this._getLastRoomIndex();
        if (roomIndex === -1)
            return false;
        var timerObjList = this._getTimeBase()[roomIndex];
        var i = 0;
        var len = timerObjList.length;
        var _loop_1 = function () {
            var activeObj = timerObjList[i];
            if (activeObj.onStart)
                activeObj.onStart(activeObj);
            this_1._machine(activeObj);
            activeObj.process = setInterval(function () {
                _this._machine(activeObj);
            }, 1000);
        };
        var this_1 = this;
        for (; i < len; i++) {
            _loop_1();
        }
        this._resetLastRoomIndex();
    };
    Mastertime.prototype.destroy = function (name) {
        if (!name || typeof name !== "string")
            return false;
        var _storage = this._getTimeBase();
        var i = 0;
        var len = _storage.length;
        for (; i < len; i++) {
            if (_storage[i] && Array.isArray(_storage[i]) && _storage[i].length) {
                var j = 0;
                var roomSize = _storage[i].length;
                var activeObj = _storage[i];
                for (; j < roomSize; j++) {
                    if (activeObj[j].hasOwnProperty("name") &&
                        name === activeObj[j].name) {
                        clearInterval(activeObj[j].process);
                    }
                }
            }
        }
    };
    return Mastertime;
}());
