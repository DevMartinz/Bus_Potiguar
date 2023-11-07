var URL_BASE = "http://localhost:8080/";
var URL_EDIT = null;
var informacao = "";

$(function () {
	$("#paradas_submit").click(save);
	selectList();
	updateList();
});

function save() {
	//captura os dados do form, já colocando como um JSON
	dados = $("#paradaNome,#posicao,#rota_id").serializeJSON();

	// console.log(dados);
	//caso esteja editando
	if (URL_EDIT != null) {
		//envia para a url do objeto
		url = URL_EDIT;
		method = "PATCH";
	} else {
		//caso contrário, envia para a url de salvar
		url = URL_BASE + "parada/";
		method = "POST";
	}
	//envia para o backend
	$.ajax(url, {
		data: JSON.stringify(dados),
		method: method,
		contentType: "application/json",
	})
		.done(function (res) {
			// console.log(res);

			URL_EDIT = null;
			//atualiza a lista após salvar
			updateList();
		})
		.fail(function (res) {
			// console.log(res);
		});

	return false;
}

function updateList() {
	$.ajax(URL_BASE + "parada", {
		method: "get",
	})
		.done(function (res) {
			let table = $("#paradaContent");
			table.html("");
			$(res._embedded.parada).each(function (k, el) {
				let parada = el;
                informacao += `<p>Nome da PArada: ${parada.paradaNome}</p>`;
				// console.log(parada._links);
				tr = $(`<tr><td>${parada.paradaNome}</td><td>${parada.posicao}</td>
            <td>
                <a href="#" onclick="edit('${parada._links.self.href}')"><i class="bi bi-pencil-square"></i></a>
            </td>

            <td><a href="#" onclick="del('${parada._links.self.href}')"><i class="bx bx-trash"></i></a></td>
            </tr>`);
				// console.log(paradaContent);
				table.append(tr);
			});
		})
		.fail(function (res) {
			let table = $("#paradaContent");
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
		$("#paradaNome").val(res.paradaNome);
		$("#posicao").val(res.posicao);
	});
	//salva a url do objeto que estou editando
	URL_EDIT = url;
}
function del(url) {
	if (confirm("Deseja realmente deletar esse registro?")) {
		//envia para o backend
		$.ajax(url, {
			method: "delete",
		})
			.done(function (res) {
				//atualiza a lista após salvar
				updateList();
			})
			.fail(function (res) {
				// console.log(res);
			});
	}
}
function selectList() {
	$.ajax(URL_BASE + "rota/", {
		method: "get",
	})
		.done(function (res) {
			// console.log(res);
			let select = $("#rota_id");
			// console.log(res);
			select.html("");
			$(res).each(function (index, el) {
				let rota = el;
				// console.log(rota);
				// console.log(index);
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
