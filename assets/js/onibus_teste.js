var URL_BASE = "http://20.15.106.172:8080/"

function updateList(){

    $.ajax(URL_BASE+"rota/",{
        method:'get',
    }).done(function(res) {

        console.log(res);

        let select = $('#sel-linha');
        select.html("");

        $(res).each(function(index,el){
            let rota = el;
            let option =  $('<option></option>').attr('value', rota.id).text(rota.nomeRota);
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

    $('#sel-linha').change(function() {
        var select = $(this).val();
        var rotaSelecionada = parseInt(select) + 1;
    });

    $('#btn-buscar').click(function(e) {
        e.preventDefault(); // Impede o comportamento padrão do link

        var select = $('#sel-linha').val();
        var test = $('#sel-dia').val();
        var url = 'rotas.html?opc=' + select + '&test=' + test;
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
