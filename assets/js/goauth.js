var URL_BASE = "http://localhost:8080/";
const btnDarkModeToggle = document.getElementById("btn-dark-mode-toggle");
const themeSystem = localStorage.getItem("themeSystem") || "light";
let userData = null;

$(document).ajaxError(function (event, jqxhr, settings, thrownError) {
	console.error("Ajax error:", thrownError);
});

//decodifica o jwt
function jwtDecode(token) {
	console.log("jwtDecode");
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

// Função para verificar se o usuário já existe com base no idGoogle
function checkUserExists(idGoogle) {
	// Retornar uma Promise que será resolvida ou rejeitada
	return new Promise((resolve, reject) => {
		// Fazer uma requisição GET para obter todos os usuários do servidor
		$.ajax(URL_BASE + "usuario/", {
			method: "get",
			contentType: "application/json",
		})
			.done(function (res) {
				console.log("API Response:", res);

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

// Função para criar um novo usuário no banco de dados
function createUser(email, name, idGoogle) {
	return $.ajax(URL_BASE + "usuario", {
		method: "post",
		data: JSON.stringify({
			email: email,
			nomeUser: name,
			idGoogle: idGoogle,
		}),
		contentType: "application/json",
	});
}

//essa é a funcao que o google irá chamar quando um usuario se autenticar
function loginCallback(resp) {
	console.log("loginCallback");
	cred = jwtDecode(resp.credential);
	//aqui voce podera ver todas as informacoes que o google retorna
	// console.log(cred);
	//salva o token inteiro, pois só é possível salvar strings no localStorage
	//cuidado, esse token é mutavel, não pode ser usado como chave no banco
	localStorage.setItem("gauth-token", resp.credential);
	setLoginStatus(cred);
	id_int = parseInt(cred.sub);
	// userData = id_int;

	// Verifica se o usuário já existe com base no idGoogle
	console.log("checkUserExists");
	checkUserExists(cred.sub)
		.then(function (user) {
			console.log("checkUserExists resolved. User:", user);
			// Se o usuário existe, você pode executar qualquer ação adicional que desejar aqui
			if (user.nivel === 100) {
				var url = "/auth/rotas.html";
				window.location.href = url;
			} else {
				if (user.nivel === 1) {
					const urlParams = new URLSearchParams(window.location.search);
					const opcValuetest = urlParams.get("opc");
					const opcValue = parseInt(opcValuetest);
					userData = user.id;
					console.log("teste:" + userData);
					if (opcValue) {
						console.log("entrou aqui");
						console.log(resp);

						// console.log(userId);

						// Certifique-se de que 'rotas' é um objeto válido
						$.ajax(URL_BASE + "usuario/" + userData + "/rotas", {
							method: "get",
							contentType: "application/json",
						}).done(function (res) {
							const rotasObject = res || {};
							console.log("Rotas object:", rotasObject);
							const userObject = user || {};
							console.log("User ID:", userObject);
							// console.log("User Object:", userObject);
							const userId = userObject.id;
							console.log("User ID:", userId);
							// // Verifica se a rota já foi adicionada aos favoritos pelo usuário
							console.log("Entrou no bloco onde userId é válido");
							const rotasArray =
								rotasObject._embedded && rotasObject._embedded.rota
									? rotasObject._embedded.rota
									: [];
							console.log("rotasArray: ", rotasArray);

							// let rotaId = rota._links.rota.href.split("/").pop();

							const rotaJaAdicionada = rotasArray.some(
								(rot) => rot._links.rota.href.split("/").pop() == opcValue
							);
							console.log("entrou aqui 3");
							console.log(rotaJaAdicionada);

							if (rotaJaAdicionada === false) {
								// Se a rota ainda não foi adicionada, faz a requisição para adicionar aos favoritos
								$.ajax(
									URL_BASE + "adicionar-favorito/" + userId + "/" + opcValue,
									{
										method: "PUT",
										data: JSON.stringify({}),
										contentType: "application/json",
									}
								)
									.done(function () {
										console.log("Elementos na Tela");
										document.getElementById("g_id_logado").style.display =
											"block";
										updateList();
									})
									.fail(function (res) {
										console.error("Erro ao adicionar favorito:", res);
									});
							} else {
								console.log("Rota já adicionada aos favoritos pelo usuário.");
								console.log("Elementos na Tela");
								document.getElementById("g_id_logado").style.display = "block";
								updateList();
							}
						});
					} else {
						console.log("Elseeeeee");
						console.log("Elementos na Tela");
						document.getElementById("g_id_logado").style.display = "block";
						updateList();
					}
				}
			}
		})
		.catch(function (error) {
			// Se o usuário não existe, crie um novo registro
			createUser(cred.email, cred.name, cred.sub)
				.done(function (res) {
					const urlParams = new URLSearchParams(window.location.search);
					const opcValuetest = urlParams.get("opc");
					const opcValue = parseInt(opcValuetest);

					// Extrai o ID do usuário da URL
					const userIdMatch = res._links.self.href.match(/\/(\d+)$/);
					if (userIdMatch && userIdMatch[1]) {
						userData = userIdMatch[1];
						console.log("teste:" + userData);

						if (opcValue) {
							$.ajax(
								URL_BASE + "adicionar-favorito/" + userData + "/" + opcValue,
								{
									method: "PUT",
									data: JSON.stringify({}),
									contentType: "application/json",
								}
							)
								.done(function () {
									console.log("Elementos na Tela");
									document.getElementById("g_id_logado").style.display =
										"block";
									updateList();
								})
								.fail(function (res) {
									console.error("Erro ao adicionar favorito:", res);
								});
						} else {
							console.log("Elementos na Tela");
							document.getElementById("g_id_logado").style.display = "block";
							updateList();
						}
					}
				})
				.fail(function (res) {
					console.error(
						"Erro ao salvar a ID do usuário no banco de dados:",
						res
					);
					console.log(res);
				});
		});
}

function setLoginStatus(cred) {
	console.log("setLoginStatus");
	// Esconde a tela de pré-login
	document.getElementById("tela-pre-login").style.display = "none";
	//esconde o botao de login do google
	document.querySelector(".g_id_signin").style.display = "none";
	//mostra o usuario logado
	html = `<div class='g_login' id="logoutDiv">
                <img class='g_pic' src="${cred.picture}">
                <span><div class='g_name'>${cred.given_name} ${cred.family_name}</div><div class='g_email'>${cred.email}</div></span>
                <a href='#'  onclick="logout()"'>Logout</a>
            </div>`;
	document.querySelector(".g_id_logado").innerHTML = html;
}

//ao carregar a pagina, verifica se ja esta logado
window.addEventListener("load", () => {
	if (localStorage.getItem("gauth-token") != undefined) {
		console.log("EventListenerLoad");
		//se houver um token salvo
		cred = jwtDecode(localStorage.getItem("gauth-token"));
		//descriptografa e mostra o usuario logado
		setLoginStatus(cred);
		checkUserExists(cred.sub).then(function (user) {
			// Se o usuário existe, você pode executar qualquer ação adicional que desejar aqui
			if (user.nivel === 100) {
				var url = "/auth/rotas.html";
				window.location.href = url;
			} else {
				userData = user.id;
				console.log("teste:" + userData);
				console.log("Elementos na Tela");
				document.getElementById("g_id_logado").style.display = "block";
				updateList(); // Mova a chamada para updateList() aqui
			}
		});
	}
});

function save() {
	//envia para o backend
	$.ajax(URL_BASE + "rota", {})
		.done(function (res) {
			console.log("eita: " + res);
			//atualiza a lista após salvar
			updateList();
		})
		.fail(function (res) {
			// console.log(res);
		});
}

function updateList() {
	// if (userData != null) {
	// Agora você pode acessar os dados do usuário em userData
	console.log("updateList");
	console.log("Usuário ID: " + userData);
	$.ajax(URL_BASE + "usuario/" + userData + "/rotas", {
		method: "get",
		contentType: "application/json",
	})
		.done(function (res) {
			console.log(res);
			console.log("Deu certo");

			let select = $("#sel-linha-fav");
			select.html("");

			if (res._embedded && res._embedded.rota) {
				res._embedded.rota.forEach(function (rota) {
					let rotaId = rota._links.rota.href.split("/").pop();
					console.log("Rota: ");
					console.log("ID:", rotaId); // Adicione este log para garantir que o ID está correto
					console.log("Nome:", rota.nomeRota);
					let option = $("<option></option>")
						.attr("value", rotaId)
						.text(rota.nomeRota);
					select.append(option);
				});
			} else {
				console.log("Nenhuma rota encontrada para o usuário.");
			}
		})
		.fail(function (error) {
			console.error("Erro na requisição:", error);
		});
}

$(function () {
	$("#submit").click(save);

	//Sempre que carregar a página atualiza a lista
	// updateList();

	$("#sel-linha-fav").change(function () {
		var select = $(this).val();
		console.log("Teste 1: " + select);
		var rotaSelecionada = parseInt(select) + 1;
	});

	$("#btn-buscar").click(function (e) {
		e.preventDefault(); // Impede o comportamento padrão do link

		var selectedRouteId = $("#sel-linha-fav").val();
		console.log("Teste 2: " + selectedRouteId);
		var selectedDay = $("#sel-dia").val();
		var url = "rotas.html?opc=" + selectedRouteId + "&test=" + selectedDay;
		window.location.href = url;
	});
});

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
	var information = $(".information").css("font-size");
	var h4 = $("h4").css("font-size");
	var p = $("p").css("font-size");
	var text = $("#text").css("font-size");
	var btnbuscar = $("#btn-buscar").css("font-size");

	if (type == "increase") {
		$(".information").css("font-size", parseInt(information) + 1);
		$("h4").css("font-size", parseInt(h4) + 1);
		$("p").css("font-size", parseInt(p) + 1);
		$("#text").css("font-size", parseInt(text) + 1);
		$("#btn-buscar").css("font-size", parseInt(btnbuscar) + 1);
	} else {
		$(".information").css("font-size", parseInt(information) - 1);
		$("h4").css("font-size", parseInt(h4) - 1);
		$("p").css("font-size", parseInt(p) - 1);
		$("#text").css("font-size", parseInt(text) - 1);
		$("#btn-buscar").css("font-size", parseInt(btnbuscar) - 1);
	}
	// alert($('.data').css('font-size'));
});
