var URL_BASE = "http://localhost:8080/";
var URL_EDIT = null;

$(function(){
    $('#bus_submit').click(save);
    selectList();
    updateList();
});

function save(){
    //captura os dados do form, já colocando como um JSON
    dados = $('#numOnibus,#horaSaida,#horaChegada,#valorLinha,#acessibilidade,#week,#rota_id').serializeJSON();
    
    // console.log(dados);
        //caso esteja editando
        if (URL_EDIT != null) {
            //envia para a url do objeto
            url = URL_EDIT;
            method = "PATCH";
        } else {
            //caso contrário, envia para a url de salvar
            url = URL_BASE + "onibus/";
            method = "POST";
        }
        //envia para o backend
        $.ajax(url,{
            data:JSON.stringify(dados),
            method:method,
            contentType: "application/json",
        }).done(function(res) {
            // console.log(res);
    
            URL_EDIT = "http://20.96.161.7/" + res.id;
            //atualiza a lista após salvar
            updateList();
        })
        .fail(function(res) {
            // console.log(res);
        });
}

function updateList(){ 

    $.ajax(URL_BASE+"onibus",{
        method:'get',
    }).done(function(res) {

        let table = $('#busContent');
        table.html("");
        $(res._embedded.onibus).each(function(k,el){
            let onibus = el;
            // console.log(onibus._links);
            tr = $(`<tr><td>${onibus.numOnibus}</td><td>${onibus.horaSaida}</td><td>${onibus.horaChegada}</td><td>${onibus.valorLinha}</td>
            <td>
                <a href="#" onclick="edit('${onibus._links.self.href}')"><i class="bi bi-pencil-square"></i></a>
            </td>

            <td><a href="#" onclick="del('${onibus._links.self.href}')"><i class="bx bx-trash"></i></a></td>
            </tr>`);
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
function edit(url){
    //Primeiro solicita as informações da pessoa ao backend
    $.ajax(url,{
        method:'get',
    }).done(function(res) {

        /*$.each(res,function(k, el){
            $('#'+k).val(el);
        });*/
        $('#numOnibus').val(res.numOnibus);
        $('#horaSaida').val(res.horaSaida);
        $('#horaChegada').val(res.horaChegada);
        $('#valorLinha').val(res.valorLinha);
        $('#acessibilidade').val(res.acessibilidade);
        $('#week').val(res.week);
    });
    //salva a url do objeto que estou editando
    URL_EDIT = url;
}
function del(url){
    if (confirm("Deseja realmente deletar esse registro?")){
        //envia para o backend
        $.ajax(url,{
            method:'delete',
        }).done(function(res) {
            //atualiza a lista após salvar
            updateList();
        })
        .fail(function(res) {
            // console.log(res);
        });
    }
}
function selectList(){
    $.ajax(URL_BASE+"rota/",{
        method:'get',
    }).done(function(res) {
        // console.log(res);
        let select = $('#rota_id');
        // console.log(res);
        select.html("");
        $(res).each(function(index, el){
            let rota = el;
            // console.log(rota);
            // console.log(index);
            let option =  $('<option></option>').attr('value', rota.id).text(rota.nomeRota);
            select.append(option);
        })
    })
    .fail(function(res) {
        let select = $('#rota_id');
        select.html("");
        let option = $('<option></option>').text('Não foi possível carregar as opções');
        select.append(option);
    });
}
