var URL_BASE = "http://localhost:8080/"

function updateList(){

    $.ajax(URL_BASE+"rota",{
        method:'get',
    }).done(function(res) {

        console.log(res._embedded.rota);

        let select = $('#sel-linha');
        select.html("");

        $(res._embedded.rota).each(function(index,el){
            let rota = el;
            let option =  $('<option></option>').attr('value', index).text(rota.nomeRota);
            select.append(option);
        })
       
    })
    .fail(function(res) {
        let select = $('#sel-linha');
        select.html("");
        let option = $('<option></option>').text('Não foi possível carregar as opções');
        select.append(option);
    });
}

$(function(){
    $('#submit').click(save);

    //Sempre que carregar a página atualiza a lista
    updateList();

    $('#rotas-sel').change(function() {
        var select = $(this).val();
        var rotaSelecionada = parseInt(select) + 1;
    });

    $('#btn-buscar').click(function(e) {
        e.preventDefault(); // Impede o comportamento padrão do link
    
        var rotaSelecionada = $('#sel-linha').val();
        var select = $(this).val();
        var rotaSelecionada = parseInt(select) + 1;
        var url = 'rotas.html?opc=' + rotaSelecionada;
        window.location.href = url;
      });
});

function save(){

    //envia para o backend
    $.ajax(URL_BASE+"rota",{

    }).done(function(res) {
        console.log(res);
        //atualiza a lista após salvar
        updateList();
    })
    .fail(function(res) {
        console.log(res);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const btnFavoritar = document.getElementById('btn-favoritar');
  
    btnFavoritar.addEventListener('click', function() {
      const linhaSelecionada = document.getElementById('sel-linha').value;
      const diaSelecionado = document.getElementById('sel-dia').value;
      const informacaoFavoritada = `Linha: ${linhaSelecionada}, Dia: ${diaSelecionado}`;
  
      // Salvar a informação no localStorage
      localStorage.setItem('informacaoFavoritada', informacaoFavoritada);
  
      // Redirecionar para a outra página
      window.location.href = 'index.html';
    });
  });
  
