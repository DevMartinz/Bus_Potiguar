var URL_BASE = "http://localhost:8080/"

$(function(){
    //Sempre que carregar a página atualiza a lista
    updateList();
});

function updateList(){ 

    $.ajax(URL_BASE+"onibus",{
        method:'get',
    }).done(function(res) {

        let table = $('#tableContent');
        table.html("");
        $(res._embedded.onibus).each(function(k,el){
            let onibus = el;
            tr = $(`<tr><td>${onibus.numOnibus}</td><td>${onibus.horaSaida}</td><td>${onibus.horaChegada}</td><td>${onibus.valorLinha}</td><td>${onibus.acessibilidade}</td></tr>`);
            // console.log(tableContent);
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



  



  
