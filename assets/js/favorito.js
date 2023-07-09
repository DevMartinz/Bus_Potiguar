document.addEventListener('DOMContentLoaded', function() {
  const mensagem = document.getElementById('mensagem');

  // Verificar se há informação favoritada no localStorage
  const informacaoFavoritada = localStorage.getItem('informacaoFavoritada');

  if (informacaoFavoritada) {
    mensagem.textContent = informacaoFavoritada;
  } else {
    mensagem.textContent = 'Nenhuma informação favoritada encontrada.';
  }
});

  
  