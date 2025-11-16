document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling for Nav Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open after clicking a link
                if (mobileMenu.classList.contains('open')) {
                    toggleMobileMenu();
                }
            }
        });
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    const toggleMobileMenu = () => {
        mobileMenu.classList.toggle('open');
        mobileMenu.classList.toggle('hidden'); // Toggle visibility
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
        // Toggle aria-expanded attribute for accessibility
        const isExpanded = mobileMenu.classList.contains('open');
        mobileMenuButton.setAttribute('aria-expanded', isExpanded);
    };

    if (mobileMenuButton && mobileMenu && menuIcon && closeIcon) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
        // Close menu if clicking outside (optional)
        // document.addEventListener('click', (event) => {
        //     if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target) && mobileMenu.classList.contains('open')) {
        //         toggleMobileMenu();
        //     }
        // });
    } else {
        console.error("Mobile menu elements not found");
    }


    // --- Hero Typing Effect ---
    const typingElement = document.getElementById('typing-effect');
    if (typingElement) {
        const typingPhrases = [
            "Cyber Defender",
            "Security Researcher",
            "Ethical Hacker",
            "Penetration Tester",
        ];
        let phraseIndex = 0;
        let letterIndex = 0;
        let isDeleting = false;
        const typingSpeed = 150;
        const deletingSpeed = 75;
        const pauseDuration = 1500; // Reduced from 2000

        function type() {
            const currentPhrase = typingPhrases[phraseIndex];
            let displayText = '';

            if (isDeleting) {
                // Deleting
                displayText = currentPhrase.substring(0, letterIndex - 1);
                letterIndex--;
            } else {
                // Typing
                displayText = currentPhrase.substring(0, letterIndex + 1);
                letterIndex++;
            }

            typingElement.textContent = displayText;

            let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;

            if (!isDeleting && letterIndex === currentPhrase.length) {
                // Pause at end of phrase
                typeSpeed = pauseDuration;
                isDeleting = true;
            } else if (isDeleting && letterIndex === 0) {
                // Finished deleting, move to next phrase
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % typingPhrases.length;
                typeSpeed = typingSpeed; // Start typing next word immediately or add pause
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, typingSpeed); // Start the effect
    } else {
        console.error("Typing effect element not found");
    }


    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitButton = document.getElementById('submit-button');
    const formStatusDiv = document.getElementById('form-status');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    const clearErrors = () => {
        nameError.textContent = '';
        emailError.textContent = '';
        messageError.textContent = '';
        nameInput.classList.remove('error');
        emailInput.classList.remove('error');
        messageInput.classList.remove('error');
         formStatusDiv.innerHTML = ''; // Clear previous status messages
    };

    const showStatusMessage = (message, type) => {
        let iconSvg = '';
         let cssClass = '';

         if (type === 'success') {
             iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
             cssClass = 'form-success';
         } else if (type === 'error') {
             iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
             cssClass = 'form-error-submit';
         }

        formStatusDiv.innerHTML = `
            <div class="form-status-message ${cssClass}">
                ${iconSvg}
                <span>${message}</span>
            </div>`;
    };

     const validateForm = () => {
         clearErrors();
         let isValid = true;
         const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

         if (!nameInput.value.trim()) {
             nameError.textContent = 'Name is required';
             nameInput.classList.add('error');
             isValid = false;
         }
         if (!emailInput.value.trim()) {
             emailError.textContent = 'Email is required';
             emailInput.classList.add('error');
             isValid = false;
         } else if (!emailRegex.test(emailInput.value)) {
             emailError.textContent = 'Invalid email address';
             emailInput.classList.add('error');
             isValid = false;
         }
         if (!messageInput.value.trim()) {
             messageError.textContent = 'Message is required';
             messageInput.classList.add('error');
             isValid = false;
         }
         return isValid;
     };


    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearErrors();

            if (!validateForm()) {
                return;
            }

            // --- Show Loading State ---
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
             submitButton.innerHTML = `
                 <span class="loader"></span> Submitting...
             `;
            formStatusDiv.innerHTML = ''; // Clear previous status


            // --- Simulate API Call ---
            // Replace this with your actual fetch call to a backend endpoint
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Simulate success (in real app, check response status)
                const success = true; // Math.random() > 0.2; // Simulate occasional errors

                if (success) {
                    showStatusMessage('Message sent successfully!', 'success');
                    contactForm.reset(); // Clear form fields
                } else {
                    // Simulate an error
                     throw new Error("Simulated server error");
                }

            } catch (error) {
                console.error('Form submission failed:', error);
                showStatusMessage('Failed to send message. Please try again.', 'error');
            } finally {
                // Restore button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;

                 // Optionally clear status message after a few seconds
                 setTimeout(() => {
                     if (formStatusDiv.querySelector('.form-success')) { // Only clear success message automatically
                         formStatusDiv.innerHTML = '';
                     }
                 }, 5000); // Clear after 5 seconds
            }
        });

         // Clear errors on input
         [nameInput, emailInput, messageInput].forEach(input => {
             input.addEventListener('input', () => {
                 if (input.classList.contains('error')) {
                     const errorElement = document.getElementById(`${input.id}-error`);
                     if (errorElement) errorElement.textContent = '';
                     input.classList.remove('error');
                 }
             });
         });

    } else {
         console.error("Contact form element not found");
    }

    // --- Footer Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});