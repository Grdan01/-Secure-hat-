// ==================== ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ ====================

// Начальные данные для таблицы (используются только при первом запуске)
const defaultNeuralNetworks = [
    {
        id: 1,
        name: "ChatGPT",
        url: "https://chat.openai.com",
        description: "Мощная нейросеть для общения, генерации текста, программирования и решения различных задач. Поддерживает контекст диалога.",
        vpn: "yes"
    },
    {
        id: 2,
        name: "Midjourney",
        url: "https://www.midjourney.com",
        description: "Генерация высококачественных изображений по текстовому описанию. Отличное качество артов и фотографий.",
        vpn: "yes"
    },
    {
        id: 3,
        name: "YandexGPT",
        url: "https://ya.ru/chat",
        description: "Русскоязычный аналог ChatGPT от Яндекса. Хорошо работает с русским языком и местным контекстом.",
        vpn: "no"
    },
    {
        id: 4,
        name: "Claude",
        url: "https://claude.ai",
        description: "Нейросеть от Anthropic с фокусом на безопасность и полезность. Умеет работать с длинными текстами.",
        vpn: "yes"
    },
    {
        id: 5,
        name: "DALL-E",
        url: "https://openai.com/dall-e-2",
        description: "Генерация изображений от создателей ChatGPT. Известна способностью создавать креативные и детализированные изображения.",
        vpn: "yes"
    },
    {
        id: 6,
        name: "Kandinsky 3.0",
        url: "https://fusionbrain.ai",
        description: "Российская нейросеть для генерации изображений. Поддерживает генерацию на русском языке.",
        vpn: "no"
    },
    {
        id: 7,
        name: "Stable Diffusion",
        url: "https://stability.ai",
        description: "Открытая модель генерации изображений. Можно запускать локально на своем компьютере.",
        vpn: "no"
    },
    {
        id: 8,
        name: "Bard",
        url: "https://bard.google.com",
        description: "Нейросеть от Google с интеграцией поиска. Бесплатный доступ к актуальной информации.",
        vpn: "yes"
    }
];

// Элементы DOM
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const vpnFilter = document.getElementById('vpnFilter');
const addNetworkBtn = document.getElementById('addNetworkBtn');
const addModal = document.getElementById('addModal');
const editModal = document.getElementById('editModal');
const closeModal = document.querySelector('.close');
const closeEditModal = document.querySelector('.close-edit');
const cancelBtn = document.querySelector('.btn-cancel');
const cancelEditBtn = document.querySelector('.btn-cancel-edit');
const addNetworkForm = document.getElementById('addNetworkForm');
const editNetworkForm = document.getElementById('editNetworkForm');
const totalNetworksEl = document.getElementById('totalNetworks');
const vpnRequiredEl = document.getElementById('vpnRequired');
const noVpnRequiredEl = document.getElementById('noVpnRequired');
const themeToggle = document.getElementById('themeToggle');
const toggleAnimationsBtn = document.getElementById('toggleAnimations');
const networkVpnToggle = document.getElementById('networkVpn');
const editNetworkVpnToggle = document.getElementById('editNetworkVpn');

// Переменные состояния
let neuralNetworks = [];
let currentId = 0;
let animationsEnabled = true;
let currentTheme = 'dark';

// ==================== ФУНКЦИИ ДЛЯ РАБОТЫ С LOCALSTORAGE ====================

// Функция сохранения данных в localStorage
function saveToLocalStorage() {
    try {
        const data = {
            networks: neuralNetworks,
            currentId: currentId,
            theme: currentTheme,
            animationsEnabled: animationsEnabled
        };
        localStorage.setItem('neuralNetworksData', JSON.stringify(data));
        console.log('Данные сохранены в localStorage');
    } catch (error) {
        console.error('Ошибка при сохранении в localStorage:', error);
        showNotification('Ошибка при сохранении данных', 'error');
    }
}

// Функция загрузки данных из localStorage
function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('neuralNetworksData');
        
        if (savedData) {
            const data = JSON.parse(savedData);
            neuralNetworks = data.networks || [];
            currentId = data.currentId || 0;
            currentTheme = data.theme || 'dark';
            animationsEnabled = data.animationsEnabled !== undefined ? data.animationsEnabled : true;
            
            console.log('Данные загружены из localStorage');
            return true;
        }
    } catch (error) {
        console.error('Ошибка при загрузке из localStorage:', error);
    }
    
    // Если данных нет или произошла ошибка, используем значения по умолчанию
    neuralNetworks = [...defaultNeuralNetworks];
    currentId = neuralNetworks.length > 0 ? Math.max(...neuralNetworks.map(n => n.id)) : 0;
    currentTheme = 'dark';
    animationsEnabled = true;
    
    console.log('Используются данные по умолчанию');
    return false;
}

// Функция очистки localStorage
function clearLocalStorage() {
    if (confirm('Вы уверены, что хотите очистить все данные? Это действие нельзя отменить.')) {
        localStorage.removeItem('neuralNetworksData');
        loadFromLocalStorage();
        renderTable(neuralNetworks);
        updateStats();
        showNotification('Все данные очищены', 'info');
    }
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ ПРИЛОЖЕНИЯ ====================

// Функция установки темы
function setTheme(theme) {
    currentTheme = theme;
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i><span>Темная тема</span>';
        themeToggle.title = 'Переключить на темную тему';
    } else {
        document.body.classList.remove('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i><span>Светлая тема</span>';
        themeToggle.title = 'Переключить на светлую тему';
    }
    saveToLocalStorage();
}

// Функция переключения темы
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(currentTheme);
    
    // Анимация переключения
    document.body.style.transition = 'background-color 0.5s, color 0.5s';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 500);
    
    showNotification(`Тема изменена на ${currentTheme === 'dark' ? 'тёмную' : 'светлую'}`, 'info');
}

// Функция переключения анимаций
function toggleAnimations() {
    animationsEnabled = !animationsEnabled;
    const animatedElements = document.querySelectorAll('.animated-background, .pulse-animation, .logo, .shape, .logo-glow, .icon-glow, .modal-icon-glow, .stars-container, .shooting-stars, .sun, .sun-glow, .sun-rays, .cloud, .flare');
    
    if (animationsEnabled) {
        animatedElements.forEach(el => {
            if (el.style) {
                el.style.animationPlayState = 'running';
            }
        });
        toggleAnimationsBtn.innerHTML = '<i class="fas fa-pause"></i> Пауза анимаций';
        toggleAnimationsBtn.title = 'Приостановить анимации';
        showNotification('Анимации включены', 'success');
    } else {
        animatedElements.forEach(el => {
            if (el.style) {
                el.style.animationPlayState = 'paused';
            }
        });
        toggleAnimationsBtn.innerHTML = '<i class="fas fa-play"></i> Анимации';
        toggleAnimationsBtn.title = 'Включить анимации';
        showNotification('Анимации приостановлены', 'info');
    }
    
    saveToLocalStorage();
}

// Функция рендеринга таблицы
function renderTable(networks) {
    tableBody.innerHTML = '';
    
    if (networks.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="5" style="text-align: center; padding: 40px;">
                <i class="fas fa-database" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 15px; display: block;"></i>
                <h3 style="color: var(--text-secondary); margin-bottom: 10px;">Нет данных для отображения</h3>
                <p style="color: var(--text-secondary);">Добавьте первую нейросеть, нажав на кнопку "Добавить нейросеть"</p>
            </td>
        `;
        tableBody.appendChild(emptyRow);
        return;
    }
    
    networks.forEach((network, index) => {
        const row = document.createElement('tr');
        
        // Задержка для последовательной анимации строк
        if (animationsEnabled) {
            row.style.animationDelay = `${index * 0.05}s`;
            row.classList.add('fade-in');
        }
        
        row.innerHTML = `
            <td>
                <div class="network-name">
                    <i class="fas fa-robot"></i>
                    ${escapeHtml(network.name)}
                </div>
            </td>
            <td>
                <a href="${escapeHtml(network.url)}" target="_blank" class="btn-visit">
                    <i class="fas fa-external-link-alt"></i> Перейти на сайт
                </a>
            </td>
            <td>${escapeHtml(network.description)}</td>
            <td>
                <span class="${network.vpn === 'yes' ? 'vpn-yes' : 'vpn-no'}">
                    <i class="fas fa-${network.vpn === 'yes' ? 'shield-alt' : 'globe'}"></i>
                    ${network.vpn === 'yes' ? 'Требуется VPN' : 'Не требуется VPN'}
                </span>
            </td>
            <td>
                <div class="actions">
                    <button class="btn-edit" onclick="editNetwork(${network.id})" title="Редактировать">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteNetwork(${network.id})" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Функция фильтрации таблицы
function filterTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const vpnValue = vpnFilter.value;
    
    const filteredNetworks = neuralNetworks.filter(network => {
        const matchesSearch = network.name.toLowerCase().includes(searchTerm) || 
                             network.description.toLowerCase().includes(searchTerm);
        const matchesVpn = vpnValue === 'all' || network.vpn === vpnValue;
        
        return matchesSearch && matchesVpn;
    });
    
    renderTable(filteredNetworks);
    
    // Анимация обновления таблицы
    if (filteredNetworks.length > 0) {
        animateTableRows();
    }
}

// Функция обновления статистики
function updateStats() {
    const total = neuralNetworks.length;
    const vpnRequired = neuralNetworks.filter(n => n.vpn === 'yes').length;
    const noVpnRequired = total - vpnRequired;
    
    // Анимация счетчиков
    animateCounter(totalNetworksEl, total);
    animateCounter(vpnRequiredEl, vpnRequired);
    animateCounter(noVpnRequiredEl, noVpnRequired);
    
    // Обновление прогресс-баров
    const totalProgress = document.getElementById('totalProgress');
    const vpnProgress = document.getElementById('vpnProgress');
    const noVpnProgress = document.getElementById('noVpnProgress');
    
    // Анимация прогресс-баров
    setTimeout(() => {
        totalProgress.style.width = '100%';
        vpnProgress.style.width = total > 0 ? `${(vpnRequired / total) * 100}%` : '0%';
        noVpnProgress.style.width = total > 0 ? `${(noVpnRequired / total) * 100}%` : '0%';
    }, 100);
}

// Анимация счетчика
function animateCounter(element, target) {
    const current = parseInt(element.textContent) || 0;
    const increment = target > current ? 1 : -1;
    const speed = Math.min(20, Math.abs(target - current) * 2);
    
    let currentValue = current;
    
    const updateCounter = () => {
        if ((increment > 0 && currentValue < target) || (increment < 0 && currentValue > target)) {
            currentValue += increment;
            element.textContent = currentValue;
            setTimeout(updateCounter, speed);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// Анимация строк таблицы
function animateTableRows() {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            row.style.transition = 'opacity 0.5s, transform 0.5s';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

// Функции для работы с модальными окнами
function openModal() {
    addModal.style.display = 'block';
    // Сброс формы
    addNetworkForm.reset();
    networkVpnToggle.checked = false;
    
    // Анимация появления
    const modalContent = addModal.querySelector('.modal-content');
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        modalContent.style.transition = 'opacity 0.3s, transform 0.3s';
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
}

function openEditModal() {
    editModal.style.display = 'block';
    
    // Анимация появления
    const modalContent = editModal.querySelector('.modal-content');
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        modalContent.style.transition = 'opacity 0.3s, transform 0.3s';
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
}

function closeModalHandler() {
    const modalContent = addModal.querySelector('.modal-content');
    modalContent.style.transition = 'opacity 0.2s, transform 0.2s';
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        addModal.style.display = 'none';
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 200);
}

function closeEditModalHandler() {
    const modalContent = editModal.querySelector('.modal-content');
    modalContent.style.transition = 'opacity 0.2s, transform 0.2s';
    modalContent.style.opacity = '0';
    modalContent.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        editModal.style.display = 'none';
        modalContent.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 200);
}

// Функция добавления новой нейросети
function addNewNetwork() {
    const name = document.getElementById('networkName').value.trim();
    const url = document.getElementById('networkUrl').value.trim();
    const description = document.getElementById('networkDescription').value.trim();
    const vpn = networkVpnToggle.checked ? 'yes' : 'no';
    
    // Валидация
    if (!name || !url || !description) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'warning');
        return;
    }
    
    // Проверка URL
    if (!isValidUrl(url)) {
        showNotification('Пожалуйста, введите корректный URL (начинается с http:// или https://)', 'warning');
        return;
    }
    
    currentId++;
    const newNetwork = {
        id: currentId,
        name: name,
        url: url,
        description: description,
        vpn: vpn
    };
    
    neuralNetworks.push(newNetwork);
    renderTable(neuralNetworks);
    updateStats();
    closeModalHandler();
    saveToLocalStorage();
    
    // Сброс фильтров
    searchInput.value = '';
    vpnFilter.value = 'all';
    
    // Анимация добавления
    const newRow = document.querySelector('tbody tr:last-child');
    if (newRow) {
        newRow.style.background = 'rgba(106, 17, 203, 0.2)';
        setTimeout(() => {
            newRow.style.transition = 'background 1s';
            newRow.style.background = '';
        }, 1000);
    }
    
    // Показать уведомление
    showNotification(`Нейросеть "${name}" успешно добавлена!`, 'success');
}

// Функция редактирования нейросети
function editNetwork(id) {
    const network = neuralNetworks.find(n => n.id === id);
    if (network) {
        // Заполняем форму данными
        document.getElementById('editNetworkId').value = network.id;
        document.getElementById('editNetworkName').value = network.name;
        document.getElementById('editNetworkUrl').value = network.url;
        document.getElementById('editNetworkDescription').value = network.description;
        editNetworkVpnToggle.checked = network.vpn === 'yes';
        
        // Открываем модальное окно редактирования
        openEditModal();
    }
}

// Функция сохранения изменений
function saveEditedNetwork(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editNetworkId').value);
    const name = document.getElementById('editNetworkName').value.trim();
    const url = document.getElementById('editNetworkUrl').value.trim();
    const description = document.getElementById('editNetworkDescription').value.trim();
    const vpn = editNetworkVpnToggle.checked ? 'yes' : 'no';
    
    // Валидация
    if (!name || !url || !description) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'warning');
        return;
    }
    
    // Проверка URL
    if (!isValidUrl(url)) {
        showNotification('Пожалуйста, введите корректный URL (начинается с http:// или https://)', 'warning');
        return;
    }
    
    const networkIndex = neuralNetworks.findIndex(n => n.id === id);
    if (networkIndex !== -1) {
        // Сохраняем старые данные для отката
        const oldNetwork = {...neuralNetworks[networkIndex]};
        
        // Обновляем сеть
        neuralNetworks[networkIndex] = {
            id: id,
            name: name,
            url: url,
            description: description,
            vpn: vpn
        };
        
        renderTable(neuralNetworks);
        updateStats();
        closeEditModalHandler();
        saveToLocalStorage();
        
        // Анимация
        const updatedRow = document.querySelector(`tbody tr:nth-child(${networkIndex + 1})`);
        if (updatedRow) {
            updatedRow.style.background = 'rgba(0, 212, 170, 0.2)';
            setTimeout(() => {
                updatedRow.style.transition = 'background 1s';
                updatedRow.style.background = '';
            }, 1000);
        }
        
        showNotification(`Нейросеть "${name}" успешно обновлена!`, 'success');
    }
}

// Функция удаления нейросети
function deleteNetwork(id) {
    const network = neuralNetworks.find(n => n.id === id);
    if (!network) return;
    
    if (confirm(`Вы уверены, что хотите удалить нейросеть "${network.name}"?`)) {
        // Сохраняем данные для возможного отката
        const deletedNetwork = {...network};
        const deletedIndex = neuralNetworks.findIndex(n => n.id === id);
        
        // Удаляем сеть
        neuralNetworks = neuralNetworks.filter(network => network.id !== id);
        renderTable(neuralNetworks);
        updateStats();
        filterTable();
        saveToLocalStorage();
        
        // Анимация удаления
        showNotification(`Нейросеть "${deletedNetwork.name}" удалена!`, 'info');
        
        // Добавляем кнопку отмены удаления
        setTimeout(() => {
            showUndoDeleteNotification(deletedNetwork, deletedIndex);
        }, 500);
    }
}

// Функция показа уведомления с возможностью отмены удаления
function showUndoDeleteNotification(network, index) {
    const notification = document.createElement('div');
    notification.className = 'notification info';
    notification.innerHTML = `
        <i class="fas fa-trash-restore"></i>
        <span>Нейросеть "${network.name}" удалена</span>
        <button id="undoDelete" style="margin-left: 15px; background: rgba(255,255,255,0.2); border: none; color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; pointer-events: auto;">
            Отменить
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Обработчик кнопки отмены
    document.getElementById('undoDelete').addEventListener('click', function() {
        // Восстанавливаем сеть
        neuralNetworks.splice(index, 0, network);
        renderTable(neuralNetworks);
        updateStats();
        saveToLocalStorage();
        
        // Закрываем уведомление
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 500);
        
        showNotification(`Удаление нейросети "${network.name}" отменено`, 'success');
    });
    
    // Автоматическое скрытие через 10 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }
    }, 10000);
}

// Функция показа уведомления
function showNotification(message, type = 'success') {
    // Удаляем старые уведомления
    const oldNotifications = document.querySelectorAll('.notification:not(.persistent)');
    oldNotifications.forEach(notification => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    });
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Выбираем иконку в зависимости от типа
    let icon;
    switch(type) {
        case 'warning':
            icon = 'exclamation-triangle';
            break;
        case 'info':
            icon = 'info-circle';
            break;
        case 'error':
            icon = 'exclamation-circle';
            break;
        case 'success':
        default:
            icon = 'check-circle';
    }
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 5000);
}

// Вспомогательные функции
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ====================

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем данные из localStorage
    loadFromLocalStorage();
    
    // Устанавливаем тему
    setTheme(currentTheme);
    
    // Устанавливаем состояние анимаций
    toggleAnimationsBtn.innerHTML = animationsEnabled ? 
        '<i class="fas fa-pause"></i> Пауза анимаций' : 
        '<i class="fas fa-play"></i> Анимации';
    
    // Загружаем начальные данные
    renderTable(neuralNetworks);
    updateStats();
    
    // Обработчики событий для поиска и фильтрации
    searchInput.addEventListener('input', filterTable);
    vpnFilter.addEventListener('change', filterTable);
    
    // Обработчики для модального окна добавления
    addNetworkBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalHandler);
    cancelBtn.addEventListener('click', closeModalHandler);
    
    // Обработчики для модального окна редактирования
    closeEditModal.addEventListener('click', closeEditModalHandler);
    cancelEditBtn.addEventListener('click', closeEditModalHandler);
    
    // Обработчики отправки форм
    addNetworkForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewNetwork();
    });
    
    editNetworkForm.addEventListener('submit', saveEditedNetwork);
    
    // Переключатель темы
    themeToggle.addEventListener('click', toggleTheme);
    
    // Переключатель анимаций
    toggleAnimationsBtn.addEventListener('click', toggleAnimations);
    
    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', function(e) {
        if (e.target === addModal) {
            closeModalHandler();
        }
        if (e.target === editModal) {
            closeEditModalHandler();
        }
    });
    
    // Инициализация счетчиков с анимацией
    animateTableRows();
    
    // Добавляем обработчики для анимаций при наведении на элементы
    document.addEventListener('mouseover', function(e) {
        if (animationsEnabled) {
            // Анимация кнопок при наведении
            if (e.target.matches('button, .btn-visit, .btn-edit, .btn-delete')) {
                e.target.style.transform = 'translateY(-3px)';
            }
            
            // Анимация карточек статистики
            if (e.target.closest('.stat-card')) {
                const card = e.target.closest('.stat-card');
                const icon = card.querySelector('.stat-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            }
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (animationsEnabled) {
            // Возвращаем кнопки в исходное состояние
            if (e.target.matches('button, .btn-visit, .btn-edit, .btn-delete')) {
                e.target.style.transform = 'translateY(0)';
            }
            
            // Возвращаем иконки карточек в исходное состояние
            if (e.target.closest('.stat-card')) {
                const card = e.target.closest('.stat-card');
                const icon = card.querySelector('.stat-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0)';
                }
            }
        }
    });
    
    // Добавляем кнопку очистки данных в консоль (для отладки)
    console.log('Для очистки всех данных вызовите функцию clearLocalStorage()');
    
    // Добавляем информацию о текущем состоянии в консоль
    console.log('Текущее количество нейросетей:', neuralNetworks.length);
    console.log('Текущая тема:', currentTheme);
    console.log('Анимации:', animationsEnabled ? 'включены' : 'выключены');
});

// Экспортируем функции для глобального доступа
window.clearLocalStorage = clearLocalStorage;
window.editNetwork = editNetwork;
window.deleteNetwork = deleteNetwork;