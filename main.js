// Configuration objects
const config = {
  animations: {
    scroll: {
      distance: "50px",
      origin: "bottom",
      duration: 1000,
    },
    swiper: {
      slidesPerView: 3,
      spaceBetween: 20,
      loop: true,
      // Add responsive breakpoints
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 15
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    }
  },
  validation: {
    username: {
      pattern: /^[a-zA-Z0-9_]{3,20}$/,
      message: "Username must be 3-20 characters and contain only letters, numbers, and underscores"
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address"
    },
    password: {
      pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      message: "Password must be at least 8 characters and contain letters, numbers, and special characters"
    }
  }
};

// Navigation functionality
class Navigation {
  constructor() {
    this.menuBtn = document.getElementById("menu-btn");
    this.navLinks = document.getElementById("nav-links");
    this.menuBtnIcon = this.menuBtn?.querySelector("i");
    this.init();
  }

  init() {
    if (this.menuBtn && this.navLinks && this.menuBtnIcon) {
      this.menuBtn.addEventListener("click", this.toggleMenu.bind(this));
      this.navLinks.addEventListener("click", this.closeMenu.bind(this));
      
      // Close menu on escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.closeMenu();
      });
    }
  }

  toggleMenu() {
    this.navLinks.classList.toggle("open");
    const isOpen = this.navLinks.classList.contains("open");
    this.menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
    
    // Add/remove scroll lock on body
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  closeMenu() {
    this.navLinks.classList.remove("open");
    this.menuBtnIcon.setAttribute("class", "ri-menu-line");
    document.body.style.overflow = "";
  }
}

// Form handling
class RegistrationForm {
  constructor() {
    this.form = document.getElementById("registrationForm");
    this.inputs = {
      username: document.getElementById("username"),
      email: document.getElementById("email"),
      password: document.getElementById("password")
    };
    this.init();
  }

  init() {
    if (!this.form) {
      console.error("Registration form not found");
      return;
    }

    // Add input validation listeners
    Object.entries(this.inputs).forEach(([field, input]) => {
      input.addEventListener("input", this.debounce(() => {
        this.validateField(field, input.value);
      }, 300));
    });

    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  validateField(field, value) {
    const validation = config.validation[field];
    const isValid = validation.pattern.test(value);
    const errorElement = document.getElementById(`${field}-error`);
    
    if (errorElement) {
      errorElement.textContent = isValid ? "" : validation.message;
    }
    
    return isValid;
  }

  validateForm() {
    return Object.entries(this.inputs).every(([field, input]) => 
      this.validateField(field, input.value)
    );
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    if (!this.validateForm()) {
      this.showMessage("Please fix the errors before submitting", "error");
      return;
    }

    try {
      // Show loading state
      this.form.querySelector("button[type=submit]").disabled = true;
      
      // In a real app, this would be an API call
      await this.simulateAPICall();

      const userData = {
        username: this.inputs.username.value,
        email: this.inputs.email.value,
        registeredAt: new Date().toISOString()
      };

      // Store in localStorage (demo only - in production use proper backend storage)
      localStorage.setItem("userRegistration", JSON.stringify(userData));
      
      this.showMessage("Registration successful!", "success");
      this.form.reset();
      
    } catch (error) {
      console.error("Registration error:", error);
      this.showMessage("Registration failed. Please try again.", "error");
      
    } finally {
      this.form.querySelector("button[type=submit]").disabled = false;
    }
  }

  showMessage(message, type = "info") {
    const messageElement = document.getElementById("form-message") || 
      this.createMessageElement();
    
    messageElement.textContent = message;
    messageElement.className = `message message--${type}`;
    
    // Auto-hide success messages
    if (type === "success") {
      setTimeout(() => {
        messageElement.textContent = "";
      }, 5000);
    }
  }

  createMessageElement() {
    const messageElement = document.createElement("div");
    messageElement.id = "form-message";
    this.form.appendChild(messageElement);
    return messageElement;
  }

  // Utility function to prevent excessive validation calls
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  simulateAPICall() {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Animation handling
class Animations {
  static initScrollReveal() {
    if (typeof ScrollReveal !== "function") return;

    const sr = ScrollReveal();
    const options = config.animations.scroll;

    // Header animations
    const headerElements = [
      { selector: ".header__image img", options: { ...options, origin: "right" } },
      { selector: ".header__content h2", options: { ...options, delay: 500 } },
      { selector: ".header__content h1", options: { ...options, delay: 1000 } },
      { selector: ".header__content .section__description", options: { ...options, delay: 1500 } },
      { selector: ".header__form form", options: { ...options, delay: 2000 } }
    ];

    headerElements.forEach(({ selector, options }) => {
      sr.reveal(selector, options);
    });

    // About and choose section animations
    sr.reveal(".about__card", { ...options, interval: 500 });
    sr.reveal(".choose__image img", { ...options, origin: "left" });
    sr.reveal(".choose__content .section__header", { ...options, delay: 500 });
    sr.reveal(".choose__content .section__description", { ...options, delay: 1000 });
    sr.reveal(".choose__card", { duration: 1000, delay: 1500, interval: 500 });

    // Subscribe section animations
    sr.reveal(".subscribe__image img", { ...options, origin: "right" });
    sr.reveal(".subscribe__content .section__header", { ...options, delay: 500 });
    sr.reveal(".subscribe__content .section__description", { ...options, delay: 1000 });
    sr.reveal(".subscribe__content form", { ...options, delay: 1500 });
  }

  static initSwiper() {
    if (typeof Swiper !== "function") return;
    return new Swiper(".swiper", config.animations.swiper);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Navigation();
  new RegistrationForm();
  Animations.initScrollReveal();
  Animations.initSwiper();
});