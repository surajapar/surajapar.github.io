document.addEventListener('DOMContentLoaded', () => {
            
    /* =========================================
       1. Theme Toggle (Light/Dark Mode)
    ========================================= */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const htmlElement = document.documentElement;

    // Check local storage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    // Toggle function
    const toggleTheme = () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            htmlElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
    };

    themeToggleBtn.addEventListener('click', toggleTheme);
    themeToggleMobileBtn.addEventListener('click', toggleTheme);


    /* =========================================
       2. Mobile Menu Toggle
    ========================================= */
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = mobileBtn.querySelector('i');

    function toggleMenu() {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
        if (mobileMenu.classList.contains('hidden')) {
            menuIcon.classList.replace('ph-x', 'ph-list');
        } else {
            menuIcon.classList.replace('ph-list', 'ph-x');
        }
    }

    mobileBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));


    /* =========================================
       3. Navbar Scroll Effect (Glassmorphism)
    ========================================= */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-md');
            navbar.classList.remove('py-4');
            navbar.classList.add('py-3');
        } else {
            navbar.classList.remove('shadow-md');
            navbar.classList.remove('py-3');
            navbar.classList.add('py-4');
        }
    });


    /* =========================================
       4. Scroll Reveal Animation
    ========================================= */
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: unobserve if you only want it to animate once
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));


    /* =========================================
       5. Hero Typing Effect
    ========================================= */
    const typingElement = document.getElementById('typing-effect');
    if (typingElement) {
        const phrases = ["Cyber Defender", "Security Researcher", "Ethical Hacker", "Penetration Tester"];
        let phraseIndex = 0;
        let letterIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentPhrase = phrases[phraseIndex];
            let displayText = '';
            
            if (isDeleting) {
                displayText = currentPhrase.substring(0, letterIndex - 1);
                letterIndex--;
            } else {
                displayText = currentPhrase.substring(0, letterIndex + 1);
                letterIndex++;
            }

            typingElement.textContent = displayText;

            let typeSpeed = isDeleting ? 75 : 150;

            if (!isDeleting && letterIndex === currentPhrase.length) {
                typeSpeed = 2000; // Pause at the end of word
                isDeleting = true;
            } else if (isDeleting && letterIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 300; // Pause before typing next word
            }

            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 150);
    }

    /* =========================================
       6. Fetch Medium Blog Posts (Manual XML Parsing)
    ========================================= */
    const blogContainer = document.getElementById('blog-container');
    const mediumFeedUrl = 'https://medium.com/feed/@surajapar';
    
    // Using AllOrigins as a reliable CORS proxy to get the raw XML
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(mediumFeedUrl)}`;

    // Format Date Helper
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    fetch(proxyUrl)
        .then(response => {
            if (response.ok) return response.json();
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            // data.contents contains the raw XML string from Medium
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, "text/xml");
            
            // Get all <item> tags (which represent individual articles)
            const items = Array.from(xmlDoc.querySelectorAll("item"));

            if (items.length > 0) {
                blogContainer.innerHTML = ''; // Clear loading skeletons
                
                // Limit to 3 posts
                const posts = items.slice(0, 3);
                
                posts.forEach(post => {
                    // Extract basic elements
                    const title = post.querySelector("title")?.textContent || "Untitled";
                    const link = post.querySelector("link")?.textContent || "#";
                    const pubDate = post.querySelector("pubDate")?.textContent || new Date().toISOString();
                    
                    // Medium stores the full HTML body in <content:encoded>
                    const contentEncoded = post.getElementsByTagNameNS("*", "encoded");
                    let contentHtml = "";
                    if (contentEncoded.length > 0) {
                        contentHtml = contentEncoded[0].textContent;
                    } else {
                        // Fallback to <description> if <content:encoded> is missing
                        const description = post.querySelector("description");
                        if (description) contentHtml = description.textContent;
                    }

                    // Extract the first image from the HTML content for the thumbnail
                    let imageUrl = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'; // Fallback cyber image
                    const imgRegex = /<img[^>]+src="([^">]+)"/;
                    const match = contentHtml.match(imgRegex);
                    if (match) {
                        imageUrl = match[1];
                    }

                    // Strip HTML tags to create a clean text excerpt
                    let tempDiv = document.createElement("div");
                    tempDiv.innerHTML = contentHtml;
                    const excerpt = (tempDiv.textContent || tempDiv.innerText || "")
                        .replace(/\s+/g, ' ')
                        .trim()
                        .substring(0, 120) + '...';

                    // Extract categories (tags)
                    const categories = Array.from(post.querySelectorAll("category"))
                        .slice(0, 2)
                        .map(cat => cat.textContent);
                        
                    const tags = categories.map(tag => 
                        `<span class="bg-slate-100 dark:bg-slate-800 text-brand-light dark:text-brand-dark px-2 py-1 rounded text-xs font-mono border border-slate-200 dark:border-slate-700">${tag}</span>`
                    ).join('');

                    const cardHtml = `
                        <a href="${link}" target="_blank" class="flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden hover:-translate-y-2 transition-transform duration-300 group">
                            <div class="h-48 overflow-hidden relative">
                                <div class="absolute inset-0 bg-brand-light/10 dark:bg-brand-dark/20 group-hover:bg-transparent transition-colors z-10"></div>
                                <img src="${imageUrl}" alt="${title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                            </div>
                            <div class="p-6 flex flex-col flex-1">
                                <div class="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                                    <span><i class="ph ph-calendar-blank"></i> ${formatDate(pubDate)}</span>
                                </div>
                                <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-light dark:group-hover:text-brand-dark transition-colors line-clamp-2">${title}</h3>
                                <p class="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 flex-1">${excerpt}</p>
                                <div class="flex flex-wrap gap-2 mt-auto">
                                    ${tags}
                                </div>
                            </div>
                        </a>
                    `;
                    blogContainer.innerHTML += cardHtml;
                });
            } else {
                blogContainer.innerHTML = `<p class="text-slate-500 dark:text-slate-400 col-span-full">No articles found at the moment. Please check back later.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching blog posts:', error);
            blogContainer.innerHTML = `<p class="text-red-500 col-span-full">Failed to load articles. You can visit <a href="${mediumFeedUrl}" class="underline" target="_blank">my Medium profile</a> directly.</p>`;
        });


    /* =========================================
       7. Footer Year
    ========================================= */
    document.getElementById('year').textContent = new Date().getFullYear();
});