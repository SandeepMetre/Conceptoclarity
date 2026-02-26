// ========================================
// Paper Data - SSLC Question Papers
// Loaded from external JSON so admin interface can manage
// ========================================
let papers = [];

// fetch JSON on load
fetch('papers.json')
    .then(response => response.json())
    .then(data => {
        papers = data;
        renderPapers(papers);
        setupEventListeners();
        updatePageMetadata();
    })
    .catch(err => {
        console.error('Failed to load papers.json', err);
        // fallback: no papers
        renderPapers([]);
        setupEventListeners();
        updatePageMetadata();
    });

// remove old constant declaration


// ========================================
// DOM Elements
// ========================================
const papersContainer = document.getElementById('papersContainer');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

let currentFilter = 'all';

// initialization is handled after papers.json is fetched at the top of the file

// ========================================
// Render Papers to DOM
// ========================================
function renderPapers(papersToRender) {
    if (papersToRender.length === 0) {
        papersContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <p style="color: var(--text-light); font-size: 18px;">No papers found matching your criteria.</p>
            </div>
        `;
        return;
    }

    papersContainer.innerHTML = papersToRender.map(paper => createPaperCard(paper)).join('');
}

// ========================================
// Create Individual Paper Card
// ========================================
function createPaperCard(paper) {
    return `
        <article class="paper-card">
            <h3>${escapeHtml(paper.name)}</h3>
            <div class="paper-meta">
                <span class="paper-badge">${paper.subject}</span>
                <span style="color: var(--text-light);">📚 ${paper.difficulty}</span>
            </div>
            <p class="paper-description">${escapeHtml(paper.description)}</p>
            <div class="download-links">
                <a href="${paper.questionFile}" download class="download-btn question" title="Download Question Paper">
                    <span>📄</span> Questions
                </a>
                <a href="${paper.answerFile}" download class="download-btn answer" title="Download Answer Key">
                    <span>✓</span> Answers
                </a>
            </div>
        </article>
    `;
}

// ========================================
// Setup Event Listeners
// ========================================
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilter);
    });

    // Contact form submission
    contactForm.addEventListener('submit', handleFormSubmit);
}

// ========================================
// Handle Search
// ========================================
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    let filtered = papers.filter(paper => {
        return paper.name.toLowerCase().includes(searchTerm) ||
               paper.subject.toLowerCase().includes(searchTerm) ||
               paper.description.toLowerCase().includes(searchTerm);
    });

    if (currentFilter !== 'all') {
        filtered = filtered.filter(paper => 
            paper.subject.toLowerCase() === currentFilter.toLowerCase()
        );
    }

    renderPapers(filtered);
}

// ========================================
// Handle Filter
// ========================================
function handleFilter(e) {
    const filterValue = e.target.dataset.filter;
    currentFilter = filterValue;

    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    // Filter papers
    let filtered = papers;
    if (filterValue !== 'all') {
        filtered = papers.filter(paper => 
            paper.subject.toLowerCase() === filterValue.toLowerCase()
        );
    }

    // Apply search term if any
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(paper => {
            return paper.name.toLowerCase().includes(searchTerm) ||
                   paper.subject.toLowerCase().includes(searchTerm) ||
                   paper.description.toLowerCase().includes(searchTerm);
        });
    }

    renderPapers(filtered);
}

// ========================================
// Handle Contact Form Submission
// ========================================
function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validate form
    if (!name || !email || !message) {
        showFormMessage('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address', 'error');
        return;
    }

    // In a real application, you would send this data to a server
    // For now, we'll just show a success message and simulate sending
    console.log('Form Data:', { name, email, message });

    // Simulate form submission (replace with actual API call)
    simulateFormSubmission(name, email, message);
}

// ========================================
// Simulate Form Submission
// ========================================
function simulateFormSubmission(name, email, message) {
    // Disable button during submission
    const submitBtn = contactForm.querySelector('.submit-button');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Simulate network delay
    setTimeout(() => {
        showFormMessage(
            `Thank you, ${escapeHtml(name)}! Your message has been received. We'll get back to you soon.`,
            'success'
        );

        // Reset form
        contactForm.reset();

        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Clear message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }, 1000);
}

// ========================================
// Show Form Message
// ========================================
function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    // Auto-hide error after 5 seconds
    if (type === 'error') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// ========================================
// Email Validation
// ========================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========================================
// Escape HTML to Prevent XSS
// ========================================
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ========================================
// Update Page Metadata (for SEO)
// ========================================
function updatePageMetadata() {
    // Update meta description based on page content
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute(
            'content',
            `Karnataka SSLC Question Papers with Answer Keys by Vivek Swamy - Access ${papers.length} SSLC papers including previous year papers, model papers, and preparatory exams for Science, Mathematics, English, Social Science and more. Free PDF download.`
        );
    }
}

// ========================================
// Analytics - Track downloads (optional)
// ========================================
function trackDownload(paperName, type) {
    // This can be used to track which papers are being downloaded
    // You can send this data to Google Analytics or your own server
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download', {
            'file_name': paperName,
            'file_type': type
        });
    }
    console.log(`Downloaded: ${paperName} (${type})`);
}

// Add download tracking to links
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('download-btn')) {
        const card = e.target.closest('.paper-card');
        const paperName = card.querySelector('h3').textContent;
        const type = e.target.classList.contains('question') ? 'questions' : 'answers';
        trackDownload(paperName, type);
    }
});

// ========================================
// Keyboard Navigation
// ========================================
document.addEventListener('keydown', (e) => {
    // Allow Escape key to clear search
    if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        handleSearch({ target: searchInput });
    }
});

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});
