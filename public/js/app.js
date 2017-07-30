var app = angular.module('home', [])

var url = 'http://localhost:3001'

app.controller('Ctrl', function($scope, $http){
  $scope.test = 'Hola mundo'
  $scope.show_edit = true
  $scope.show_NEW = true
  $scope.dev = {
    nombre : null,
    ap: null,
    am : null,
    edad : null,
    lenguaje : null,
    pais : null
  }

  $http.get(url + '/get-all')
  .success(function(result){
    console.log(result);
    var node    = 0
        ruby    = 0
        python  = 0
        c       = 0
        c_plus  = 0
        cobol   = 0
        abap    = 0
        php     = 0
        c_sharp = 0
        otro    = 0
    for (var key in result) {
      if (result[key].lenguaje_id == 1) {
        node++
      }
      if (result[key].lenguaje_id == 2) {
        ruby++
      }
      if (result[key].lenguaje_id == 3) {
        python++
      }
      if (result[key].lenguaje_id == 4) {
        c++
      }
      if (result[key].lenguaje_id == 5) {
        c_plus++
      }
      if (result[key].lenguaje_id == 6) {
        cobol++
      }
      if (result[key].lenguaje_id == 7) {
        abap++
      }
      if (result[key].lenguaje_id == 8) {
        php++
      }
      if (result[key].lenguaje_id == 9) {
        c_sharp++
      }
      if (result[key].lenguaje_id == 10) {
        otro++
      }
    }
    $scope.programador = result
    $http.get(url + '/get-lenguaje')
    .success(function(result){
      console.log(result, 'lenguaje')
      $scope.lenguaje = result
      var arr_leng = []
      for (var key in result) {
        arr_leng.push(result[key].nombre)
      }
      console.log(arr_leng, 'array de lenguajes');
      var ctx = document.getElementById("myChart").getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: arr_leng,
          datasets: [{
            backgroundColor: [
              "#2ecc71",
              "#3498db",
              "#95a5a6",
              "#9b59b6",
              "#f1c40f",
              "#e74c3c",
              "#34495e",
              "#34494e",
              "#34389e",
              "#45495e"
            ],
            data: [node, ruby, python, c, c_plus, cobol, abap, php, c_sharp ,otro]
          }]
        }
      });
    })
  })

  $scope.btnAgregar = function (item) {
    console.log(item);
    $http.post('/set-new-dev', item)
    .success(function(result){
      $scope.programador.push(item)
      console.log(result);
      $scope.show_NEW = false
      setTimeout(function () {
        location.reload()
      }, 1000);
    })
  }

  $scope.btnEditar = function (item) {
    console.log(item, 'editar')
    $scope.editarDev  = []
    $scope.editarDev.push(item)
  }

  $scope.btnEliminar = function (item) {
    console.log(item, 'eliminar');
    $http.post(url + '/set-delete', item)
    .success(function(result){
      console.log(result, 'eliminar');
      $scope.show_edit = false
      setTimeout(function () {
        location.reload()
      }, 1000);
    })
  }

  $scope.btnDescargar = function () {
    $http.get('/get-download')
    .success(function(result){
      if (result == 1) {
        location.href = 'http://localhost:3001/upload/programador.xlsx'
      } else {
        alert('Hubo un error al generar la descarga')
      }
    })
  }

  $scope.btnUpdate = function (item) {
    item = $scope.editarDev
    $http.post(url + '/set-update', item)
    .success(function(result){
      $scope.show_edit = false
      setTimeout(function () {
        location.reload()
      }, 1000);
    })
  }
})
