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
               6. Fetch Medium Blog Posts
            ========================================= */
            const blogContainer = document.getElementById('blog-container');
            const mediumFeedUrl = 'https://medium.com/feed/@surajapar';
            // Using rss2json API to convert Medium RSS to JSON
            const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(mediumFeedUrl)}`;

            // Helper to strip HTML tags from excerpts
            const stripHtml = (html) => {
                let doc = new DOMParser().parseFromString(html, 'text/html');
                return doc.body.textContent || "";
            };

            // Format Date
            const formatDate = (dateString) => {
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                return new Date(dateString).toLocaleDateString(undefined, options);
            };

            fetch(rss2jsonUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'ok' && data.items.length > 0) {
                        blogContainer.innerHTML = ''; // Clear skeletons
                        
                        // Limit to 3 posts
                        const posts = data.items.slice(0, 3);
                        
                        posts.forEach(post => {
                            // Medium sometimes doesn't provide a direct thumbnail in the rss2json parsing.
                            // We attempt to extract the first image from the content if thumbnail is empty.
                            let imageUrl = post.thumbnail;
                            if (!imageUrl) {
                                const imgRegex = /<img[^>]+src="([^">]+)"/;
                                const match = post.content.match(imgRegex);
                                imageUrl = match ? match[1] : 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'; // Fallback cyber image
                            }

                            const excerpt = stripHtml(post.description).substring(0, 120) + '...';
                            const tags = post.categories.slice(0, 2).map(tag => 
                                `<span class="bg-slate-100 dark:bg-slate-800 text-brand-light dark:text-brand-dark px-2 py-1 rounded text-xs font-mono border border-slate-200 dark:border-slate-700">${tag}</span>`
                            ).join('');

                            const cardHtml = `
                                <a href="${post.link}" target="_blank" class="flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden hover:-translate-y-2 transition-transform duration-300 group">
                                    <div class="h-48 overflow-hidden relative">
                                        <div class="absolute inset-0 bg-brand-light/10 dark:bg-brand-dark/20 group-hover:bg-transparent transition-colors z-10"></div>
                                        <img src="${imageUrl}" alt="${post.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                                    </div>
                                    <div class="p-6 flex flex-col flex-1">
                                        <div class="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                                            <span><i class="ph ph-calendar-blank"></i> ${formatDate(post.pubDate)}</span>
                                        </div>
                                        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-light dark:group-hover:text-brand-dark transition-colors line-clamp-2">${post.title}</h3>
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