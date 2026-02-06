// Dados da agenda
const agenda = [
  {date: "15 ABRIL 2026", place: "Fortal City Arena - Fortaleza, CE"},
  {date: "22 MAIO 2026", place: "Teatro Municipal - São Paulo, SP"},
  {date: "10 JUNHO 2026", place: "Arena da Amazônia - Manaus, AM"}
];

// Elementos DOM
let bottomBar, playerToggle;

// Estado do player
let isPlayerHidden = false;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar elementos
  bottomBar = document.getElementById('bottomBar');
  playerToggle = document.getElementById('playerToggle');
  
  // Inicializar funcionalidades
  initPlayerToggle();
  initMenuToggle();
  initNavLinks();
  initIntersectionObserver();
  renderAgenda();
  
  // Verificar estado inicial do player
  checkPlayerState();
});

// Função para inicializar o toggle do player
function initPlayerToggle() {
  if (!bottomBar || !playerToggle) return;
  
  // Toggle pelo botão flutuante
  playerToggle.addEventListener('click', togglePlayerBar);
  
  // Atualizar texto do botão
  updateToggleButtonText();
  
  // Ajustar padding do conteúdo principal
  adjustMainContentPadding();
}

// Função para alternar visibilidade da barra do player
function togglePlayerBar() {
  if (!bottomBar || !playerToggle) return;
  
  isPlayerHidden = !isPlayerHidden;
  
  // Alternar classes
  bottomBar.classList.toggle('hidden', isPlayerHidden);
  // usar classe 'collapsed' para não esconder o botão completamente
  playerToggle.classList.toggle('collapsed', isPlayerHidden);
  
  // Atualizar texto do botão
  updateToggleButtonText();
  
  // Ajustar padding do conteúdo principal
  adjustMainContentPadding();
  
  // Salvar estado no localStorage
  savePlayerState();
}

// Atualizar texto do botão de toggle
function updateToggleButtonText() {
  if (!playerToggle) return;
  
  const span = playerToggle.querySelector('span');
  if (span) {
    span.textContent = isPlayerHidden ? 'Mostrar Player' : 'Ocultar Player';
  }
  
  // Atualizar ícone
  const icon = playerToggle.querySelector('i');
  if (icon) {
    icon.className = isPlayerHidden ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
  }
}

// Ajustar padding do conteúdo principal
function adjustMainContentPadding() {
  const mainContent = document.querySelector('.main-content');
  if (!mainContent) return;
  
  if (isPlayerHidden) {
    mainContent.style.paddingBottom = '30px';
  } else {
    if (window.innerWidth <= 768) {
      mainContent.style.paddingBottom = '190px';
    } else {
      mainContent.style.paddingBottom = '180px';
    }
  }
}

// Verificar estado salvo do player
function checkPlayerState() {
  if (!bottomBar || !playerToggle) return;
  
  const savedState = localStorage.getItem('playerHidden');
  if (savedState !== null) {
    isPlayerHidden = JSON.parse(savedState);
  } else {
    // Se não houver estado salvo, ocultar por padrão em telas pequenas
    isPlayerHidden = window.innerWidth <= 768;
  }

  // Aplicar estado
  bottomBar.classList.toggle('hidden', isPlayerHidden);
  playerToggle.classList.toggle('collapsed', isPlayerHidden);
  updateToggleButtonText();
  adjustMainContentPadding();
}

// Salvar estado do player
function savePlayerState() {
  localStorage.setItem('playerHidden', JSON.stringify(isPlayerHidden));
}

// Função para inicializar o toggle do menu mobile
function initMenuToggle() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  
  if (!menuToggle || !sidebar) return;
  
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    
    // Ajustar margem do conteúdo principal no mobile
    const mainContent = document.querySelector('.main-content');
    if (window.innerWidth <= 1200) {
      if (sidebar.classList.contains('open')) {
        mainContent.style.marginLeft = '250px';
        mainContent.style.overflow = 'hidden';
      } else {
        mainContent.style.marginLeft = '0';
        mainContent.style.overflow = 'auto';
      }
    }
  });
  
  // Fechar menu ao clicar em um link (mobile)
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1200) {
        sidebar.classList.remove('open');
        const mainContent = document.querySelector('.main-content');
        mainContent.style.marginLeft = '0';
        mainContent.style.overflow = 'auto';
      }
    });
  });
}

// Função para inicializar navegação
function initNavLinks() {
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// Função para inicializar observador de interseção
function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  // Observar seções
  document.querySelectorAll('.section-container').forEach(section => {
    observer.observe(section);
  });
}

// Função para adicionar shows
function addShow() {
  const date = prompt("Data do show (ex: 25 JULHO 2026):");
  const place = prompt("Local do show (ex: Estádio Nacional - Brasília, DF):");
  if(date && place) {
    agenda.push({date, place});
    renderAgenda();
  }
}

// Função para renderizar agenda
function renderAgenda() {
  const list = document.getElementById('agenda-list');
  if (!list) return;
  
  list.innerHTML = '';
  agenda.forEach(show => {
    const div = document.createElement('div');
    div.className = 'agenda-item';
    div.innerHTML = `<span class="agenda-date">${show.date}</span> ${show.place}`;
    list.appendChild(div);
  });
}

// Função para newsletter
function subscribe() {
  const email = document.getElementById('email').value;
  if(email) {
    alert('Obrigado por se cadastrar! Você receberá nossas novidades em breve.');
    document.getElementById('email').value = '';
  } else {
    alert('Por favor, insira um e-mail válido.');
  }
}

// Ajustar responsividade ao redimensionar
window.addEventListener('resize', () => {
  // Menu mobile
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  
  if (menuToggle && sidebar) {
    if (window.innerWidth <= 1200) {
      menuToggle.style.display = 'block';
      sidebar.classList.remove('open');
      
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '0';
      }
    } else {
      menuToggle.style.display = 'none';
      sidebar.classList.add('open');
      
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.style.marginLeft = '250px';
      }
    }
  }
  
  // Ajustar padding do conteúdo principal
  adjustMainContentPadding();
});

// Adicionar efeito de rolagem suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});