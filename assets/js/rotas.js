var URL_BASE = "http://localhost:8080/";

$(function(){
    //Sempre que carregar a página atualiza a lista
    selectList();
    $('#rotas-sel').change(function() {
        var select = $(this).val();
        console.log(select);
        var rotaSelecionada = parseInt(select) + 1;
        console.log(rotaSelecionada);
        updateList(rotaSelecionada);
        horarioList(select);
    });
});

function updateList(rotaSelecionada){ 
    $.ajax(URL_BASE+"rota/" + rotaSelecionada + "/paradas", {
        method:'get',
    }).done(function(res) {
        console.log(res._embedded.paradaNome);
        let table = $('#tableContent');
        table.html("");
        $(res._embedded.parada).each(function(k,el){
            let parada = el;
            tr = $(`<tr><td>${parada.paradaNome}</td></tr>`);
            console.log(tableContent);
            table.append(tr);
        })
    })
    .fail(function(res) {
        let table = $('#tableContent');
        table.html("");
        tr = $(`<tr><td colspan='4'>Não foi possível carregar a lista</td></tr>`);
        table.append(tr);
    });
}

function selectList(){
    $.ajax(URL_BASE+"rota",{
        method:'get',
    }).done(function(res) {
        console.log(res._embedded.rota);
        let select = $('#rotas-sel');
        console.log(res);
        select.html("");
        $(res._embedded.rota).each(function(index, el){
            let rota = el;
            console.log(rota);
            console.log(index);
            let option =  $('<option></option>').attr('value', index).text(rota.nomeRota);
            select.append(option);
        })
    })
    .fail(function(res) {
        let select = $('#rotas-sel');
        select.html("");
        let option = $('<option></option>').text('Não foi possível carregar as opções');
        select.append(option);
    });
}

function horarioList(select){
    $.ajax(URL_BASE+"rota", {
        method:'get',
    }).done(function(res) {
        
        let table = $('#horario_table');
        table.html("");
        let rota = res._embedded.rota[select];
        console.log(rota);
        tr = $(`<tr><td>${rota.horaSaida}</td><td>${rota.horaChegada}</td></tr>`);
        console.log(tableContent);
        table.append(tr);
    })
    .fail(function(res) {
        let table = $('#horario_table');
        table.html("");
        tr = $(`<tr><td colspan='4'>Não foi possível carregar a lista</td></tr>`);
        table.append(tr);
    });
}
