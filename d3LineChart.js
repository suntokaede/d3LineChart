/// <reference path="../typings/d3/d3.d.ts"/>
var d3LineChart = (function () {
    function d3LineChart(url, args) {
        this.defaultOptions = {
            margin: {
                top: 20,
                right: 30,
                bottom: 30,
                left: 60
            },
            height: 500,
            selectWrapperId: "selectWrapper",
            graphWrapperId: "graphWrapper",
            charset: "Shift_JIS",
            timeFormat: "%Y/%m/%d",
            xAxisFormat: "%m月%d日(%a)",
            xAxisTicks: null,
            yDomain: [null, null],
            mouseOverTransitionTime: 500,
            mouseOutTransitionTime: 500,
            locale: {
                "decimal": ".",
                "thousands": ",",
                "grouping": [3],
                "currency": ["", "円"],
                "dateTime": "%a %b %e %X %Y",
                "date": "%Y/%m/%d",
                "time": "%H:%M:%S",
                "periods": ["AM", "PM"],
                "days": ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
                "shortDays": ["日", "月", "火", "水", "木", "金", "土"],
                "months": ["睦月", "如月", "弥生", "卯月", "皐月", "水無月", "文月", "葉月", "長月", "神無月", "霜月", "師走"],
                "shortMonths": ["01月", "02月", "03月", "04月", "05月", "06月", "07月", "08月", "09月", "10月", "11月", "12月"]
            }
        };
        this.url = url;
        this.args = args;
        this.main();
    }
    //初期化
    d3LineChart.prototype.init = function () {
        this.options = this.updateObj(this.defaultOptions, this.args);
        this.d3selectWrapper = d3.select("#" + this.options.selectWrapperId);
        this.d3graphWrapper = d3.select("#" + this.options.graphWrapperId);
        this.d3graphWrapper.style("position", "relative");
        this.width = this.d3graphWrapper.node().getBoundingClientRect().width - this.options.margin.left - this.options.margin.right;
        this.height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        switch (this.fetchExtension()) {
            case "csv":
                this.fileFormat = "csv";
                this.separator = ",";
                break;
            case "tsv":
                this.fileFormat = "tsv";
                this.separator = "\t";
                break;
            default:
                console.error("Invalid FileType");
                return;
        }
        this.svg = this.d3graphWrapper.append("svg").attr({
            width: this.width + this.options.margin.left + this.options.margin.right,
            height: this.height + this.options.margin.top + this.options.margin.bottom
        })
            .append("g")
            .attr("transform", "translate(" + this.options.margin.left + "," + this.options.margin.top + ")");
        this.xAxis = d3.svg.axis().innerTickSize(-this.height).outerTickSize(0).tickPadding(10);
        this.yAxis = d3.svg.axis().innerTickSize(-this.width).outerTickSize(0).tickPadding(10);
        this.toolTip = this.d3graphWrapper.append("div").attr("class", "d3_tooltip");
        this.legend = this.d3graphWrapper.append("div").attr("class", "d3_legend")
            .style({ top: (this.options.margin.top + 10) + "px", right: (this.options.margin.right + 10) + "px" });
        this.parseDay = d3.time.format(this.options.xAxisFormat);
        this.parseDate = d3.time.format(this.options.timeFormat).parse;
        this.locale = d3.locale(this.options.locale);
        this.colorCategoryScale = d3.scale.category10();
        this.loadFile = d3.dsv(this.separator, "text/" + this.fileFormat + "; charset=" + this.options.charset);
    };
    d3LineChart.prototype.line = function (key) {
        var _this = this;
        return d3.svg.line().x(function (d) { return _this.x(d.__x); }).y(function (d) { return _this.y(d[("__" + key)]); });
    };
    // オブジェクトをオブジェクトで上書き（masterが上書きされる側,overwriterが上書きする側）
    d3LineChart.prototype.updateObj = function (master, overwriter) {
        for (var l in overwriter) {
            // Object, Array判定
            if (typeof overwriter[l] === "object") {
                if (!master[l]) {
                    master[l] = {};
                }
                this.updateObj(master[l], overwriter[l]);
            }
            else {
                master[l] = overwriter[l];
            }
        }
        return master;
    };
    //ファイルの拡張子を取得します
    d3LineChart.prototype.fetchExtension = function () {
        if (!this.url)
            return;
        var str = this.url.split(/\.(?=[^.]+$)/);
        var strLength = str.length;
        return str[strLength - 1];
    };
    //チェックが入っているチェックボックスのキー一覧を返します
    d3LineChart.prototype.listCheckedboxKeys = function () {
        var checkboxes = this.d3selectWrapper.selectAll("label").selectAll("input[type='checkbox']"), ret = [];
        checkboxes.forEach(function (e) {
            if (e[0].checked) {
                ret.push(e[0].dataset.key);
            }
        });
        return ret;
    };
    //表示されているすべてのデータが枠に収まるドメインを生成します
    d3LineChart.prototype.makeDomainFromCheckedItem = function () {
        var _this = this;
        var ret = [0, 0], tmpMax = this.options.yDomain[1] != null ? [this.options.yDomain[1]] : [], tmpMin = this.options.yDomain[0] != null ? [this.options.yDomain[0]] : [];
        this.listCheckedboxKeys().forEach(function (key) {
            tmpMax.push(d3.max(_this.data, function (d) { return d[("__" + key)]; }));
            tmpMin.push(d3.min(_this.data, function (d) { return d[("__" + key)]; }));
        });
        ret = [Math.min.apply(null, tmpMin), Math.max.apply(null, tmpMax)];
        return ret;
    };
    // CSV or TSVの読み込み
    d3LineChart.prototype.load = function (data) {
        var _this = this;
        if (data) {
            this.data = data;
            //ヘッダーのキーを取得
            this.keys = d3.keys(this.data[0]);
            //データのパース、チェックボックスの作成、イベントリスナーの登録
            this.parseAllData();
            this.createCheckbox();
            this.update();
            window.addEventListener("resize", function () { _this.update.call(_this); }, false);
            //ここでreturnしないとまたloadFileが呼ばれて無限ループします
            return;
        }
        //loadFile(d3.dsv)が非同期メソッドの為、読み込みが終了したときにload関数を再度呼び出すようにしています
        this.loadFile(this.url, function (error, data) {
            if (error != null) {
                console.error(error);
                return;
            }
            if (data) {
                _this.load(data);
            }
        });
    };
    //チェックボックスを作成します
    d3LineChart.prototype.createCheckbox = function () {
        var _this = this;
        for (var i = 1, l = this.keys.length; i < l; i++) {
            var label = this.d3selectWrapper.append("label").attr("data-key", this.keys[i]).style("display", "block").style("margin-bottom", "10px");
            label.append("input").attr("type", "checkbox").attr("data-key", this.keys[i]).style("display", "none")
                .on("change", function () { _this.update.call(_this); });
            label.append("span").attr("style", "display: inline-block; margin-right: 5px; border-radius: 50%; width: 16px; height: 16px; background-color:" + this.colorCategoryScale("__" + this.keys[i]));
            label.append("text").text(this.keys[i]);
        }
    };
    //凡例のアクティブな項目をハイライトします
    d3LineChart.prototype.highlightActiveLegend = function () {
        var _this = this;
        this.d3selectWrapper.selectAll("label").style("background-color", "transparent");
        this.listCheckedboxKeys().forEach(function (key) {
            _this.d3selectWrapper.selectAll("label[data-key='" + key + "']").style("background-color", "#ceede5");
        });
    };
    //全てのデータをパースします
    d3LineChart.prototype.parseAllData = function () {
        var _this = this;
        this.data.forEach(function (d) {
            d["__x"] = _this.parseDate(d[_this.keys[0]]);
            for (var i = 1, l = _this.keys.length; i < l; i++) {
                d[("__" + _this.keys[i])] = +d[_this.keys[i]];
            }
        });
    };
    //ステータスの更新
    d3LineChart.prototype.update = function () {
        //値の変更の影響を受けるメソッドを再度実行
        this.width = this.d3graphWrapper.node().getBoundingClientRect().width - this.options.margin.left - this.options.margin.right;
        this.height = this.options.height - this.options.margin.top - this.options.margin.bottom;
        this.x = d3.time.scale().domain(d3.extent(this.data, function (d) { return d.__x; })).range([0, this.width]);
        this.y = d3.scale.linear().domain(this.makeDomainFromCheckedItem()).range([this.height, 0]);
        this.xAxisTicks = Math.min(this.options.xAxisTicks | this.xAxis.ticks()[0], this.data.length);
        this.xAxis.scale(this.x).orient("bottom").innerTickSize(-this.height).tickFormat(this.locale.timeFormat(this.options.xAxisFormat)).ticks(this.xAxisTicks);
        this.yAxis.scale(this.y).orient("left").innerTickSize(-this.width);
        this.svg.attr({
            width: this.width + this.options.margin.left + this.options.margin.right,
            height: this.height + this.options.margin.top + this.options.margin.bottom
        });
        //凡例のハイライト
        this.highlightActiveLegend();
        //既存のグラフを削除
        this.clear();
        //draw呼び出し
        this.draw();
    };
    //SVGをクリア
    d3LineChart.prototype.clear = function () {
        this.d3graphWrapper.selectAll("path").remove();
        this.d3graphWrapper.selectAll("circle").remove();
        this.d3graphWrapper.selectAll("g[class='y axis']").remove();
        this.d3graphWrapper.selectAll("g[class='x axis']").remove();
        this.legend.selectAll("label").remove();
    };
    //描写
    d3LineChart.prototype.draw = function () {
        var _this = this;
        //x軸
        this.svg.append("g")
            .attr({
            class: "x axis",
            transform: "translate(0," + this.height + ")"
        })
            .call(this.xAxis);
        //y軸
        this.svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis)
            .append("text")
            .attr({ transform: "rotate(-90)", y: 6, dy: ".71em" })
            .style("text-anchor", "end");
        //表示する項目のパス、点と凡例を描写
        this.listCheckedboxKeys().forEach(function (key) {
            //パス
            _this.svg.append("path")
                .datum(_this.data)
                .attr({ class: "line", d: _this.line(key), stroke: function () { return _this.colorCategoryScale("__" + key); } });
            //点とツールチップス
            _this.svg.selectAll("dot")
                .data(_this.data)
                .enter()
                .append("circle")
                .on("mouseover", function (d) {
                _this.toolTip.transition()
                    .duration(_this.options.mouseOverTransitionTime)
                    .style("opacity", 1);
                _this.toolTip.html(d[("__" + key)] + "<br/>" + d.__x.toLocaleDateString())
                    .style("left", _this.x(d.__x) + 60 + "px")
                    .style("top", _this.y(d[("__" + key)]) - 35 + "px");
            })
                .on("mouseout", function () {
                _this.toolTip.transition()
                    .duration(_this.options.mouseOutTransitionTime)
                    .style("opacity", 0);
            })
                .attr({
                cx: function (d) { return _this.x(d.__x); },
                cy: function (d) { return _this.y(d[("__" + key)]); },
                r: 0,
                stroke: "#black",
                fill: function () { return _this.colorCategoryScale("__" + key); }
            })
                .attr("stroke-width", "1px")
                .transition()
                .duration(1000)
                .attr("r", 3.5);
            //凡例
            _this.legend.append("label").style("margin-bottom", "10px").style({ display: "block" })
                .html("<div style='display: inline-block; border-radius: 50%; width :14px; height:14px; background-color:" + _this.colorCategoryScale("__" + key) + "'></div> " + key + "<br>");
        });
    };
    d3LineChart.prototype.main = function () {
        this.init();
        this.load();
    };
    return d3LineChart;
})();
//# sourceMappingURL=d3LineChart.js.map
