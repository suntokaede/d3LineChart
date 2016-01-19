# d3LineChart

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
      xAxisFormat: "%m月%d日", //   x軸の時間フォーマット
  
    };
    var graph = new d3LineChart(url, options);

    </script>
  
  オプションで値を指定されなかった場合は、既定値が自動的に入ります。（上の例が既定値です。）  
  データベースのカラム一列目が横軸、それ以外のカラムが縦軸になります。  
  縦軸はセレクタで選択できます。

サンプル http://suntokaede.github.io/d3LineChart/

## Update

ver1.2.0 ファイルの拡張子を自動で判別するように変更　それに伴いfileFormatを削除　tsvファイルを正常に読み込めるよう修正
ver1.1.0 xAxisFormatを追加
ver1.0.0 公開

## License

The MIT License (MIT)
Copyright (c) 2016 SuntoKaede

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
