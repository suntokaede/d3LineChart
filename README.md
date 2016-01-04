# d3LineChart

csv,tsvファイルを基にラインチャートを起こすライブラリです。

使い方

  例
  
  <div id="selectWrapper"></div>  <!--　セレクタを格納するラッパー -->
  <div id="graphWrapper"></div>   <!--　svgを格納するラッパー -->
  <script>
  var url = "database.csv";
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
    timeFormat: "%Y/%m/%d", //  時間のフォーマット（https://github.com/mbostock/d3/wiki/Time-Formatting）
    fileFormat: "csv" //  ファイル形式
  
  };
  var graph = new d3LineChart(url, options);

  </script>
  
  オプションで値を指定されなかった場合は、既定値が自動的に入ります。（上の例が既定値です。）
  データベースのカラム一行目が横軸、それ以外のカラムが縦軸になります。
  縦軸はセレクタで選択できます。
