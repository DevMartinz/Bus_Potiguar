// ...
.then(function (user) {
  // Se o usuário existe, você pode executar qualquer ação adicional que desejar aqui
  if (user.nivel === 100) {
      var url = "/auth/rotas.html";
      window.location.href = url;
  } else {
      const urlParams = new URLSearchParams(window.location.search);
      const opcValuetest = urlParams.get("opc");
      const opcValue = parseInt(opcValuetest);
      userData = user.id;
      console.log("teste:" + userData);
      if (opcValue) {
          console.log("entrou aqui");
          // Aqui, use diretamente a propriedade 'id' do objeto 'user'
          const userId = user.id;

          if (userId) {
              // Verifica se a rota já foi adicionada aos favoritos pelo usuário
              const rotaJaAdicionada = rotas.some(
                  (rot) => rot.idUsuario == userId && rot.nomeRota === opcValue
              );

              if (!rotaJaAdicionada) {
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
              }
          } else {
              console.error("Não foi possível extrair o ID do usuário.");
          }
      } else {
          console.log("Elementos na Tela");
          document.getElementById("g_id_logado").style.display = "block";
          updateList();
      }
  }
})
// ...
