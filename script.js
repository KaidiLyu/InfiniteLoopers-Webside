document.addEventListener("DOMContentLoaded", () => {
    // Language Toggle
    const btnLanguage = document.querySelector(".btn-language")
    const btnLanguageMobile = document.querySelector(".btn-language-mobile")
    const languageIndicator = document.querySelector(".language-indicator")
    let currentLanguage = localStorage.getItem("language") || "en"
  
    // Set initial language
    setLanguage(currentLanguage)
  
    // Language toggle event listeners
    if (btnLanguage) {
      btnLanguage.addEventListener("click", toggleLanguage)
    }
  
    if (btnLanguageMobile) {
      btnLanguageMobile.addEventListener("click", toggleLanguage)
    }
  
    function toggleLanguage() {
      currentLanguage = currentLanguage === "en" ? "zh" : "en"
      localStorage.setItem("language", currentLanguage)
      setLanguage(currentLanguage)
    }
  
    function setLanguage(lang) {
      if (languageIndicator) {
        languageIndicator.textContent = lang.toUpperCase()
      }
  
      // Update all translatable elements
      const elements = document.querySelectorAll("[data-i18n]")
      elements.forEach((el) => {
        const key = el.getAttribute("data-i18n")
        if (translations[lang] && translations[lang][key]) {
          el.textContent = translations[lang][key]
        }
      })
    }
  
    // Mobile Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle")
    const mobileMenu = document.querySelector(".mobile-menu")
  
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("active")
  
        // Toggle menu icon
        const icon = menuToggle.querySelector("i")
        if (icon) {
          if (mobileMenu.classList.contains("active")) {
            icon.classList.remove("lucide-menu")
            icon.classList.add("lucide-x")
          } else {
            icon.classList.remove("lucide-x")
            icon.classList.add("lucide-menu")
          }
        }
      })
    }
  
    // Smooth Scrolling
    const scrollLinks = document.querySelectorAll("[data-scroll-to]")
  
    scrollLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()
        const targetId = this.getAttribute("data-scroll-to")
        const targetElement = document.getElementById(targetId)
  
        if (targetElement) {
          // Close mobile menu if open
          if (mobileMenu && mobileMenu.classList.contains("active")) {
            mobileMenu.classList.remove("active")
            const icon = menuToggle.querySelector("i")
            if (icon) {
              icon.classList.remove("lucide-x")
              icon.classList.add("lucide-menu")
            }
          }
  
          // Scroll to target
          const navbarHeight = document.querySelector(".navbar").offsetHeight
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight
  
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      })
    })
  
    // Modal Functionality
    const modals = document.querySelectorAll(".modal")
    const modalTriggers = {
      loginModal: [document.getElementById("loginBtn"), document.getElementById("loginBtnMobile")],
      downloadModal: [document.getElementById("downloadBtn"), document.getElementById("downloadBtnCta")],
    }
  
    // Setup modal triggers
    for (const [modalId, triggers] of Object.entries(modalTriggers)) {
      const modal = document.getElementById(modalId)
  
      if (modal) {
        triggers.forEach((trigger) => {
          if (trigger) {
            trigger.addEventListener("click", () => {
              modal.classList.add("active")
            })
          }
        })
  
        // Close modal with close button
        const closeBtn = modal.querySelector(".modal-close")
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            modal.classList.remove("active")
          })
        }
  
        // Close modal when clicking outside
        modal.addEventListener("click", (e) => {
          if (e.target === modal) {
            modal.classList.remove("active")
          }
        })
      }
    }
  
    // Login Form Handling
    const loginForm = document.getElementById("loginForm")
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
  
        console.log("Login attempt with:", email, password)
        // Here you would typically send the data to a server
  
        // Close the modal after submission
        const modal = document.getElementById("loginModal")
        if (modal) {
          modal.classList.remove("active")
        }
      })
    }
  
    // Tab Functionality
    const tabButtons = document.querySelectorAll(".tab-btn")
  
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const tabId = this.getAttribute("data-tab")
        const tabContainer = this.closest(".download-tabs, .info-tabs")
  
        if (tabContainer) {
          // Deactivate all tabs
          const allTabs = tabContainer.querySelectorAll(".tab-pane")
          const allButtons = tabContainer.querySelectorAll(".tab-btn")
  
          allTabs.forEach((tab) => tab.classList.remove("active"))
          allButtons.forEach((btn) => btn.classList.remove("active"))
  
          // Activate selected tab
          this.classList.add("active")
          const selectedTab = document.getElementById(`${tabId}-tab`)
          if (selectedTab) {
            selectedTab.classList.add("active")
          }
        }
      })
    })
  
    // Video Player Functionality
    const videoElement = document.getElementById("demoVideo")
    const videoPlayBtn = document.querySelector(".video-play-btn")
    const videoOverlay = document.querySelector(".video-overlay")
  
    if (videoElement && videoPlayBtn && videoOverlay) {
      videoPlayBtn.addEventListener("click", toggleVideo)
  
      function toggleVideo() {
        if (videoElement.paused) {
          videoElement.play()
          videoOverlay.style.opacity = "0"
          videoPlayBtn.innerHTML = '<i class="lucide lucide-pause"></i>'
        } else {
          videoElement.pause()
          videoOverlay.style.opacity = "1"
          videoPlayBtn.innerHTML = '<i class="lucide lucide-play"></i>'
        }
      }
  
      // Auto-play video when scrolled into view
      const videoSection = document.querySelector(".video-section")
      if (videoSection) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && videoElement.paused) {
                // Try to play video when it comes into view
                videoElement
                  .play()
                  .then(() => {
                    videoOverlay.style.opacity = "0"
                    videoPlayBtn.innerHTML = '<i class="lucide lucide-pause"></i>'
                  })
                  .catch((error) => {
                    console.error("Video play failed:", error)
                    // Keep overlay visible if autoplay fails (common on mobile)
                  })
              } else if (!entry.isIntersecting && !videoElement.paused) {
                videoElement.pause()
                videoOverlay.style.opacity = "1"
                videoPlayBtn.innerHTML = '<i class="lucide lucide-play"></i>'
              }
            })
          },
          { threshold: 0.5 },
        )
  
        observer.observe(videoSection)
      }
    }
  })
  
  // Translations
  const translations = {
    en: {
      // Navbar
      features: "Features",
      howItWorks: "How It Works",
      team: "Team",
      login: "Login",
  
      // Hero Section
      heroTitle: "AI-Powered Nutritional Search",
      heroSubtitle:
        "Discover the nutritional content of any food with just a photo or text search, powered by advanced AI.",
      downloadNow: "Download Now",
      learnMore: "Learn More",
  
      // Features Section
      featuresTitle: "Key Features",
      feature1Title: "Image Recognition",
      feature1Description: "Take a photo of any food and get instant nutritional information.",
      feature2Title: "Natural Language Search",
      feature2Description: "Simply describe the food you're looking for in natural language.",
      feature3Title: "Comprehensive Data",
      feature3Description: "Get detailed nutritional breakdown including calories, macros, vitamins, and more.",
  
      // How it Works Section
      howItWorksTitle: "How It Works",
      step1: "Take a photo or enter a description",
      step2: "Our AI analyzes the content",
      step3: "Get detailed nutritional information",
      step4: "Make informed dietary choices",
  
      // Team Section
      teamTitle: "Meet Our Team",
      teamDescription: "The brilliant minds behind InfiniteLoopers",
  
      // CTA Section
      ctaTitle: "Ready to Transform Your Nutrition?",
      ctaSubtitle: "Download our app today and start making smarter food choices.",
      downloadApp: "Download App",
  
      // Footer
      copyright: "© 2025 InfiniteLoopers. All rights reserved.",
  
      // Video Section
      videoTitle: "See It In Action",
      videoSubtitle: "Watch how our app works in real time",
  
      // QR Code Modal
      scanToDownload: "Scan QR Code to Download",
      downloadOptions: "Download Options",
      downloadAndroid: "Download for Android",
      downloadIOS: "Download for iOS",
      closeModal: "Close",
  
      // Learn More Page
      backToHome: "Back to Home",
      learnMoreTitle: "Discover InfiniteLoopers",
      learnMoreDescription1:
        "InfiniteLoopers Nutritional Search App is an AI-powered mobile application that allows users to search for food items and receive comprehensive nutritional information instantly.",
      learnMoreDescription2:
        "Using advanced image recognition and natural language processing, our app helps users make informed choices about their diet with just a few taps.",
      viewGitHub: "View on GitHub",
      detailedFeatures: "Features",
      technicalInfo: "Technical Info",
      aboutTeam: "Team",
      feature1Detail: "Advanced image recognition identifies food items from photos with high accuracy",
      feature2Detail: "Natural language processing understands complex food queries",
      feature3Detail: "Comprehensive nutritional database covering thousands of food items",
      feature4Detail: "Personalized recommendations based on your dietary preferences",
      techStack: "Technology Stack",
      aiModels: "AI Models",
      aiModelsDetail: "Custom-trained image recognition and NLP models",
      dataProcessing: "Data Processing",
      dataProcessingDetail: "Real-time data analysis with edge computing for fast results",
      apiIntegration: "API Integration",
      apiIntegrationDetail: "Integrated with comprehensive nutritional databases",
      teamDescription:
        "Our team consists of five passionate developers from the University of South Carolina who are dedicated to making nutritional information more accessible.",
    },
    zh: {
      // 导航栏
      features: "核心功能",
      howItWorks: "工作原理",
      team: "团队成员",
      login: "登录",
  
      // 英雄区域
      heroTitle: "AI驱动的营养搜索",
      heroSubtitle: "通过照片或文字搜索，借助先进的AI技术，即刻了解任何食物的营养成分。",
      downloadNow: "立即下载",
      learnMore: "了解更多",
  
      // 功能区域
      featuresTitle: "核心功能",
      feature1Title: "图像识别",
      feature1Description: "拍摄任何食物的照片，立即获取营养信息。",
      feature2Title: "自然语言搜索",
      feature2Description: "只需用自然语言描述您要查找的食物。",
      feature3Title: "全面数据",
      feature3Description: "获取详细的营养分析，包括热量、宏量营养素、维生素等。",
  
      // 工作原理区域
      howItWorksTitle: "工作原理",
      step1: "拍照或输入描述",
      step2: "AI分析内容",
      step3: "获取详细营养信息",
      step4: "做出明智的饮食选择",
  
      // 团队区域
      teamTitle: "团队成员",
      teamDescription: "InfiniteLoopers背后的优秀团队",
  
      // 行动召唤区域
      ctaTitle: "准备改变您的营养方式？",
      ctaSubtitle: "今天就下载我们的应用，开始做出更明智的食物选择。",
      downloadApp: "下载应用",
  
      // 页脚
      copyright: "© 2025 InfiniteLoopers. 保留所有权利。",
  
      // 视频区域
      videoTitle: "实际操作演示",
      videoSubtitle: "观看我们的应用实时工作",
  
      // 二维码模态框
      scanToDownload: "扫描二维码下载",
      downloadOptions: "下载选项",
      downloadAndroid: "下载安卓版",
      downloadIOS: "下载iOS版",
      closeModal: "关闭",
  
      // 了解更多页面
      backToHome: "返回首页",
      learnMoreTitle: "探索 InfiniteLoopers",
      learnMoreDescription1:
        "InfiniteLoopers营养搜索应用是一款AI驱动的移动应用，允许用户搜索食品项目并立即获取全面的营养信息。",
      learnMoreDescription2:
        "通过先进的图像识别和自然语言处理技术，我们的应用帮助用户只需几次点击即可对饮食做出明智的选��。",
      viewGitHub: "在GitHub上查看",
      detailedFeatures: "功能详情",
      technicalInfo: "技术信息",
      aboutTeam: "关于团队",
      feature1Detail: "先进的图像识别技术可以高精度识别照片中的食物",
      feature2Detail: "自然语言处理理解复杂的食物查询",
      feature3Detail: "全面的营养数据库覆盖数千种食物",
      feature4Detail: "基于您的饮食偏好提供个性化推荐",
      techStack: "技术栈",
      aiModels: "AI模型",
      aiModelsDetail: "定制训练的图像识别和NLP模型",
      dataProcessing: "数据处理",
      dataProcessingDetail: "使用边缘计算进行实时数据分析，以获得快速结果",
      apiIntegration: "API集成",
      apiIntegrationDetail: "与全面的营养数据库集成",
      teamDescription: "我们的团队由来自南卡罗来纳大学的五位充满热情的开发人员组成，他们致力于使营养信息更加易于获取。",
    },
  }
  
  