var URL_BASE = "http://localhost:8080/";
let btnDarkModeToggle = document.getElementById("btn-dark-mode-toggle");
let themeSystem = localStorage.getItem("themeSystem") || "light";
var gauthToken = localStorage.getItem("gauth-token");

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
	if (gauthToken !== null && gauthToken !== undefined) {
		document.getElementById("trash").style.display = "";
	} else {
		document.getElementById("trash").style.display = "none";
	}
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
			h2.text(res.nomeRota); // Atualiza o texto do <h2> com o nome da Rota
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
				tr = $(
					`<tr><td>${parada.paradaNome}</td><td>${parada.posicao}</td></tr>`
				);
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

$("#fav").click(function (e) {
	e.preventDefault(); // Impede o comportamento padrão do link
	const opcValue = getParamFromURL();
	var url = "favoritos.html?opc=" + opcValue;
	window.location.href = url;
});

btnDarkModeToggle.addEventListener("click", () => {
	let oldTheme = localStorage.getItem("themeSystem") || "light";
	let newTheme = oldTheme == "light" ? "dark" : "light";

	localStorage.setItem("themeSystem", newTheme);
	defineCurrentTheme(newTheme);
});

function defineCurrentTheme(theme) {
	const darkSvg =
		"<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-moon-stars' viewBox='0 0 16 16'><path d='M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z'/><path d='M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z'/></svg>";
	const lightSvg =
		"<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-sun' viewBox='0 0 16 16'><path d='M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z'/></svg>";
	document.documentElement.setAttribute("data-theme", theme);
	if (theme == "light") {
		btnDarkModeToggle.innerHTML = darkSvg;
	} else {
		btnDarkModeToggle.innerHTML = lightSvg;
	}
}

defineCurrentTheme(themeSystem);

$(".increaseFont,.decreaseFont").click(function () {
	var type = $(this).val();
	var h2 = $("h2").css("font-size");

	if (type == "increase") {
		$("h2").css("font-size", parseInt(h2) + 1);
	} else {
		$("h2").css("font-size", parseInt(h2) - 1);
	}
	// alert($('.data').css('font-size'));
});

//decodifica o jwt
function jwtDecode(token) {
	var base64Url = token.split(".")[1];
	var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	var jsonPayload = decodeURIComponent(
		window
			.atob(base64)
			.split("")
			.map(function (c) {
				return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join("")
	);

	return JSON.parse(jsonPayload);
}

$("#trash").click(function (e) {
	e.preventDefault(); // Impede o comportamento padrão do link

	cred = jwtDecode(gauthToken);
	const opcValue = getParamFromURL();

	checkUserExists(cred.sub).then(function (user) {
		// Se o usuário existe, você pode executar qualquer ação adicional que desejar aqui

		$.ajax(URL_BASE + "remover-favorito/" + user.id + "/" + opcValue, {
			method: "PUT",
			contentType: "application/json",
		})
			.done(function (res) {
				var url = "../favoritos.html";
				window.location.href = url;
			})
			.fail(function (res) {});
	});
});

function checkUserExists(idGoogle) {
	// Retornar uma Promise que será resolvida ou rejeitada
	return new Promise((resolve, reject) => {
		// Fazer uma requisição GET para obter todos os usuários do servidor
		$.ajax(URL_BASE + "usuario/", {
			method: "get",
			contentType: "application/json",
		})
			.done(function (res) {
				// Verificar se a resposta é um objeto (usuário único) ou uma lista (múltiplos usuários)
				const userArray = Array.isArray(res) ? res : [res];

				// Encontrar o usuário com o idGoogle correspondente
				const foundUser = userArray.find((user) => user.idGoogle === idGoogle);

				if (foundUser) {
					resolve(foundUser); // Resolve a Promise com o usuário encontrado
				} else {
					reject(new Error("Usuário não encontrado"));
				}
			})
			.fail(function (res) {
				reject(
					new Error(
						"Erro ao verificar a existência do usuário no banco de dados"
					)
				);
			});
	});
}
