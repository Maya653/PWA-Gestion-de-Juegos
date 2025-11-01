// ========================================
// WINDOW CONTROLS OVERLAY - NUEVO
// ========================================

// Función debounce para evitar ejecutar código demasiado frecuentemente
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Detectar y manejar Window Controls Overlay
if ('windowControlsOverlay' in navigator) {
    console.log('✓ Window Controls Overlay disponible');
    
    // Evento que se dispara cuando cambia la geometría de la ventana
    navigator.windowControlsOverlay.addEventListener('geometrychange', debounce((e) => {
        // Detectar si la superposición está visible
        const isOverlayVisible = navigator.windowControlsOverlay.visible;
        
        // Obtener el tamaño y posición del área de la barra de título
        const titleBarRect = e.titlebarAreaRect;
        
        console.log(`WCO ${isOverlayVisible ? 'visible' : 'oculta'}`);
        console.log(`Ancho de barra de título: ${titleBarRect.width}px`);
        console.log(`Alto de barra de título: ${titleBarRect.height}px`);
        
        // Aquí puedes ajustar tu layout dinámicamente si es necesario
        // Por ejemplo, reorganizar elementos si el espacio es muy pequeño
        if (titleBarRect.width < 600) {
            console.log('⚠️ Espacio reducido en la barra de título');
            // Podrías ocultar algunos elementos del menú
        }
    }, 200));
    
    // Estado inicial
    if (navigator.windowControlsOverlay.visible) {
        console.log('✓ Window Controls Overlay está activo');
        showNotification('Modo ventana personalizada activado');
    }
} else {
    console.log('ℹ️ Window Controls Overlay no disponible en este navegador');
}

// ========================================
// FIN WINDOW CONTROLS OVERLAY
// ========================================

// Registro del Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registrado con éxito:', registration.scope);
            })
            .catch(error => {
                console.log('Error al registrar Service Worker:', error);
            });
    });
}

// Navegación entre páginas - ACTUALIZADO para manejar ambas barras de navegación
function setupNavigation() {
    // Seleccionar links de ambas barras (original y personalizada)
    const navLinks = document.querySelectorAll('.nav-menu a, .custom-title-bar .nav-menu a');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remover clase active de todos los links (en ambas barras)
            document.querySelectorAll('.nav-menu a, .custom-title-bar .nav-menu a').forEach(l => {
                l.classList.remove('active');
            });
            
            // Agregar clase active al link clickeado y su equivalente en la otra barra
            const pageId = link.getAttribute('data-page');
            document.querySelectorAll(`[data-page="${pageId}"]`).forEach(l => {
                l.classList.add('active');
            });
            
            // Ocultar todas las páginas
            pages.forEach(page => page.classList.remove('active'));
            
            // Mostrar la página seleccionada
            document.getElementById(`${pageId}-page`).classList.add('active');
        });
    });
}

// Inicializar navegación
setupNavigation();

// Carrito de compras
let cartCount = 0;

function updateCartCount() {
    // Actualizar contador en ambas barras
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = cartCount;
    });
}

// Agregar al carrito
document.querySelectorAll('.btn-small').forEach(button => {
    button.addEventListener('click', (e) => {
        if (e.target.textContent === 'Añadir al Carrito') {
            cartCount++;
            updateCartCount();
            
            // Cambiar texto del botón
            e.target.textContent = '✓ Agregado';
            e.target.style.background = '#10b981';
            
            // Animación
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = 'scale(1)';
            }, 100);
            
            // Mostrar notificación
            showNotification('Juego agregado al carrito');
        }
    });
});

// Sistema de notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: ${navigator.windowControlsOverlay?.visible ? 'calc(env(titlebar-area-height, 50px) + 20px)' : '20px'};
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Búsqueda - ACTUALIZADO para ambas barras
document.querySelectorAll('.search-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const searchTerm = prompt('¿Qué juego estás buscando?');
        if (searchTerm) {
            showNotification(`Buscando: ${searchTerm}`);
        }
    });
});

// Filtros de biblioteca
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        showNotification(`Filtro aplicado: ${button.textContent}`);
    });
});

// Tabs de comunidad
const tabButtons = document.querySelectorAll('.tab-btn');
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        showNotification(`Mostrando: ${button.textContent}`);
    });
});

// Formulario de perfil
const profileForm = document.querySelector('.profile-form');
if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Perfil actualizado con éxito');
    });
}

// Switches de configuración
const switches = document.querySelectorAll('.switch input');
switches.forEach(switchInput => {
    switchInput.addEventListener('change', (e) => {
        const setting = e.target.parentElement.parentElement.querySelector('span').textContent;
        const status = e.target.checked ? 'activado' : 'desactivado';
        showNotification(`${setting} ${status}`);
    });
});

// Animaciones CSS dinámicas
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Botones de jugar/instalar en biblioteca
document.querySelectorAll('.library-card .btn').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.textContent.trim();
        const gameTitle = button.parentElement.querySelector('h3').textContent;
        
        if (action === 'Jugar') {
            showNotification(`Iniciando ${gameTitle}...`);
        } else if (action === 'Instalar') {
            showNotification(`Instalando ${gameTitle}...`);
            button.textContent = 'Instalando...';
            button.disabled = true;
            
            // Simular instalación
            setTimeout(() => {
                button.textContent = 'Jugar';
                button.disabled = false;
                button.classList.remove('btn-secondary');
                button.classList.add('btn-primary');
                showNotification(`${gameTitle} instalado correctamente`);
            }, 3000);
        }
    });
});

// Ver tráiler
document.querySelector('.btn-secondary')?.addEventListener('click', () => {
    showNotification('Abriendo tráiler...');
});

// Comprar ahora
document.querySelectorAll('.btn-primary').forEach(button => {
    if (button.textContent.includes('Comprar')) {
        button.addEventListener('click', () => {
            showNotification('Procesando compra...');
        });
    }
});

// Leer más noticias
document.querySelectorAll('.news-card .btn-small').forEach(button => {
    button.addEventListener('click', () => {
        const newsTitle = button.parentElement.querySelector('h3').textContent;
        showNotification(`Abriendo: ${newsTitle}`);
    });
});

// Prevenir instalación automática de PWA y mostrar botón personalizado
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Crear botón de instalación personalizado
    const installButton = document.createElement('button');
    installButton.textContent = '📱 Instalar App';
    installButton.className = 'btn btn-primary';
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
    `;
    
    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                showNotification('¡App instalada con éxito!');
            }
            
            deferredPrompt = null;
            installButton.remove();
        }
    });
    
    document.body.appendChild(installButton);
});

// Detectar cuando la app está instalada
window.addEventListener('appinstalled', () => {
    showNotification('¡GameHub instalada correctamente!');
    deferredPrompt = null;
});

// Modo offline
window.addEventListener('online', () => {
    showNotification('Conexión restaurada');
});

window.addEventListener('offline', () => {
    showNotification('Modo offline activado');
});

console.log('GameHub PWA cargada correctamente ✓');
console.log('Window Controls Overlay implementado ✓'); 