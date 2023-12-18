var URL_BASE = "http://localhost:8080/";
var URL_EDIT = null;
var informacao = "";
var authToken = localStorage.getItem("authToken");

$(function () {
	$("#bus_submit").click(save);
	selectList();
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
	dados = $(
		"#numOnibus,#horaSaida,#horaChegada,#valorLinha,#acessibilidade,#week,#rota_id"
	).serializeJSON();

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
	$.ajax(URL_BASE + "onibus", {
		method: "get",
	})
		.done(function (res) {
			let table = $("#busContent");
			table.html("");
			$(res._embedded.onibus).each(function (k, el) {
				let onibus = el;
				extractIdFromLink(onibus._links.rota.href).then((resultado) => {
					rotaId = resultado;
					informacao += `<p>Numero do Onibus: ${onibus.numOnibus}</p>`;
					tr =
						$(`<tr><td>${rotaId}</td><td>${onibus.numOnibus}</td><td>${onibus.horaSaida}</td><td>${onibus.horaChegada}</td><td>${onibus.valorLinha}</td>
            <td>
                <a href="#" onclick="edit('${onibus._links.self.href}')"><i class="bi bi-pencil-square"></i></a>
            </td>

            <td><a href="#" onclick="del('${onibus._links.self.href}')"><i class="bx bx-trash"></i></a></td>
            </tr>`);
					table.append(tr);
				});
			});
		})
		.fail(function (res) {
			let table = $("#tableContent");
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
		$("#numOnibus").val(res.numOnibus);
		$("#horaSaida").val(res.horaSaida);
		$("#horaChegada").val(res.horaChegada);
		$("#valorLinha").val(res.valorLinha);
		$("#acessibilidade").val(res.acessibilidade);
		$("#week").val(res.week);
		// $("#rota_id").val(res.rota_id);
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
function selectList() {
	$.ajax(URL_BASE + "rota/", {
		method: "get",
	})
		.done(function (res) {
			let select = $("#rota_id");
			select.html("");
			$(res).each(function (index, el) {
				let rota = el;
				let option = $("<option></option>")
					.attr("value", rota.id)
					.text(rota.nomeRota);
				select.append(option);
			});
		})
		.fail(function (res) {
			let select = $("#rota_id");
			select.html("");
			let option = $("<option></option>").text(
				"Não foi possível carregar as opções"
			);
			select.append(option);
		});
}

// Função para extrair o ID da rota de um link
function extractIdFromLink(link) {
	return new Promise((resolve, reject) => {
		if (link != null) {
			$.ajax(link, {
				method: "get",
			})
				.done(function (res) {
					let id_rota = res._links.rota.href;

					const match = id_rota.match(/\/rota\/(\d+)\/?$/);
					let resultado = match ? match[1] : null;

					resolve(resultado);
				})
				.fail(function (res) {
					reject("Erro na requisição AJAX");
				});
		} else {
			reject("Link é nulo");
		}
	});
}
