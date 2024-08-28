const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const tabs = document.querySelectorAll('.tabs a');
const tabName = document.getElementById('tab-name');
const tabContents = document.querySelectorAll('.tab-content');
const profilePicture = document.getElementById('profile-picture');
const statusIndicator = document.getElementById('status-indicator');
const homePageSection = document.getElementById('home-page');

const savedTheme = localStorage.getItem('theme') || 'dark-mode';
body.classList.add(savedTheme);

function switchTab(tabId) {
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
    const selectedContent = document.getElementById(tabId);

    if (selectedTab) {
        selectedTab.classList.add('active');
        tabName.textContent = selectedTab.textContent;
    }

    if (selectedContent) {
        selectedContent.classList.add('active');

        if (tabId === 'home') {
            homePageSection.style.display = 'flex';
        } else {
            homePageSection.style.display = 'none';
        }
    }

    localStorage.setItem('selectedTab', tabId);
}

const savedTab = localStorage.getItem('selectedTab') || 'home';
switchTab(savedTab);

tabs.forEach(tab => {
    tab.addEventListener('click', (event) => {
        event.preventDefault();
        const tabId = event.target.getAttribute('data-tab');
        switchTab(tabId);
    });
});

toggleButton.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    }
});

function setStatus(isOnline) {
    if (isOnline) {
        statusIndicator.classList.add('status-online');
        statusIndicator.classList.remove('status-offline');
    } else {
        statusIndicator.classList.add('status-offline');
        statusIndicator.classList.remove('status-online');
    }
}

async function fetchProfilePicture() {
    const storageKey = 'profile-picture';
    const urlKey = 'profile-picture-url';
    const profilePicture = document.getElementById('profile-picture');
    
    const loadingGifUrl = 'assets/images/spinner.gif';
    
    const cachedImage = localStorage.getItem(storageKey);
    const cachedUrl = localStorage.getItem(urlKey);
    
    profilePicture.style.backgroundImage = `url(${loadingGifUrl})`;
    
    try {
        const response = await fetch('https://i.joshua.dog/api/discord/status');
        const data = await response.json();
        const pictureUrl = data.user.avatar_url;
        
        if (cachedImage && cachedUrl === pictureUrl) {
            profilePicture.style.backgroundImage = `url(${cachedImage})`;
        } else {
            const imageResponse = await fetch(pictureUrl);
            const imageBlob = await imageResponse.blob();
            
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64data = reader.result;
                
                localStorage.setItem(storageKey, base64data);
                localStorage.setItem(urlKey, pictureUrl);
                
                profilePicture.style.backgroundImage = `url(${base64data})`;
            };
            reader.readAsDataURL(imageBlob);
        }
        
        const status = data.status;
        if (status === 'Online') {
            setStatus(true);
        } else {
            setStatus(false);
        }
        
    } catch (error) {
        console.error('Error fetching profile picture:', error);
    }
}

fetchProfilePicture();



