# d3LineChart

![alt text](https://github.com/suntokaede/d3LineChart/blob/master/sample.png)
csv,tsvファイルを基にラインチャートを起こすライブラリです。

## 使い方

#### head内

    <link rel="stylesheet" type="text/css" href="d3LineChart.css">

#### body内

    <div id="selectWrapper"></div>  <!--　セレクタを格納するラッパー -->
    <div id="graphWrapper"></div>   <!--　svgを格納するラッパー -->
    <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
    <script src="d3LineChart.js"></script>
    <script>
    var url = "data.csv";
    var options = {
  
      margin: { //  svg要素に対するグラフのマージン
    
        top: 20,
        right: 30,
        bottom: 30,
        left: 60
    
      },
      height: 500,  //  svg要素の高さ（幅はラッパーに合わせ自動的にリサイズします）
      selectWrapperId: "selectWrapper", //  セレクタのラッパーID
      graphWrapperId: "graphWrapper", //  グラフのラッパーID
      charset: "Shift_JIS", //  ファイルの文字コード
      timeFormat: "%Y/%m/%d", //  csvファイルの時間フォーマット（https://github.com/mbostock/d3/wiki/Time-Formatting）
      xAxisFormat: "%m月%d日", //  x軸の時間フォーマット
      xAxisTicks: null, //　x軸の目盛りの数（既定では自動で計算されます）
      yDomain: [null, null] //　y軸のドメイン（[最小値,最大値]のフォーマット）データがここで指定した値の外にある場合は無視されます。
      mouseOverTransitionTime: 500, // マウスオーバー時のツールチップスがフェードインする時間です。（ミリ秒）
    　mouseOutTransitionTime: 500, // マウスアウト時のツールチップスがフェードアウトする時間です。（ミリ秒）
    　legendBackgroundColor: "#dfa", // 凡例のアクティブな項目の背景色
    　locale: { //　ロケール（https://github.com/mbostock/d3/wiki/Localization）
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
    　},
    　secondYAxisKeys: null, // y軸右側に配置するキー （["key1", "key2"]のフォーマット）
    　tooltip: function (x, y, key) { return y + "<br/>" + x.toLocaleDateString(); }, // ツールチップ内のhtml
      yLeftPalette: ["#1f77b4", "#5254a3", "#6b6ecf", "#6baed6", "#756bb1", "#9c9ede", "#9e9ac8", "#9ecae1", "#aec7e8", "#bcbddc", "#c6dbef", "#dadaeb"],
      // y軸左側の項目用のパレット
      yRightPalette: ["#f7b6d2", "#fd8d3c", "#fdae6b", "#fdd0a2", "#ff9896", "#e377c2", "#e6550d", "#e7969c", "#d62728", "#d6616b", "#ad494a", "#843c39"]
      // y軸右側の項目用のパレット
    };
    var graph = new d3LineChart(url, options);

    </script>
  
  オプションで値を指定されなかった場合は、既定値が自動的に入ります。（上の例が既定値です。）  
  データベースのカラム一列目が横軸、それ以外のカラムが縦軸になります。  
  縦軸は凡例をクリックすることで選択できます。（複数選択可）

サンプル http://suntokaede.github.io/d3LineChart/

## Update

・Ver1.3.4  
第二軸に対応。  
secondYAxisKeys, tooltip, yLeftPalette, yRightPaletteを追加。  
・Ver1.3.0  
xAxisTicks, yDomain, mouseOverTransitionTime, mouseOutTransitionTime, legendBackgroundColor, localeを追加。  
グリッド線の追加。  
複数のデータを同時に表示できるように変更。  
凡例の表示。  
・Ver1.2.0  
ファイルの拡張子を自動で判別するように変更　それに伴いfileFormatを削除　tsvファイルを正常に読み込めるよう修正  
・Ver1.1.0  
xAxisFormatを追加  
・Ver1.0.0  
公開

## License

The MIT License (MIT)
Copyright (c) 2016 SuntoKaede

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
