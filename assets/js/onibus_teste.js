var URL_BASE = "http://localhost:8080/"

function updateList(){

    $.ajax(URL_BASE+"onibus",{
        method:'get',
    }).done(function(res) {

        console.log(res._embedded.onibus);

        let select = $('#sel-linha');
        select.html("");

        $(res._embedded.onibus).each(function(k,el){
            let onibus = el;
            let option =  $('<option></option>').attr('value', onibus.numOnibus).text(onibus.numOnibus);
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
});

function save(){

    //envia para o backend
    $.ajax(URL_BASE+"onibus",{

    }).done(function(res) {
        console.log(res);
        //atualiza a lista após salvar
        updateList();
    })
    .fail(function(res) {
        console.log(res);
    });
}
