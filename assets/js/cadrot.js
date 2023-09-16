var URL_BASE = "http://localhost:8080/";
var URL_EDIT = null;

$(function(){
    $('#rota_submit').click(save);
    
    updateList();
});

function save(){
    //captura os dados do form, já colocando como um JSON
    dados = $('#nomeRota').serializeJSON();
    
    // console.log(dados);
        //caso esteja editando
        if (URL_EDIT != null) {
            //envia para a url do objeto
            url = URL_EDIT;
            method = "PATCH";
        } else {
            //caso contrário, envia para a url de salvar
            url = URL_BASE + "rota";
            method = "POST";
        }
        //envia para o backend
        $.ajax(url,{
            data:JSON.stringify(dados),
            method:method,
            contentType: "application/json",
        }).done(function(res) {
            // console.log(res);
    
            URL_EDIT = res._links.self.href;
            //atualiza a lista após salvar
            updateList();
        })
        .fail(function(res) {
            // console.log(res);
        });
}

function updateList(){ 

    $.ajax(URL_BASE+"rota",{
        method:'get',
    }).done(function(res) {

        let table = $('#rotaContent');
        table.html("");
        $(res._embedded.rota).each(function(k,el){
            let rota = el;
            // console.log(rota._links);
            tr = $(`<tr><td>${rota.nomeRota}</td>
            <td>
                <a href="#" onclick="edit('${rota._links.self.href}')"><i class="bi bi-pencil-square"></i></a>
            </td>

            <td><a href="#" onclick="del('${rota._links.self.href}')"><i class="bx bx-trash"></i></a></td>
            </tr>`);
            // console.log(rotaContent);
            table.append(tr);
        })
    })
    .fail(function(res) {
        let table = $('#rotaContent');
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
        $('#nomeRota').val(res.nomeRota);
        
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