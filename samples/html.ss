<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo($variable) ?></title>
</head>
<body>
  <?ss 
    $variable1 = "hello world";
    function nana ($a, $b) {
      return $a + $b;
    }

    $variable2 = nana(5, 10);
    
    echo($variable2);
  ?>
</body>
</html>