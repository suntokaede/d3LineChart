function d3LineChart(file, options) {

        this.init(options);
        this.loadCSV(file);

    }

    d3LineChart.prototype = {

        init: function (options) {
            var _this = this;
            this.defaultOptions = {

              margin: {

                top: 20,
                right: 30,
                bottom: 30,
                left: 60

              },
              width: 960,
              height: 500,
              selectWrapperId: "selectWrapper",
              graphWrapperId: "graphWrapper",
              charset: "Shift_JIS",
              timeFormat: "%Y/%m/%d",
              fileFormat: "csv"

            };
            this.options = this.updateObj(this.defaultOptions, options);
            this.window = window;
            this.sw = document.getElementById(this.options.selectWrapperId);
            this.d3gw = d3.select("#" + this.options.graphWrapperId);
            this.d3gw.style("position", "relative");
            this.separator = this.options.fileFormat === "csv" ? "," : " ";
            this._csv = d3.dsv(this.separator, "text/" + this.options.fileFormat + "; charset=" + this.options.charset);
            this.width = this.d3gw.node().getBoundingClientRect().width - this.options.margin.left - this.options.margin.right;
            this.height = this.options.height - this.options.margin.top - this.options.margin.bottom;
            this.parseDate = d3.time.format(this.options.timeFormat).parse;
            this.div = this.d3gw.append("div").attr("class", "d3_div");
            this.x = d3.time.scale().range([0, this.width]);
            this.y = d3.scale.linear().range([this.height, 0]);
            this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
            this.yAxis = d3.svg.axis().scale(this.y).orient("left");
            this.line = d3.svg.line()
                        .x(function (d) { return _this.x(d.__x); })
                        .y(function (d) { return _this.y(d.__y); });
            this.svg = this.d3gw.append("svg")
                       .attr("width", this.width + this.options.margin.left + this.options.margin.right)
                       .attr("height", this.height + this.options.margin.top + this.options.margin.bottom)
                       .append("g")
                       .attr("transform", "translate(" + this.options.margin.left + "," + this.options.margin.top + ")");
            this.svgElement = this.d3gw.select("svg");
            this.data = [];

        },

        updateObj: function (master, overwriter) {// masterが上書きされる側,overwriterが上書きする側

            for (var l in overwriter) {
                if (typeof overwriter[l] == 'object') {// Object判定
                    if (!master[l]) {
                        master[l] = {};
                    }
                    this.updateObj(master[l], overwriter[l]);
                } else {                               //その他
                    master[l]  = overwriter[l];
                }
            }
            return master;

        },

        loadCSV: function (file, data) {

            var _this = this;
            if (data) {

                this.data = data;
                this.headerNames = d3.keys(this.data[0]);
                this.createSelector();

            } else {

                this._csv(file, function (error, data) {

                    if (error) { console.log(error); }
                    else { _this.loadCSV(null, data); }

                });

            }

        },

          createSelector: function () {

            var _this = this;
            this.select = document.createElement("select");
            for (var i = 1, l = this.headerNames.length; i < l; i++) {
                var o = document.createElement("option");
                o.textContent = this.headerNames[i];
                this.select.appendChild(o);
            }
            this.sw.appendChild(this.select);
            this.select.addEventListener("change", function () { _this.update.call(_this); },false);
            this.window.addEventListener("resize", function () { _this.update.call(_this); }, false);
            this.draw();

        },

          update: function () {

            this.width = this.d3gw.node().getBoundingClientRect().width - this.options.margin.left - this.options.margin.right;
            this.height = this.options.height - this.options.margin.top - this.options.margin.bottom;
            this.x = d3.time.scale().range([0, this.width]);
            this.y = d3.scale.linear().range([this.height, 0]);
            this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
            this.yAxis = d3.svg.axis().scale(this.y).orient("left");
            this.svgElement.attr("width", this.width + this.options.margin.left + this.options.margin.right)
                           .attr("height", this.height + this.options.margin.top + this.options.margin.bottom);
            this.d3gw.selectAll("path").remove();
            this.d3gw.selectAll("circle").remove();
            this.d3gw.selectAll("g[class='y axis']").remove();
            this.d3gw.selectAll("g[class='x axis']").remove();
            this.draw();

        },

        fetchKey: function () {

            return this.select.options[this.select.selectedIndex].value;

        },

        draw: function () {

            var _this = this;
            this.data.forEach(function (d) {

                d.__x = _this.parseDate(d[_this.headerNames[0]]);
                d.__y = +d[_this.fetchKey()];

            });

            this.x.domain(d3.extent(this.data, function (d) { return d.__x; }));
            this.y.domain(d3.extent(this.data, function (d) { return d.__y; }));

            this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + this.height + ")")
                .call(this.xAxis);

            this.svg.append("g")
                    .attr("class", "y axis")
                    .call(this.yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(this.fetchKey());

            this.svg.append("path")
                    .datum(this.data)
                    .attr("class", "line")
                    .attr("d", this.line);

            this.svg.selectAll("dot")
                        .data(this.data)
                        .enter()
                        .append("circle")
                        .on("mouseover", function (d) {
                            _this.div.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                            _this.div.transition()
                                    .duration(200)
                                    .style("opacity", 1);
                            _this.div.html(d.__y + "<br/>" + d.__x.toLocaleDateString())
                                    .style("left", _this.x(d.__x) + 60 + "px")
                                    .style("top", _this.y(d.__y) - 35 + "px");
                        })
                        .attr("cx", function (d) {
                            return _this.x(d.__x);
                        })
                        .attr("cy", function (d) {
                            return _this.y(d.__y);
                        })
                        .attr("r", 0)
                        .attr("stroke", "#black")
                        .attr("stroke-width", "1px")
                        .attr("fill", "#C5EBB9")
                        .transition()
                        .duration(1000)
                        .attr("r", 3.5);
        }

    };
