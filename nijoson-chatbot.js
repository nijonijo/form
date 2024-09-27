(function() {
    const options = {
        // Basic appearance
        primaryColor: '#0084ff',
        secondaryColor: '#f0f0f0',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        
        // Position and size
        position: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
        windowWidth: '400px',
        windowHeight: '600px',
        
        // Content
        initialMessages: [
            "Hi there! 👋",
            "My name is Nijoson Bot. How can I assist you today?",
            "How you doin?"
        ],
        chatIcon: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z'/%3E%3C/svg%3E`,
        logoUrl: 'Image_1.png',
        headerText: 'My Bot',
        
        // Functionality
        soundEffectUrl: 'sound_effect.mp3',
        enableSound: true,
        enableTypingIndicator: true,
        typingSpeed: 50, // milliseconds per character
        
        // Behavior
        openOnLoad: false,
        openDelay: 300, // milliseconds
        closeDelay: 500, // milliseconds
        
        // Message appearance
        userMessageColor: '#0084ff',
        botMessageColor: '#e5e5ea',
        messageTextColor: '#000000',
        
        // Input field
        inputPlaceholder: 'Type a message...',
        sendButtonText: 'Send',
        
        // Advanced
        maxMessages: 50, // maximum number of messages to keep in storage
        apiEndpoint: 'http://localhost:5678/webhook/c53ca35a-5f8d-458c-a472-df9975d5ebc7/chat',
        enableMarkdown: false, // enable markdown parsing in messages
        customCSS: '' // additional CSS to be injected
    };

    // Create a unique prefix for class names and IDs
    const prefix = 'nijoson-chatbot-';

    // Helper function to create elements with classes
    function createElement(tag, classes, content) {
        const element = document.createElement(tag);
        if (classes) {
            element.className = classes.map(c => prefix + c).join(' ');
        }
        if (content) {
            element.textContent = content;
        }
        return element;
    }

    // Create styles
    const styles = `
        .${prefix}widget {
            position: fixed;
            ${options.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
            ${options.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
            z-index: 10000;
            font-family: ${options.fontFamily};
        }
        .${prefix}icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: ${options.primaryColor};
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        .${prefix}icon:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        .${prefix}icon img {
            width: 30px;
            height: 30px;
            transition: transform 0.3s ease;
        }
        .${prefix}window {
            display: none;
            width: 400px;
            height: 600px;
            position: absolute;
            ${options.position.includes('bottom') ? 'bottom: 70px;' : 'top: 70px;'}
            ${options.position.includes('right') ? 'right: 0;' : 'left: 0;'}
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.1);
            flex-direction: column;
            overflow: hidden;
            transition: opacity 0.3s ease, transform 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
            pointer-events: none;
        }
        .${prefix}window.open {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
        }
        .${prefix}header {
            background-color: ${options.primaryColor};
            color: white;
            padding: 15px;
            font-weight: bold;
            font-size: 18px;
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            display: flex;
            align-items: center;
        }
        .${prefix}header-logo {
            width: 24px;
            height: 24px;
            margin-right: 10px;
        }
        .${prefix}messages {
            flex-grow: 1;
            overflow-y: auto;
            padding: 15px;
            background-color: #f7f7f7;
        }
        .${prefix}message {
            margin-bottom: 10px;
            padding: 8px 12px;
            border-radius: 18px;
            max-width: 80%;
            word-wrap: break-word;
            animation: ${prefix}fadeIn 0.3s ease;
        }
        @keyframes ${prefix}fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .${prefix}user-message {
            background-color: ${options.primaryColor};
            color: white;
            align-self: flex-end;
            margin-left: auto;
            border-bottom-right-radius: 5px;
        }
        .${prefix}bot-message {
            background-color: #e5e5ea;
            color: black;
            align-self: flex-start;
            border-bottom-left-radius: 5px;
        }
        .${prefix}input {
            display: flex;
            padding: 10px;
            background-color: white;
            border-top: 1px solid #e5e5ea;
        }
        .${prefix}input input {
            flex-grow: 1;
            padding: 10px;
            border: 1px solid #e5e5ea;
            border-radius: 20px;
            font-size: 14px;
            transition: all 0.3s ease;
        }
        .${prefix}input input:focus {
            outline: none;
            border-color: ${options.primaryColor};
            box-shadow: 0 0 0 2px rgba(0,132,255,0.2);
        }
        .${prefix}input button {
            margin-left: 10px;
            padding: 10px 15px;
            background-color: ${options.primaryColor};
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
            font-weight: bold;
        }
        .${prefix}input button:hover {
            background-color: #0066cc;
            transform: translateY(-2px);
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .${prefix}input button:active {
            transform: translateY(0);
            box-shadow: none;
        }
        .${prefix}loading {
            display: flex;
            align-items: center;
            background-color: #e5e5ea;
            color: black;
            border-radius: 18px;
            padding: 8px 12px;
            margin-bottom: 10px;
            animation: ${prefix}fadeIn 0.3s ease;
        }
        .${prefix}loading-dots {
            display: flex;
            margin-left: 8px;
        }
        .${prefix}loading-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: black;
            margin: 0 2px;
            animation: ${prefix}loadingDot 1.4s infinite ease-in-out both;
        }
        .${prefix}loading-dot:nth-child(2) {
            animation-delay: 0.2s;
        }
        .${prefix}loading-dot:nth-child(3) {
            animation-delay: 0.4s;
        }
        @keyframes ${prefix}loadingDot {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    `;

    // Create and append style element
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    // Create chat widget elements
    const widget = createElement('div', ['widget']);
    const icon = createElement('div', ['icon']);
    const iconImg = document.createElement('img');
    iconImg.src = options.chatIcon;
    icon.appendChild(iconImg);

    const window = createElement('div', ['window']);
    const header = createElement('div', ['header']);
    
    // Add logo to header
    const headerLogo = document.createElement('img');
    headerLogo.src = options.logoUrl;
    headerLogo.className = prefix + 'header-logo';
    header.appendChild(headerLogo);
    
    // Add "My Bot" text to header
    const headerText = document.createElement('span');
    headerText.textContent = 'My Bot';
    header.appendChild(headerText);

    const messages = createElement('div', ['messages']);
    const input = createElement('div', ['input']);
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Type a message...';
    const sendButton = createElement('button', [], 'Send');

    input.appendChild(textInput);
    input.appendChild(sendButton);

    window.appendChild(header);
    window.appendChild(messages);
    window.appendChild(input);

    widget.appendChild(icon);
    widget.appendChild(window);

    // Append widget to body
    document.body.appendChild(widget);

    // Create audio element for sound effect
    const audio = document.createElement('audio');
    audio.src = options.soundEffectUrl;
    document.body.appendChild(audio);

    // Chat functionality
    function saveMessages() {
        localStorage.setItem('chatMessages', JSON.stringify(Array.from(messages.children).map(msg => ({
            content: msg.textContent,
            isUser: msg.classList.contains(prefix + 'user-message')
        }))));
    }

    function loadMessages() {
        const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        savedMessages.forEach(msg => addMessage(msg.content, msg.isUser, false));
        scrollToBottom();
    }

    function scrollToBottom() {
        messages.scrollTop = messages.scrollHeight;
    }

    function addMessage(content, isUser = false, save = true) {
        const message = createElement('div', ['message', isUser ? 'user-message' : 'bot-message'], content);
        messages.appendChild(message);
        scrollToBottom();
        if (save) {
            audio.play().catch(error => console.error("Error playing sound:", error));
            saveMessages();
        }
    }

    function addLoadingIndicator() {
        const loading = createElement('div', ['loading'], 'Typing');
        const dots = createElement('div', ['loading-dots']);
        for (let i = 0; i < 3; i++) {
            dots.appendChild(createElement('div', ['loading-dot']));
        }
        loading.appendChild(dots);
        messages.appendChild(loading);
        scrollToBottom();
    }

    function removeLoadingIndicator() {
        const loading = messages.querySelector(`.${prefix}loading`);
        if (loading) {
            loading.remove();
        }
    }

    async function sendToN8N(message) {
        try {
            const response = await fetch('http://localhost:5678/webhook/c53ca35a-5f8d-458c-a472-df9975d5ebc7/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message }),
            });
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error:', error);
            return 'Sorry, there was an error processing your request.';
        }
    }

    function sendMessage() {
        const message = textInput.value.trim();
        if (message) {
            addMessage(message, true);
            textInput.value = '';
            addLoadingIndicator();
            sendToN8N(message).then(response => {
                removeLoadingIndicator();
                addMessage(response);
            });
        }
    }

    sendButton.addEventListener('click', sendMessage);
    textInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function openChat() {
        window.style.display = 'flex';
        setTimeout(() => {
            window.classList.add('open');
            scrollToBottom();
        }, 10);
        textInput.focus();
        if (messages.children.length === 0) {
            loadMessages();
            if (messages.children.length === 0) {
                addInitialMessages();
            }
        }
    }

    function addInitialMessages() {
        options.initialMessages.forEach((message, index) => {
            setTimeout(() => {
                addMessage(message, false, index === options.initialMessages.length - 1);
            }, index * 500);
        });
    }

    function closeChat() {
        window.classList.remove('open');
        setTimeout(() => {
            window.style.display = 'none';
        }, 300);
    }

    let hoverTimeout;

    widget.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(openChat, 300);
    });

    widget.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(closeChat, 500);
    });

    window.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
    });

    window.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(closeChat, 500);
    });

    icon.addEventListener('click', () => {
        if (!window.classList.contains('open')) {
            openChat();
        } else {
            closeChat();
        }
    });

    loadMessages();
})();