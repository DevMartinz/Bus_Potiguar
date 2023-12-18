var URL_BASE = "http://localhost:8080/";
var URL_EDIT = null;
var informacao = "";
var authToken = localStorage.getItem("authToken");

$(function () {
	$("#rota_submit").click(save);

	updateList();
});

//ao carregar a pagina, verifica se ja esta logado
window.addEventListener("load", () => {
	if (localStorage.getItem("gauth-token") != undefined) {
		//se houver um token salvo
		cred = jwtDecode(localStorage.getItem("gauth-token"));
		//descriptografa e mostra o usuario logado
		setLoginStatus(cred);
		checkUserExists(cred.sub).then(function (user) {
			// Se o usuário existe, você pode executar qualquer ação adicional que desejar aqui
			if (user.nivel === 1) {
				var url = "../index.html";
				window.location.href = url;
			} else {
			}
		});
	} else {
		var url = "../index.html";
		window.location.href = url;
	}
});

function save() {
	//captura os dados do form, já colocando como um JSON
	dados = $("#nomeRota").serializeJSON();

	//caso esteja editando
	if (URL_EDIT != null) {
		//envia para a url do objeto
		url = URL_EDIT;
		method = "PATCH";
	} else {
		//caso contrário, envia para a URL de criação de nova rota
		url = URL_BASE + "rota";
		method = "POST";
	}
	//envia para o backend
	$.ajax(url, {
		data: JSON.stringify(dados),
		method: method,
		contentType: "application/json",
		headers: {
			Authorization: "Bearer " + authToken,
		},
	})
		.done(function (res) {
			URL_EDIT = null;
			//atualiza a lista após salvar
			updateList();
		})
		.fail(function (res) {});

	return false;
}

function updateList() {
	$.ajax(URL_BASE + "rota", {
		method: "get",
	})
		.done(function (res) {
			let table = $("#rotaContent");
			table.html("");
			$(res._embedded.rota).each(function (k, el) {
				let rota = el;
				informacao += `<p>Nome da Rota: ${rota.nomeRota}</p>`;
				tr = $(`<tr><td>${rota.nomeRota}</td>
            <td>
                <a href="#" onclick="edit('${rota._links.self.href}')"><i class="bi bi-pencil-square"></i></a>
            </td>

            <td><a href="#" onclick="del('${rota._links.self.href}')"><i class="bx bx-trash"></i></a></td>
            </tr>`);
				table.append(tr);
			});
		})
		.fail(function (res) {
			let table = $("#rotaContent");
			table.html("");
			tr = $(`<tr><td colspan='4'>Não foi possível carregar a lista</td></tr>`);
			table.append(tr);
		});
}
function edit(url) {
	//Primeiro solicita as informações da pessoa ao backend
	$.ajax(url, {
		method: "get",
	}).done(function (res) {
		/*$.each(res,function(k, el){
            $('#'+k).val(el);
        });*/
		$("#nomeRota").val(res.nomeRota);
	});
	//salva a url do objeto que estou editando
	URL_EDIT = url;
}
function del(url) {
	if (confirm("Deseja realmente deletar esse registro?")) {
		//envia para o backend
		$.ajax(url, {
			method: "delete",
			headers: {
				Authorization: "Bearer " + authToken,
			},
		})
			.done(function (res) {
				//atualiza a lista após salvar
				updateList();
			})
			.fail(function (res) {});
	}
}
