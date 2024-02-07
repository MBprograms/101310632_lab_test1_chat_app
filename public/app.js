document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const logoutBtn = document.getElementById('logout-btn');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');

    const isAuthenticated = () => {
        return localStorage.getItem('token') !== null;
    };

    const redirectToPage = () => {
        if (isAuthenticated()) {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('signup-container').style.display = 'none';
            document.getElementById('room-selection').style.display = 'block';
            document.getElementById('chat-container').style.display = 'block';
        } else {


            document.getElementById('login-container').style.display = 'block';
            document.getElementById('signup-container').style.display = 'none';
            document.getElementById('room-selection').style.display = 'none';
            document.getElementById('chat-container').style.display = 'none';
        }
    };

    redirectToPage();

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();
            const token = data.token;
            

            localStorage.setItem('token', token);
            
            redirectToPage();
        } catch (error) {
            console.error('Login error:', error);
        }
    });

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newUsername = document.getElementById('new-username').value;
        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const newPassword = document.getElementById('new-password').value;
        
        redirectToPage();
    });


    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        
        redirectToPage();
    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = messageInput.value.trim();
        
        if (message) {
            socket.emit('sendMessage', message);
            
            messageInput.value = '';
        }
    });
});