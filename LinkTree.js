// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const linksSection = document.querySelector('.links-section');
    
    // Creating and appending the UI for adding new links
    const addLinkSection = document.createElement('div');
    addLinkSection.className = 'add-link-section';
    addLinkSection.innerHTML = `
        <h3 style="margin-bottom: 1rem;">Add New Link</h3>
        <div class="form-group">
            <input type="text" id="linkTitle" placeholder="Link Title" 
                   style="width: 100%; padding: 0.8rem; margin-bottom: 0.5rem; 
                          border: 2px solid #ccc; border-radius: 4px;">
            <input type="url" id="linkUrl" placeholder="Link URL (https://...)" 
                   style="width: 100%; padding: 0.8rem; margin-bottom: 0.5rem; 
                          border: 2px solid #ccc; border-radius: 4px;">
            <button onclick="addNewLink()" class="contact-button" 
                    style="width: 100%; margin-top: 0.5rem;">Add Link</button>
        </div>
    `;
    linksSection.appendChild(addLinkSection);

    // Loading existing links from localStorage if any
    loadLinks();
});

// Function to add a new link
window.addNewLink = function() {
    const titleInput = document.getElementById('linkTitle');
    const urlInput = document.getElementById('linkUrl');
    
    // Validating inputs
    if (!titleInput.value.trim() || !urlInput.value.trim()) {
        alert('Please fill in both title and URL fields');
        return;
    }

    if (!isValidUrl(urlInput.value)) {
        alert('Please enter a valid URL starting with http:// or https://');
        return;
    }

    // Creating new link element
    const newLink = createLinkElement(titleInput.value, urlInput.value);
    
    // Find or create links container
    let linksContainer = document.querySelector('.links');
    if (!linksContainer) {
        linksContainer = document.createElement('div');
        linksContainer.className = 'links';
        document.querySelector('.links-section').insertBefore(
            linksContainer, 
            document.querySelector('.social-icons')
        );
    }
    
    // Adding new link to container
    linksContainer.appendChild(newLink);
    
    // Save to localStorage
    saveLinks();
    
    // Clear inputs
    titleInput.value = '';
    urlInput.value = '';
};

// Function to create a link element
function createLinkElement(title, url) {
    const linkContainer = document.createElement('div');
    linkContainer.className = 'link-container';
    linkContainer.style.position = 'relative';
    linkContainer.style.display = 'flex';
    linkContainer.style.alignItems = 'center';
    linkContainer.style.marginBottom = '1rem';

    const link = document.createElement('a');
    link.href = url;
    link.textContent = title;
    link.target = "_blank";
    link.rel = "noopener";
    link.style.flex = '1';
    link.className = 'links a';
    
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '×';
    deleteButton.style.cssText = `
        position: absolute;
        right: -30px;
        background: #f44336;
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
    `;
    deleteButton.onclick = function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this link?')) {
            linkContainer.remove();
            saveLinks();
        }
    };

    linkContainer.appendChild(link);
    linkContainer.appendChild(deleteButton);
    
    return linkContainer;
}

// Function to validate URL
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Function to save links to localStorage
function saveLinks() {
    const links = [];
    document.querySelectorAll('.link-container a').forEach(link => {
        links.push({
            title: link.textContent,
            url: link.href
        });
    });
    localStorage.setItem('linktreeLinks', JSON.stringify(links));
}

// Function to load links from localStorage
function loadLinks() {
    const savedLinks = localStorage.getItem('linktreeLinks');
    if (savedLinks) {
        const links = JSON.parse(savedLinks);
        links.forEach(link => {
            const newLink = createLinkElement(link.title, link.url);
            let linksContainer = document.querySelector('.links');
            if (!linksContainer) {
                linksContainer = document.createElement('div');
                linksContainer.className = 'links';
                document.querySelector('.links-section').insertBefore(
                    linksContainer, 
                    document.querySelector('.social-icons')
                );
            }
            linksContainer.appendChild(newLink);
        });
    }
}