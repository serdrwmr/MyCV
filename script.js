document.addEventListener('DOMContentLoaded', () => {
    // Yetenek slider kontrolü
    const yetenekEmojiler = document.querySelectorAll('.yetenek-emoji');
    const yetenekIsim = document.querySelector('.yetenek-isim');
    const yetenekIsimleri = ['JavaScript', 'Python', 'Java', 'HTML5', 'CSS3', 'Node.js'];
    const slider = document.querySelector('.yetenek-slider');
    const prevButton = document.querySelector('.slider-button.prev');
    const nextButton = document.querySelector('.slider-button.next');
    const yetenekler = document.querySelectorAll('.yetenekler');
    let currentIndex = 0;
    const emojiWidth = 300; // Emoji genişliği + gap
    const visibleEmojis = 3; // Görünür emoji sayısı
    const totalEmojis = yetenekEmojiler.length;

    function updateSlider() {
        // Emojileri konumlandır
        yetenekEmojiler.forEach((emoji, index) => {
            let position = index - currentIndex;
            
            // Sonsuz döngü için pozisyonu ayarla
            if (position < -Math.floor(totalEmojis / 2)) {
                position += totalEmojis;
            } else if (position > Math.floor(totalEmojis / 2)) {
                position -= totalEmojis;
            }

            const translateX = position * emojiWidth;
            emoji.style.transform = `translateX(${translateX}px)`;
            emoji.classList.remove('active', 'visible');
            
            // Görünür emojileri belirle
            if (Math.abs(position) <= 1) {
                emoji.classList.add('visible');
            }
            
            // Aktif emojiyi belirle (ortadaki)
            if (position === 0) {
                emoji.classList.add('active');
            }
        });

        // Aktif yeteneği göster
        yetenekler.forEach((yetenek, index) => {
            yetenek.classList.remove('active');
            if (index === currentIndex) {
                yetenek.classList.add('active');
                yetenekIsim.textContent = yetenek.querySelector('h3').textContent;
            }
        });

        // Butonları güncelle
        prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextButton.style.opacity = currentIndex >= totalEmojis - 1 ? '0.5' : '1';
    }

    function slideNext() {
        currentIndex = (currentIndex + 1) % totalEmojis;
        updateSlider();
    }

    function slidePrev() {
        currentIndex = (currentIndex - 1 + totalEmojis) % totalEmojis;
        updateSlider();
    }

    // Buton tıklamaları
    prevButton.addEventListener('click', slidePrev);
    nextButton.addEventListener('click', slideNext);

    // Emoji tıklamaları
    yetenekEmojiler.forEach((emoji, index) => {
        emoji.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });

    // Otomatik kaydırma
    let autoSlideInterval;
    function startAutoSlide() {
        autoSlideInterval = setInterval(slideNext, 2000); // 2 saniyede bir kaydır
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // Başlangıç durumu
    updateSlider();
    startAutoSlide();

    // Hamburger menü kontrolü
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Menü linklerine tıklandığında menüyü kapat
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Video kontrolleri
    const projeler = document.querySelectorAll('.proje');
    
    projeler.forEach(proje => {
        const video = proje.querySelector('.proje-video');
        
        proje.addEventListener('mouseenter', () => {
            video.currentTime = 0;
            video.play();
        });
        
        proje.addEventListener('mouseleave', () => {
            video.pause();
        });
    });

    // Smooth scroll ve aktif link takibi
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header[id]');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

    // Sayfa yüklendiğinde ve scroll edildiğinde aktif linki güncelle
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // Smooth scroll için
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 60,
                behavior: 'smooth'
            });
        });
    });

    // Scroll animasyonları için
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });

    // Arka plan video kontrolü
    const arkaplanVideo = document.getElementById('arkaplan-video');
    if (arkaplanVideo) {
        arkaplanVideo.play().catch(error => {
            console.log("Arka plan videosu otomatik oynatılamadı:", error);
        });
    }

    // Proje videoları kontrolü
    const projeVideolar = document.querySelectorAll('.proje-video');
    projeVideolar.forEach(video => {
        // Video container'a tıklandığında oynat/durdur
        const videoContainer = video.closest('.video-container');
        if (videoContainer) {
            // Video yüklendiğinde otomatik oynatmayı dene
            video.addEventListener('loadedmetadata', () => {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Video otomatik oynatılamadı:", error);
                    });
                }
            });

            // Video container'a tıklandığında oynat/durdur
            videoContainer.addEventListener('click', (e) => {
                // Eğer tıklama video kontrollerine yapıldıysa işlemi engelle
                if (e.target.classList.contains('proje-video')) {
                    return;
                }
                
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });

            // Hover efektleri
            videoContainer.addEventListener('mouseenter', () => {
                videoContainer.querySelector('.video-overlay').style.opacity = '0.3';
            });
            
            videoContainer.addEventListener('mouseleave', () => {
                videoContainer.querySelector('.video-overlay').style.opacity = '0.5';
            });
        }
    });

    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('.proje-video');
        
        container.addEventListener('mouseenter', () => {
            video.play();
        });
        
        container.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
}); 