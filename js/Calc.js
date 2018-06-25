var Calc = (function () {
    var _seq;
    var _PI;
    var _scales;
    var _displayObj;
    var _strucType;
    var _xCenter;
    var _yCenter;
    var _scaleName;
    var _colors;
    var _structureListObj;
    var _radius;
    var _radiusAA;
    var _resultTableObj;
    var _scalesNormRange;
    var _scalesNormDeviation;
    var _method;
    var _isNumeric;
    var _defaultColoring;
    var _disabledKeys;
    var Calc = function (displayObj, resultTableObj) {
        this._resultTableObj = resultTableObj;
        this._displayObj = displayObj;
        this.setHydrophobicColors();
        this._scalesNormRange = Scales.getAllScalesNormalized(false);
        this._scalesNormDeviation = Scales.getAllScalesNormalized(true);
        this._disabledKeys = ["x1", "x2", "y1", "y2", "hydr", "momo", "momv", "momX", "momY", "m1X", "m1Y"];
    };
    Calc.prototype.methods = {
        'hydroLine': 'Hydrophobic line',
        'helicalWheel': 'Helical wheel',
        'star': 'Star',
        'archimedean': 'Archimedean spiral',
        'horizontalSpiral': 'Horizontal spiral'
    },
    Calc.prototype.getScaleList = function () {
        return  Scales.getList();
    };

    Calc.prototype.getStructureList = function () {
//        return  Structures.getList();
        var list = [];

        var structKeys = Structures.getList();
        for (var i = 0; i < structKeys.length; i++) {
            var key = structKeys[i];
            var strucName = Structures[key].name;
            list.push({
                key: key,
                val: strucName
            });
        }
        return list;
    };

    Calc.prototype.init = function (seq, scales, scaleName, strucType, method, isNumeric, radiusAA, defaultColoring) {
        this._strucType = strucType;
        this._scaleName = scaleName;
        this.clearPanel();
        this._PI = (3.141592654 / 180);
        if (seq === undefined || seq === "")
            return;
        this._seq = this.cleanSeq(seq.toUpperCase());
        if (seq === undefined || seq === "")
            return;
        this._scales = scales;
        this._method = method;
        this._xCenter = d3.select(this._displayObj).attr("width") / 2;
        this._yCenter = d3.select(this._displayObj).attr("height") / 2;
        this._isNumeric = isNumeric;
        this._radiusAA = radiusAA;
        this._defaultColoring = defaultColoring;
        this._data = [];
        this._summaryData = [];
    };

    Calc.prototype.draw = function () {
//        $(this._displayObj).width($(this._displayObj).parent().width());
//        $(this._displayObj).height($(this._displayObj).parent().height());
        $(this._displayObj).attr('width', $(this._displayObj).parent().width());
        $(this._displayObj).attr('height', $(this._displayObj).parent().height());
        $(this._resultTableObj).html("");
        var data = [];
        switch (this._method) {
            case "hydroLine":
                this.drawHydrophobicityLine();
                break;
            case "helicalWheel":
                this.drawWheel(this._strucType, this._radiusAA, true, this._isNumeric);
                break;
            case "star":
                data = this.drawStar(this._scaleName, 35, 35);
                this._summaryData = data;
//                this.printTable(data[data.length - 1], true);
                break;
            case "archimedean":
                this.drawArchimedes(Structures[this._strucType].angle);
                break;
            case "horizontalSpiral":
                this.horizontalSpiral(this._strucType);
                break;

        }
        this._data = data;
    };
    Calc.prototype.getSummaryData= function(){
        return this._summaryData;
    };   
    Calc.prototype.getData= function(){
        return this._data;
    };
    
    Calc.prototype.getSelectedScale = function () {
        return this._scaleName;
//        return  $(this._scaleListObj).find('.active').children().first().prop("id");
    };
    Calc.prototype.getSelectedStructure = function () {
        return this._strucType;
//        return  $(this._structureListObj).find('.active').children().first().prop("id");
    };

    Calc.prototype.cleanSeq = function (seq) {
        var seqSrc = seq.toUpperCase();
        var newSeq = "";
        var allowed = "123456ABCDEFGHIJKLMNOPQRSTUWVXZY";
        for (var i = 0; i < seqSrc.length; i++) {
            var letter = seqSrc[i];
            if (allowed.indexOf(letter) === -1)
                continue;
            newSeq = newSeq + letter;
        }
        return newSeq;
    };
    Calc.prototype.isDefaultColorScheme = function () {
//        if (this._sc)
        return this._defaultColoring;
    };
    Calc.prototype.getColorScheme = function () {
        var scale = (this.isDefaultColorScheme())
                ? this.colors
                : Scales.getColors(this._scaleName);

        var keys = Object.keys(scale);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var aa = this.aaCodeConvert(key);
            scale[aa] = scale[key];
        }
//        console.log(scale);
        return scale;
    };

    /**
     * 
     * @param {type} scaleName
     * @param {type} xScale
     * @param {type} yScale
     * @param {type} radius
     * @returns {undefined|Array}
     */
    Calc.prototype.drawStar = function (scaleName, xScale, yScale) {
        if (this._displayObj == undefined || this._displayObj == null)
            return;
        if (this._seq == undefined || this._seq == '')
            return;
        var self = this;
//        var colors = this.get;
        var zoom = function () {
//            svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
//            svg.attr("transform", " scale(" + d3.event.scale + ")");
            svg.attr("transform", " scale(" + d3.event.scale + ") translate (" + self._xCenter + "," + self._yCenter + ")");
        }
        var svg = d3.select(this._displayObj);
        svg.transition();
        svg.append('g');
        svg.call(d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom));
        var res = null;
        var allRes = [];
        var colorScheme = this.getColorScheme();
//        console.log(colorScheme);
        for (var i = 0; i < this._seq.length; i++) {
            var aa = this._seq[i];
            var color = colorScheme[aa];
            aa = this.aaCodeConvert(aa);
            var val = 0;
            if (this._scales[scaleName][aa] != undefined) {
                val = this._scales[scaleName][aa];
//                color = self.getHydrophobicColor(aa);
            } else {
                val = 0;
//                color = self.dec2color(255,255,255);
            }
            console.log(this._strucType.toLowerCase());
            switch (this._strucType.toLowerCase()) {
                case 'alpha':
                    res = self.getAlpha(i, val, aa, res, xScale, yScale, svg, color);
                    res.momentrel = res.M1 / (this._seq.length * ((scaleName === "Eisenberg") ? 0.81 : 6.38));

                    break;
                case 'polip':
                    res = self.getPolypeptide(i, val, aa, res, xScale, yScale, svg, color);
                    res.momentrel = res.M1 / (this._seq.length * ((scaleName === "Eisenberg") ? 0.7 : 7.5));

                    break;
                case 'h310':
                    res = self.getH310(i, val, aa, res, xScale, yScale, svg, color);
                    res.momentrel = res.M1 / (this._seq.length * ((scaleName === "Eisenberg") ? 0.82 : 6.38));

                    break;
                case 'twist':
                    res = self.getTwist(i, val, aa, res, xScale, yScale, svg, color);
                    res.momentrel = res.M1 / (this._seq.length * ((scaleName === "Eisenberg") ? 0.81 : 6.39));

                    break;
                case 'beta':
                    res = self.getBeta(i, val, aa, res, xScale, yScale, svg, color);
                    res.momentrel = res.M1 / (this._seq.length * ((scaleName === "Eisenberg") ? 1.26 : 10));

                    break;
            }
            allRes.push(res);

        }
        //TODO zooming problems
//        var svg = d3.select(self._displayObj)
////                .attr("width", "100%")
////            .attr("height", "100%")

        return allRes;
    };
    Calc.prototype.getBeta = function (i, val, aa, cData, xScale, yScale, svg, color) {
        var self = this;
        var cumulativeData = this.calculateHelix(i, val, aa, cData, 180);
        var k = i * 20;
        if (val < 0) {
            self.connectByLine(
                    self._xCenter + k
                    , self._yCenter + k
                    , self._xCenter + k - cumulativeData.momo * 6
                    , self._yCenter + k - cumulativeData.momv * 6
                    , color
                    , svg);
        } else {
            self.connectByLine(
                    self._xCenter + k
                    , self._yCenter + k
                    , self._xCenter + k + cumulativeData.momo * 6
                    , self._yCenter + k - cumulativeData.momv * 6
                    , color
                    , svg);
        }

        return cumulativeData;
    };
    Calc.prototype.getTwist = function (i, val, aa, cData, xScale, yScale, svg, color) {
        var self = this;
        var cumulativeData = this.calculateHelix(i, val, aa, cData, 160);
        var koef = (val < 0) ? 1 : -1;

        self.connectByLine(
                self._xCenter
                , self._yCenter
                , self._xCenter - cumulativeData.momo * koef * xScale
                , self._yCenter + cumulativeData.momv * koef * xScale
                , color
                , svg);

        return cumulativeData;
    };
    Calc.prototype.getH310 = function (i, val, aa, cData, xScale, yScale, svg, color) {
        var self = this;
        var cumulativeData = this.calculateHelix(i, val, aa, cData, 111);
        var koef = (val < 0) ? 1 : -1;

        self.connectByLine(
                self._xCenter
                , self._yCenter
                , self._xCenter - cumulativeData.momo * koef * xScale
                , self._yCenter + cumulativeData.momv * koef * xScale
                , color
                , svg);

//        if (self._seq.length<18)
//            self.addAA(
//                  self._xCenter - cumulativeData.momo*koef * 7 
//                , self._yCenter - cumulativeData.momv*koef * 7
//                , "red"
//                , aa  );

        return cumulativeData;
    };
//    Calc.prototype.movePoints=function(cData){
//        cData.x1 = cData.x2;
//        cData.y1 = cData.y2;
//        return cData;
//    };
    Calc.prototype.getAlpha = function (i, val, aa, cData, xScale, yScale, svg, color) {
        var self = this;
        var cumulativeData = this.calculateHelix(i, val, aa, cData, 100);


        var koef = (val < 0) ? 1 : -1;

        self.connectByLine(
                self._xCenter
                , self._yCenter
                , self._xCenter - cumulativeData.momo * koef * yScale
                , self._yCenter + cumulativeData.momv * koef * yScale
                , color
                , svg);
//                console.log(self.colors);
//                console.log(aa);

        return cumulativeData;
    };

    /**
     * 
     * @param {type} i
     * @param {type} val
     * @param {type} aa
     * @param {type} cData
     * @param {type} angle
     * @returns {Calc_L1.Calc.prototype.calculateHelix.cumulativeData}
     */
    Calc.prototype.calculateHelix = function (i, val, aa, cData, angle) {
        var self = this;
        var cumulativeData = {};
        if (cData === undefined || cData == null || cData.m1X == null) {
            cumulativeData = {
                m1Xtot: 0, m1Ytot: 0
                , m1X: null, m1Y: null
                , x1: 0, y1: 0
                , x2: 0, y2: 0
                , momo: null, momv: null
                , mHydr: 0, hydr: 0
                , moment: 0, momentrel: 0, M1: 0
            };
        } else {
            cumulativeData = cData;
        }

        cumulativeData.mHydr = cumulativeData.mHydr + val;
        cumulativeData.hydr = cumulativeData.mHydr / self._seq.length;

        var ang = this._PI * i * angle;
        cumulativeData.m1Y = val * Math.cos(ang);
        cumulativeData.m1X = val * Math.sin(ang);

        var momo = Math.round(cumulativeData.m1X);
        var momv = Math.round(cumulativeData.m1Y);

        cumulativeData.x1 = cumulativeData.x2;
        cumulativeData.y1 = cumulativeData.y2;

//        cumulativeData.x2=momo ;
//        cumulativeData.y2=momv ;
        cumulativeData.x2 = i * Math.cos(ang * this._PI);
        cumulativeData.y2 = i * Math.sin(ang * this._PI);

        cumulativeData.momo = momo;
        cumulativeData.momv = momv;

        cumulativeData.m1Xtot = cumulativeData.m1X + cumulativeData.m1Xtot;
        cumulativeData.m1Ytot = cumulativeData.m1Y + cumulativeData.m1Ytot;

        cumulativeData.M1 = Math.sqrt(
                cumulativeData.m1Xtot * cumulativeData.m1Xtot
                + cumulativeData.m1Ytot * cumulativeData.m1Ytot);

        cumulativeData.moment = cumulativeData.M1 / self._seq.length;

        return cumulativeData;
    };



    Calc.prototype.getPolypeptide = function (i, val, aa, cData, xScale, yScale, svg, color) {
        var self = this;
        var cumulativeData = this.calculateHelix(i, val, aa, cData, 120);
        var koef = (val < 0) ? 1 : -1;

        self.connectByLine(
                self._xCenter
                , self._yCenter
                , self._xCenter + cumulativeData.momo * koef * yScale
                , self._yCenter + cumulativeData.momv * koef * yScale
                , color
                , svg);

//        if (self._seq.length<18)
//            self.addAA(
//                  self._xCenter - cumulativeData.momo*koef * xScale 
//                , self._yCenter - cumulativeData.momv*koef * xScale
//                , self.colors[self.aaCodeConvert(aa)]
//                , self._radius
//                , aa  );

        return cumulativeData;
    };

    Calc.prototype.setHydrophobicColors = function () {


        var wheelColors = {
            'A': this.dec2color(240, 240, 240)
            , 'B': this.dec2color(140, 140, 140)
            , 'C': '#ADD8E6'
            , 'D': '#FF0000'
            , 'E': '#FF0000'
            , 'F': this.dec2color(0, 0, 255)
            , 'G': this.dec2color(240, 240, 240)
            , 'H': '#FF00FF'
            , 'I': this.dec2color(0, 0, 255)
            , 'K': '#FF0000'
            , 'L': this.dec2color(0, 0, 255)
            , 'M': this.dec2color(0, 0, 255)
            , 'N': '#FF00FF'
            , 'O': this.dec2color(255, 0, 0)
            , 'P': this.dec2color(240, 240, 240)
            , 'Q': '#FF00FF'
            , 'R': '#FF0000'
            , 'S': '#FF00FF'
            , 'T': '#FF00FF'
            , 'U': this.dec2color(3, 223, 220)
            , 'V': this.dec2color(0, 0, 255)
            , 'W': this.dec2color(0, 0, 255)
            , 'Y': '#ADD8E6'
            , 'Z': this.dec2color(0, 0, 255)
            , '1': this.dec2color(0, 0, 255)
            , '2': this.dec2color(0, 0, 255)
            , '3': this.dec2color(0, 0, 255)
            , '4': this.dec2color(255, 0, 0)
            , '5': this.dec2color(255, 0, 0)
            , '6': this.dec2color(255, 0, 0)
        };
        this.colors = wheelColors;
    };
    Calc.prototype.getHydrophobicColor = function (aa) {
        var color = this.colors[aa];
        if (color == null || color == undefined)
            return this.dec2color(255, 255, 255);
        return color;
    };

    Calc.prototype.drawHydrophobicityLine = function () {
        var self = this;
        this.clearPanel();
        $(self._displayObj).html("");

        d3.select(self._displayObj).transition();

        var boxSizeX = d3.select(this._displayObj).attr("width") / self._seq.length;
        if (boxSizeX > 50)
            boxSizeX = 50;
        var svg = d3.select(self._displayObj);
        var colorScheme = this.getColorScheme();
//        console.log(colorScheme);
        for (var i = 0; i < this._seq.length; i++) {
            var aa = this._seq[i].toUpperCase();
//            var color = self.getHydrophobicColor(aa);
            var color = colorScheme[aa];
            var layer1 = svg.append('g');
            var cube = layer1
                    .append("rect")
                    .attr("x", i * boxSizeX)
                    .attr("y", 0)
                    .attr("width", boxSizeX)
                    .attr("height", boxSizeX)
                    .style("fill", color);
            layer1
                    .append("text")
                    .attr("x", i * boxSizeX + 0.5 * boxSizeX)
                    .attr("y", 0)
                    .attr("dy", boxSizeX / 2)
                    .text(aa)
                    .style("font-weight", "bold")
                    .style("fill", "white");
        }
    };

    Calc.prototype.aaCodeConvert = function (aa) {
        if (aa === null)
            return null;
        var codes = {
            Ala: 'A', Arg: 'R', Asn: 'N', Asp: 'D'
            , Asx: 'B', Cys: 'C', Gin: 'Q', Glu: 'E'
            , Glx: 'Z', Gly: 'G', His: 'H', Ile: 'I'
            , Leu: 'L', Lys: 'K', Met: 'M', Phe: 'F'
            , Pro: 'P', Ser: 'S', Thr: 'T', Trp: 'W'
            , Tyr: 'Y', Val: 'V'
        };
        if (codes[aa] != undefined)
            return codes[aa];
        var keys = Object.keys(codes);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key.toUpperCase() == aa.toUpperCase()) {
                return  codes[key];
            } else if (codes[key].toUpperCase() == aa.toUpperCase()) {
                return key;
            }
        }
        return null;
    };

    Calc.prototype.dec2color = function (r, g, b) {
        if (r == null)
            return null;
        var color = [];
        color.push('#');

        var tmp = '0' + parseInt(r, 16);
        color.push(tmp.slice(-2));

        tmp = '0' + parseInt(g, 16);
        color.push(tmp.slice(-2));

        tmp = '0' + parseInt(b, 16);
        color.push(tmp.slice(-2));

        return color.join("");
    };
//    Calc.prototype.cleanSeqByScale=function(seq,scale){
//        var seqSrc = seq.upper();
//        var newSeq = "";
////        for (var i = 0 ; i< seqSrc.length ; i++){
////            var letter = seqSrc[i];
////            if (allowed.indexOf(letter)===-1) continue;
////            newSeq = newSeq + letter;
////        }
//        return newSeq;
//    };

    /**
     * 
     * @param {type} x
     * @param {type} y
     * @param {type} color
     * @param {type} radius
     * @param {type} letter
     * @returns {undefined}
     */
    Calc.prototype.addAA = function (x, y, color, radius, letter, svg) {
        if (svg === undefined || svg == null) {
            svg = d3.select(this._displayObj);
            svg.transition();
        }
        svg.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", radius)
                .style("fill", color);
    };

    /**
     * 
     * @param {type} x1
     * @param {type} y1
     * @param {type} x2
     * @param {type} y2
     * @param {type} color
     * @returns {undefined}
     */
    Calc.prototype.connectByLine = function (x1, y1, x2, y2, color, svg) {
        if (svg === undefined || svg == null) {
            svg = d3.select(this._displayObj);
            svg.transition();
        }
        svg.append("line")
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2)
                .attr("stroke-width", 2)
                .attr("stroke", color);
    };

    Calc.prototype.clearPanel = function () {
        $(this._displayObj).html('');
    };

    Calc.prototype.exportToImage = function () {
        var html = d3.select("svg")
                .attr("title", "test2")
                .attr("version", 1.1)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .node().parentNode.innerHTML;

        var blob = new Blob([html], {type: "image/svg+xml"});
        saveAs(blob, "myProfile.svg");
//        d3.select('#saveButton').on('click', function () {
//            var width = 300, height = 300;
//
//            var svg = d3.select('body').append('svg')
//                    .attr('width', width)
//                    .attr('height', height);
//            var svgString = this.getSVGString(svg.node());
//            this.svgString2Image(svgString, 2 * width, 2 * height, 'png', save); // passes Blob and filesize String to the callback
//            function save(dataBlob, filesize) {
//                this.saveAs(dataBlob, 'D3 vis exported to PNG.png'); // FileSaver.js function
//            }
//        });
    };

    Calc.prototype.getSVGString = function (svgNode) {
        svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        var cssStyleText = getCSSStyles(svgNode);
        appendCSS(cssStyleText, svgNode);

        var serializer = new XMLSerializer();
        var svgString = serializer.serializeToString(svgNode);
        svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
        svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

        return svgString;

        function getCSSStyles(parentElement) {
            var selectorTextArr = [];

            // Add Parent element Id and Classes to the list
            selectorTextArr.push('#' + parentElement.id);
            for (var c = 0; c < parentElement.classList.length; c++)
                if (!contains('.' + parentElement.classList[c], selectorTextArr))
                    selectorTextArr.push('.' + parentElement.classList[c]);

            // Add Children element Ids and Classes to the list
            var nodes = parentElement.getElementsByTagName("*");
            for (var i = 0; i < nodes.length; i++) {
                var id = nodes[i].id;
                if (!contains('#' + id, selectorTextArr))
                    selectorTextArr.push('#' + id);

                var classes = nodes[i].classList;
                for (var c = 0; c < classes.length; c++)
                    if (!contains('.' + classes[c], selectorTextArr))
                        selectorTextArr.push('.' + classes[c]);
            }

            // Extract CSS Rules
            var extractedCSSText = "";
            for (var i = 0; i < document.styleSheets.length; i++) {
                var s = document.styleSheets[i];

                try {
                    if (!s.cssRules)
                        continue;
                } catch (e) {
                    if (e.name !== 'SecurityError')
                        throw e; // for Firefox
                    continue;
                }

                var cssRules = s.cssRules;
                for (var r = 0; r < cssRules.length; r++) {
                    if (contains(cssRules[r].selectorText, selectorTextArr))
                        extractedCSSText += cssRules[r].cssText;
                }
            }


            return extractedCSSText;

            function contains(str, arr) {
                return arr.indexOf(str) === -1 ? false : true;
            }

        }

        function appendCSS(cssText, element) {
            var styleElement = document.createElement("style");
            styleElement.setAttribute("type", "text/css");
            styleElement.innerHTML = cssText;
            var refNode = element.hasChildNodes() ? element.children[0] : null;
            element.insertBefore(styleElement, refNode);
        }
    };


    Calc.prototype.svgString2Image = function (svgString, width, height, format, callback) {
        var format = format ? format : 'png';

        var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        var image = new Image();
        image.onload = function () {
            context.clearRect(0, 0, width, height);
            context.drawImage(image, 0, 0, width, height);

            canvas.toBlob(function (blob) {
                var filesize = Math.round(blob.length / 1024) + ' KB';
                if (callback)
                    callback(blob, filesize);
            });


        };

        image.src = imgsrc;
    };

    /** 
     * 
     * @param {type} strucType
     * @param {type} radiusAA
     * @param {type} overWrite
     * @param {type} isNumeric
     * @returns {undefined}
     */
    Calc.prototype.drawWheel = function (strucType, radiusAA, overWrite, isNumeric) {
        this._data = [];
        var angle = Structures[strucType].angle;
        var level = Structures[strucType].round;
        var obj = this._displayObj;
        if (overWrite === true)
            $(obj).html('');
        var zoom = function () {
//            svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
            svg.attr("transform", " scale(" + d3.event.scale + ")");
        }
        var svg = d3.select(obj);
        svg.transition();
        svg.append('g');
        svg.call(d3.behavior.zoom().scaleExtent([0.2, 1]).on("zoom", zoom));
        var xCenter, yCenter;
        xCenter = svg.attr("width") / 2;
        yCenter = svg.attr("height") / 2;

        var colorScheme = this.getColorScheme();
        var x, y, xOld, yOld;
//        var radiusKoef = radiusAA-0.3*radiusAA
        for (var i = 0; i < this._seq.length; i++) {
            var radius = 0.40 * ((xCenter < yCenter) ? xCenter : yCenter) * (0.4 * Math.floor(i / level) + 1);
            var aa = this._seq[i].toUpperCase();
            var newAngle = this._PI * i * angle;

            x = xCenter + radius * Math.cos(newAngle);
            y = yCenter + radius * Math.sin(newAngle);

            if (i > 0) {
//                console.log("x1:"+xOld+" y1:"+yOld + " x2:"+x+" y2:"+y);
                svg.append("line")
                        .attr("x1", xOld)
                        .attr("y1", yOld)
                        .attr("x2", x)
                        .attr("y2", y)
                        .attr("stroke-width", 2)
                        .attr("stroke", "grey");
            }
            xOld = x;
            yOld = y;
        }
        for (var i = 0; i < this._seq.length; i++) {
            var aa = this._seq[i].toUpperCase();
            var newAngle = this._PI * i * angle;
//            var color = this.getHydrophobicColor(aa);
            var color = colorScheme[this.aaCodeConvert(aa)];
//            var diff = Math.ceil(i * angle/360) * (3*radiusAA);
            var radius = 0.40 * ((xCenter < yCenter) ? xCenter : yCenter) * (0.4 * Math.floor(i / level) + 1);

            x = xCenter + radius * Math.cos(newAngle);
            y = yCenter + radius * Math.sin(newAngle);
//            console.log(x+' '+y);
            svg.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", radiusAA)
                    .style("fill", color);
            
            this._data.push({
                aa: aa, 
                angle: newAngle,
                radius: radius,
                x: radius * Math.cos(newAngle),
                y: radius * Math.sin(newAngle),
                seq: i+1
            });
            
            this.addAALetter(svg, x, y, "white", 21, (isNumeric) ? i : aa);

        }

        var scale = 1;
        if (Math.floor(this._seq.length / level) + 1 > 1) {
            scale = 1 - (this._seq.length / level) * 0.2;
        }

//        svg.attr("transform","scale("+scale+")");

    };
    Calc.prototype.getAASize = function (angle, radiusAA) {
        var koef = 1;
        if (angle > 0 && angle < 180) {
            koef = 360 - angle / 2;
        } else {
            koef = angle / 2 + 90;
        }
        koef = koef / 180;
        return radiusAA * koef;
    };
    Calc.prototype.horizontalSpiral = function (strucType) {
        var radiusAA = this._radiusAA;
        var self = this;
        var angle = Structures[strucType].angle;
        var level = Structures[strucType].round;
        var obj = this._displayObj;
        $(obj).html('');

        var zoom = function () {
//            svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
            svg.attr("transform", " scale(" + d3.event.scale + ")");
        };

        var svg = d3.select(obj);
        svg.transition();
        svg.append('g');
        svg.call(d3.behavior.zoom().scaleExtent([0.2, 1]).on("zoom", zoom));

        var xCenter, yCenter;
        xCenter = svg.attr("width") / 2;
        yCenter = svg.attr("height") / 2;

        var colorScheme = this.getColorScheme();
        var x, y, xOld, yOld;
//        var radiusKoef = radiusAA-0.3*radiusAA
        for (var i = 0; i < this._seq.length; i++) {
            var radius = 0.40 * ((xCenter < yCenter) ? xCenter : yCenter);
            var aa = this._seq[i].toUpperCase();
            var newAngle = this._PI * i * angle;

            x = 2 * radiusAA + radius * Math.cos(newAngle) + i * radiusAA;
            y = yCenter + radius * Math.sin(newAngle);

            if (i > 0) {
//                console.log("x1:"+xOld+" y1:"+yOld + " x2:"+x+" y2:"+y);
                svg.append("line")
                        .attr("x1", xOld)
                        .attr("y1", yOld)
                        .attr("x2", x)
                        .attr("y2", y)
                        .attr("stroke-width", 2)
                        .attr("stroke", "grey");
            }

            xOld = x;
            yOld = y;
        }
        for (var i = 0; i < this._seq.length; i++) {
            var aa = this._seq[i].toUpperCase();
            var newAngle = this._PI * i * angle;
//            var color = this.getHydrophobicColor(aa);
            var color = colorScheme[this.aaCodeConvert(aa)];
//            var diff = Math.ceil(i * angle/360) * (3*radiusAA);
            var radius = 0.40 * ((xCenter < yCenter) ? xCenter : yCenter);

            x = 2 * radiusAA + radius * Math.cos(newAngle) + i * radiusAA;
            y = yCenter + radius * Math.sin(newAngle);
//            console.log(x+' '+y);

            svg.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", self.getAASize((i * angle) % 360, radiusAA))
                    .style("fill", color);

            this.addAALetter(svg, x, y, "white", 21, aa);

        }

        var scale = 1;
        if (Math.floor(this._seq.length / level) + 1 > 1) {
            scale = 1 - (this._seq.length / level) * 0.2;
        }

//        svg.attr("transform","scale("+scale+")");

    };
    /**
     *  
     * @param {type} angle
     * @returns {undefined}
     */
    Calc.prototype.drawArchimedes = function (angle) {
        var radiusAA = this._radiusAA;
        $(this._displayObj).html('');
        var svg = d3.select(this._displayObj);
        svg.transition();
        var zoom = function () {
//            svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
            svg.attr("transform", " scale(" + d3.event.scale + ")");
        }
        svg.append('g');
        svg.call(d3.behavior.zoom().scaleExtent([0.2, 1]).on("zoom", zoom));
        var xCenter, yCenter;
        xCenter = svg.attr("width") / 2;
        yCenter = svg.attr("height") / 2;
        var maxRadius = 0.65 * ((xCenter < yCenter) ? xCenter : yCenter);
//                    var radius = 0.40 * ((xCenter < yCenter) ? xCenter : yCenter )*(0.4*Math.floor(i/level)+1) ;


        var colorScheme = this.getColorScheme();
        var x, y, xOld, yOld;
        for (var i = 0; i < this._seq.length; i++) {
            var aa = this._seq[i].toUpperCase();
            var newAngle = this._PI * i * angle;
//            var color = this.getHydrophobicColor(aa);
//            var color = colorScheme[this.aaCodeConvert(aa)];
//            var diff = Math.ceil(i * angle/360) * (3*radiusAA);
            var radius = (i + 2) * radiusAA * 0.35;
            x = this._xCenter + radius * Math.cos(newAngle);
            y = this._yCenter + radius * Math.sin(newAngle);

            if (i > 0) {
                svg.append("line")
                        .attr("x1", xOld)
                        .attr("y1", yOld)
                        .attr("x2", x)
                        .attr("y2", y)
                        .attr("stroke-width", 2)
                        .attr("stroke", "grey");
            }

            xOld = x;
            yOld = y;
        }
        for (var i = 0; i < this._seq.length; i++) {
            var aa = this._seq[i].toUpperCase();
            var newAngle = this._PI * i * angle;
//            var color = this.getHydrophobicColor(aa);
            var color = colorScheme[this.aaCodeConvert(aa)];
//            var diff = Math.ceil(i * angle/360) * (3*radiusAA);
            var radius = (i + 2) * radiusAA * 0.35;
            x = this._xCenter + radius * Math.cos(newAngle);
            y = this._yCenter + radius * Math.sin(newAngle);
//            console.log(x+' '+y);
            svg.append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", radiusAA)
                    .style("fill", color);
            this.addAALetter(svg, x, y, "white", 22, aa);

        }


    };
    /**
     * 
     * @param {type} svg
     * @param {type} x
     * @param {type} y
     * @param {type} color
     * @param {type} size
     * @param {type} letter
     * @returns {undefined}
     */
    Calc.prototype.addAALetter = function (svg, x, y, color, size, letter) {
        svg.append("text")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", "." + size + "em")
                .attr("text-anchor", "middle") // set anchor y justification
//            .attr("text-decoration", "bold") 
                .style("fill", color)
                .style("font-weight", "bold")
                .text(letter);          // define the text to display
    };
 
    Calc.prototype.printTable = function (data, clearTable) {
        if (clearTable === true)
            $(this._resultTableObj).html("");
        if (data == null) {
            console.log("data item empty");
            return;
        }
        if (this._resultTableObj == undefined || this._resultTableObj == null || this._resultTableObj == "")
            return;

        var keys = Object.keys(data);
        var html = [];
        var disabledKeys = ["x1", "x2", "y1", "y2", "hydr", "momo", "momv", "momX", "momY", "m1X", "m1Y"];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (disabledKeys.indexOf(key) > -1)
                continue;
            var descr = (Descriptions[key] === undefined) ? key : Descriptions[key];
            var val = data[keys[i]];
            html.push("<tr>");
            html.push("<td>");
            html.push(descr);
            html.push("</td>");
            html.push("<td>");
            html.push(val);
            html.push("</td>");
            html.push("</tr>");
        }
        $(this._resultTableObj).html(html.join(""));
    };

    return Calc;
})();