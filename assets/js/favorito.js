var URL_BASE = "http://localhost:8080/";

// Função para obter o valor do parâmetro "opc" da URL
function getParamFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	const opcValuetest = urlParams.get("opc");
	const opcValue = parseInt(opcValuetest);
	return opcValue;
}

// Função para obter o valor do parâmetro "sel" da URL
function getSelFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	const opcValueSel = urlParams.get("sel");
	const selValue = parseInt(opcValueSel);
	return selValue;
}

$(function () {
	//Sempre que carregar a página atualiza a lista
	//selectList();
	const opcValue = getParamFromURL();
	const selValue = getSelFromURL();
	const stropcValue = opcValue.toString();
	const strselValue = selValue.toString();

	updateList(opcValue);
	horarioList(stropcValue, strselValue);

	$.ajax(URL_BASE + "rota/" + opcValue, {
		method: "get",
	})
		.done(function (res) {
			let h2 = $("#titulo_rotas");
			h2.text("Rota " + res.nomeRota); // Atualiza o texto do <h2> com o nome da Rota
		})
		.fail(function (res) {
			let h2 = $("#titulo_rotas");
			h2.text("Nome da Rota não encontrado"); // Caso não seja possível obter o nome da Rota
		});
});

function updateList(rotaSelecionada) {
	$.ajax(URL_BASE + "rota/" + rotaSelecionada + "/paradas", {
		method: "get",
	})
		.done(function (res) {
			let table = $("#tableContent");
			table.html("");
			$(res._embedded.parada).each(function (k, el) {
				let parada = el;
				tr = $(`<tr><td>${parada.paradaNome}</td></tr>`);
				table.append(tr);
			});
		})
		.fail(function (res) {
			let table = $("#tableContent");
			table.html("");
			tr = $(`<tr><td colspan='4'>Não foi possível carregar a lista</td></tr>`);
			table.append(tr);
		});
}

function selectList() {
	$.ajax(URL_BASE + "rota", {
		method: "get",
	})
		.done(function (res) {
			let select = $("#rotas-sel");
			select.html("");
			$(res._embedded.rota).each(function (index, el) {
				let rota = el;
				let option = $("<option></option>")
					.attr("value", index)
					.text(rota.nomeRota);
				select.append(option);
			});
		})
		.fail(function (res) {
			let select = $("#rotas-sel");
			select.html("");
			let option = $("<option></option>").text(
				"Não foi possível carregar as opções"
			);
			select.append(option);
		});
}

function horarioList(select, test) {
	$.ajax(URL_BASE + "rota/" + select + "/onibus", {
		method: "get",
	})
		.done(function (res) {
			// http://20.96.161.7/rota/1/onibus

			let table = $("#horario_table");
			table.html("");

			// Percorre todos os ônibus retornados na resposta
			res._embedded.onibus.forEach(function (onibus) {
				if (onibus.week.toString() === test) {
					let tr = $(
						`<tr><td>${onibus.numOnibus}</td><td>${onibus.horaSaida}</td><td>${onibus.horaChegada}</td><td>${onibus.acessibilidade}</td><td>${onibus.valorLinha}</td></tr>`
					);
					table.append(tr);
				}
			});
		})
		.fail(function (res) {
			let table = $("#horario_table");
			table.html("");
			tr = $(`<tr><td colspan='4'>Não foi possível carregar a lista</td></tr>`);
			table.append(tr);
		});
}
