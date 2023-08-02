var URL_BASE = "http://20.96.161.7/"

//decodifica o jwt
function jwtDecode (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Função para verificar se o usuário já existe com base no idGoogle
function checkUserExists(idGoogle) {
    // Retornar uma Promise que será resolvida ou rejeitada
    return new Promise((resolve, reject) => {
        // Fazer uma requisição GET para obter todos os usuários do servidor
        $.ajax(URL_BASE + "usuario/", {
            method: 'get',
            contentType: "application/json",
        })
        .done(function(res) {
            // Verificar se a resposta é um objeto (usuário único) ou uma lista (múltiplos usuários)
            if (Array.isArray(res)) {
                // Se for uma lista, percorrer os usuários para encontrar o usuário com o idGoogle correspondente
                const foundUser = res.find(user => user.idGoogle === idGoogle);
                if (foundUser) {
                    resolve(foundUser); // Resolve a Promise com o usuário encontrado
                    // console.log("Usuario encontrado array");
                } else {
                    reject(new Error("Usuário não encontrado"));
                    // console.log("Usuario não encontrado");
                }
            } else {
                // Se for um objeto (usuário único), verificar diretamente o idGoogle
                if (res.idGoogle === idGoogle) {
                    // console.log("Usuario encontrado objeto");
                    resolve(res); // Resolve a Promise com o usuário encontrado
                } else {
                    // console.log("Usuario não encontrado");
                    reject(new Error("Usuário não encontrado"));
                }
            }
        })
        .fail(function(res) {
            reject(new Error("Erro ao verificar a existência do usuário no banco de dados"));
        });
    });
}

// Função para criar um novo usuário no banco de dados
function createUser(email, name, idGoogle) {
    return $.ajax(URL_BASE + "usuario", {
        method: 'post',
        data: JSON.stringify({ 
            email: email, 
            nomeUser: name,
            idGoogle: idGoogle
        }),
        contentType: "application/json",
    });
}



//essa é a funcao que o google irá chamar quando um usuario se autenticar
function loginCallback(resp){
    cred = jwtDecode(resp.credential);
    //aqui voce podera ver todas as informacoes que o google retorna
    // console.log(cred);
    //salva o token inteiro, pois só é possível salvar strings no localStorage
    //cuidado, esse token é mutavel, não pode ser usado como chave no banco
    localStorage.setItem("gauth-token", resp.credential);
    setLoginStatus(cred);
    id_int = parseInt(cred.sub);
     
 // Verifica se o usuário já existe com base no idGoogle
    checkUserExists(cred.sub)
    .then(function(user) {
            // Se o usuário existe, você pode executar qualquer ação adicional que desejar aqui
            // console.log('Usuário já existe no banco de dados:', user);
            if (user.nivel === 100){
                // console.log("Usuario é ADM");
                botao = `
                <hr/>
                <a href="#" id="btn02" class="btn btn-info" onclick="gerenciarRotas()">Gerenciar Rotas</a>
                <a href="#" id="btn03" class="btn btn-primary" onclick="gerenciarOnibus()">Gerenciar Ônibus</a>
                <a href="#" id="btn04" class="btn btn-success" onclick="gerenciarParadas()">Gerenciar Paradas</a>
                `
                document.querySelector("#botao").innerHTML = botao;
            }else{
                // console.log("Usuario NAO E ADM");

                const urlParams = new URLSearchParams(window.location.search);
                const opcValuetest = urlParams.get('opc');
                const opcValue = parseInt(opcValuetest);
                if (opcValue){
                $.ajax(URL_BASE + "adicionar-favorito/" + user.id + "/" + opcValue, {
                    method: 'PUT',
                    data: JSON.stringify({ 
                    }),
                    contentType: "application/json",
                });
            }
            
                document.getElementById("g_id_logado").style.display = "block";
            }
            })
        .catch(function(error) {
            // Se o usuário não existe, crie um novo registro
            createUser(cred.email, cred.name, cred.sub)
                .done(function(res) {
                    // console.log('ID do usuário salvo no banco de dados:', res);
                })
                .fail(function(res) {
                    console.error('Erro ao salvar a ID do usuário no banco de dados:', res);
                });
        });
    }

function setLoginStatus(cred){
  // Esconde a tela de pré-login
  document.getElementById("tela-pre-login").style.display = "none";

  // Exibe a tela de pós-login
  //document.getElementById("g_id_logado").style.display = "block";
    // console.log(cred);
    //esconde o botao de login do google
    document.querySelector(".g_id_signin").style.display = 'none';
    //mostra o usuario logado
    html = `<div class='g_login' id="logoutDiv">
                <img class='g_pic' src="${cred.picture}">
                <span><div class='g_name'>${cred.given_name} ${cred.family_name}</div><div class='g_email'>${cred.email}</div></span>
                <a href='#'  onclick="logout()"'>Logout</a>
            </div>`
    document.querySelector(".g_id_logado").innerHTML = html;
}

//ao carregar a pagina, verifica se ja esta logado
window.addEventListener("load",() => {
    if (localStorage.getItem("gauth-token") != undefined){
        //se houver um token salvo
        cred = jwtDecode(localStorage.getItem("gauth-token"));
        //descriptografa e mostra o usuario logado
        setLoginStatus(cred);
    }
});

function gerenciarRotas(){
    informacao = `
                <hr/>
                <div class="container card col-sm-4 text-start">
                <form id="form">
                    <div class="col-sm p-1">
                        <label for="nomeRota" class="form-label">Nome da Rota</label>
                        <input type="text" class="form-control" id="nomeRota" name="nomeRota" placeholder=""/>
                    </div>
                    
                </form>
                <div class="row p-3">
                    <button id="rota_submit" class="btn btn-primary col-sm-6">Salvar</button>
                </div>
            </div>
            <hr/>
            <table class="table">
            <thead class="thead-dark">
              <tr>
                  <th scope="col">Nome da Rota</th>
                  <th scope="col"></th>
                  <th scope="col"></th>
              </tr>
            </thead>
              <tbody id="rotaContent">
              </tbody>
          </table>
                `
                var scriptElement = document.createElement("script");
                scriptElement.src = "assets/js/cadrot.js";

                document.body.appendChild(scriptElement);

                document.querySelector("#informacao").innerHTML = informacao;
}

function gerenciarOnibus(){
    informacao = `
    <hr/>
    <div class="container card col-sm-4 text-start">
    <form id="form">
        <div class="col-sm p-1">
            <label for="numOnibus" class="form-label">Número do ônibus</label>
            <input type="text" class="form-control" id="numOnibus" name="numOnibus" placeholder=""/>
        </div>
        <div class="col-sm p-1">
            <label for="horaSaida" class="form-label">Embarque</label>
            <input type="text" class="form-control" id="horaSaida" name="horaSaida" placeholder=""/>
        </div>
        <div class="col-sm p-1">
            <label for="horaChegada" class="form-label">Desembarque</label>
            <input type="text" class="form-control" id="horaChegada" name="horaChegada" placeholder=""/>
        </div>
        <div class="col-sm p-1">
            <label for="valorLinha" class="form-label">Valor</label>
            <input type="text" class="form-control" id="valorLinha" name="valorLinha" placeholder=""/>
        </div>
        <div class="col-sm p-1">
            <label for="acessibilidade" class="form-label">Acessibilidade</label>
            <input type="text" class="form-control" id="acessibilidade" name="acessibilidade" placeholder=""/>
        </div>
        <div class="col-sm p-1">
            <label for="week" class="form-label">Disponibilidade</label>
            <input type="text" class="form-control" id="week" name="week" placeholder=""/>
        </div>
        <div class="col-sm p-1">
          <label for="rota_id" style=" margin-top: 1.8%;">Escolha uma Linha:</label>
          <select id="rota_id" name="rota_id">
          </select>
        </div>
    </form>
    <div class="row p-3">
        <button id="bus_submit" class="btn btn-primary col-sm-6">Salvar</button>
    </div>
</div>
<hr/>
        <table class="table">
            <thead class="thead-dark">
              <tr>
                  <th scope="col">Número</th>
                  <th scope="col">Hora da Saida</th>
                  <th scope="col">Hora da Chegada</th>
                  <th scope="col">Valor da Rota</th>
                  <th scope="col"></th>
                  <th scope="col"></th>
              </tr>
            </thead>
              <tbody id="busContent">
              </tbody>
          </table>
    `

    var scriptElement = document.createElement("script");
    scriptElement.src = "assets/js/cadbus.js";

    document.body.appendChild(scriptElement);

    document.querySelector("#informacao").innerHTML = informacao;
}

function gerenciarParadas(){
    informacao = `
                <hr/>
                <div class="container card col-sm-4 text-start">
                <form id="form">
                    <div class="col-sm p-1">
                        <label for="paradaNome" class="form-label">Nome da Parada</label>
                        <input type="text" class="form-control" id="paradaNome" name="paradaNome" placeholder=""/>
                    </div>
                    <div class="col-sm p-1">
                        <label for="posicao" class="form-label">Posição da Parada</label>
                        <input type="text" class="form-control" id="posicao" name="posicao" placeholder=""/>
                    </div>
                    <div class="col-sm p-1">
                        <label for="rota_id" style=" margin-top: 1.8%;">Escolha uma Linha:</label>
                        <select id="rota_id" name="rota_id">
                        </select>
                    </div>
                </form>
                <div class="row p-3">
                    <button id="paradas_submit" class="btn btn-primary col-sm-6">Salvar</button>
                </div>
            </div>
            <hr/>
            <table class="table">
            <thead class="thead-dark">
              <tr>
                  <th scope="col">Nome da Rota</th>
                  <th scope="col"></th>
                  <th scope="col"></th>
              </tr>
            </thead>
              <tbody id="paradaContent">
              </tbody>
          </table>
                `
                var scriptElement = document.createElement("script");
                scriptElement.src = "assets/js/cadparada.js";
            
                document.body.appendChild(scriptElement);
                document.querySelector("#informacao").innerHTML = informacao;
}

function logout() {
    // Limpa o token do localStorage
    localStorage.removeItem("gauth-token");
  
    // Esconde a tela de pós-login
    document.getElementById("g_id_logado").style.display = "none";
  
    // Oculta a div de logout usando o ID
    document.getElementById("logoutDiv").style.display = "none";
  
    // Exibe a tela de pré-login novamente
    document.getElementById("tela-pre-login").style.display = "block";
  
    // Exibe o botão de login do Google novamente
    document.querySelector(".g_id_signin").style.display = "block";

    location.reload();
  }

