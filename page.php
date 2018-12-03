<html>

<head>
  <style type="text/css">
    html,
    body {
      height: 100%;
      margin: 0;
      padding: 0;
    }

    .content {
      display: table;
      width: 100%;
      border-spacing: 10px;
      border-collapse: separate;
      background: #A36;
      height: 100%;
      padding: 40px 0;
      margin: -40px 0;
    }

    .Col {
      display: table-cell;
      border-radius: 5px;
      background: #fff;
    }

    #header, #footer {
      height: 40px;
      background: #2F7;
      position: relative;
      z-index: 1;
    }
  </style>
</head>

<body>
  <div id="header"></div>
  <div class="content">
    <div id="center" class="Col"></div>
  </div>
  <div id="footer"></div>
</body>

</html>