document.addEventListener('DOMContentLoaded', () => {

    /* --- 0. Data Binding dari U_CONFIG --- */
    if (typeof U_CONFIG !== 'undefined') {
        // Cover
        document.getElementById('config-cover-title').innerHTML = U_CONFIG.cover.title;
        document.getElementById('config-child-name').innerHTML = U_CONFIG.cover.childName;
        document.getElementById('cover').style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%), url('${U_CONFIG.cover.backgroundUrl}')`;
        document.getElementById('config-bg-music').src = U_CONFIG.cover.musicUrl;
        document.getElementById('bg-music').load();

        // Theme Backgrounds
        if (U_CONFIG.theme) {
            const bgPrimary = U_CONFIG.theme.bgPrimary;
            if (bgPrimary) {
                const isUrl = bgPrimary.startsWith('http') || bgPrimary.startsWith('www') || bgPrimary.startsWith('data:image');
                const mainEl = document.getElementById('main-content');
                if (isUrl) {
                    mainEl.style.backgroundImage = `url('${bgPrimary}')`;
                    mainEl.style.backgroundSize = 'cover';
                    mainEl.style.backgroundPosition = 'center';
                    mainEl.style.backgroundAttachment = 'fixed';
                } else {
                    mainEl.style.backgroundColor = bgPrimary;
                    mainEl.style.backgroundImage = 'none';
                }
            }
            if (U_CONFIG.theme.footerLogo && document.getElementById('config-footer-logo')) {
                const footerLogo = document.getElementById('config-footer-logo');
                footerLogo.src = U_CONFIG.theme.footerLogo;
                footerLogo.classList.remove('hidden');
            }
        }

        // Profile
        if (U_CONFIG.profile.intro && document.getElementById('config-profile-intro')) {
            document.getElementById('config-profile-intro').innerHTML = U_CONFIG.profile.intro.replace(/\n/g, '<br>');
        }
        document.getElementById('config-profile-img').src = U_CONFIG.profile.photoUrl;
        document.getElementById('config-profile-nickname').innerHTML = U_CONFIG.cover.childName;
        document.getElementById('config-profile-name').innerHTML = U_CONFIG.profile.name;
        document.getElementById('config-profile-parents').innerHTML = U_CONFIG.profile.parents;

        // Event
        document.getElementById('config-event-title').innerHTML = U_CONFIG.event.title;
        document.getElementById('config-event-date').innerHTML = U_CONFIG.event.date;
        document.getElementById('config-event-time').innerHTML = U_CONFIG.event.time;
        document.getElementById('config-event-loc').innerHTML = U_CONFIG.event.location;
        document.getElementById('config-event-map').href = U_CONFIG.event.mapUrl;

        // Gallery
        const galleryContainer = document.getElementById('config-gallery-container');
        let galleryHtml = '';
        U_CONFIG.galleryFiles.forEach(imgUrl => {
            galleryHtml += `<img src="${imgUrl}" alt="Gallery" class="gallery-item scroll-anim delay-100">`;
        });
        galleryContainer.innerHTML = galleryHtml;

        // Digital Gift Rendering
        const giftContainer = document.getElementById('config-gift-container');
        let giftHtml = '';
        U_CONFIG.digitalGift.forEach(gift => {
            giftHtml += `
                <div class="gift-card scroll-anim">
                    <h3 class="bank-name">${gift.bank}</h3>
                    <p class="account-number">${gift.accNumber}</p>
                    <p class="account-name">${gift.accName}</p>
                    <button class="btn-copy" data-copy="${gift.accNumber}">Salin Nomor Rekening</button>
                </div>
            `;
        });
        giftContainer.innerHTML = giftHtml;

        // Closing Text
        if (U_CONFIG.closingText && document.getElementById('config-closing-text')) {
            document.getElementById('config-closing-text').innerHTML = U_CONFIG.closingText;
        }
    }


    /* --- 1. URL Parameter Parsing (?to=Name) --- */
    const urlParams = new URLSearchParams(window.location.search);
    const guestNameParam = urlParams.get('to');
    const guestNameEl = document.getElementById('guest-name');
    const rsvpNameInput = document.getElementById('rsvp-name');

    let guestName = "Teman & Kerabat";
    if (guestNameParam) {
        guestName = decodeURIComponent(guestNameParam.replace(/\+/g, ' '));
    }

    if (guestNameEl) guestNameEl.textContent = guestName;
    if (rsvpNameInput && guestNameParam) rsvpNameInput.value = guestName;

    /* --- 2. Cover & Audio Control --- */
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const btnOpen = document.getElementById('btn-open-invitation');
    const bgMusic = document.getElementById('bg-music');
    const audioControlBtn = document.getElementById('audio-control');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');

    let isPlaying = false;

    btnOpen.addEventListener('click', () => {
        cover.style.transform = 'translateY(-100vh)';
        cover.style.opacity = '0';

        setTimeout(() => {
            cover.classList.add('hidden');
            mainContent.classList.remove('hidden');
            document.querySelectorAll('.scroll-anim').forEach(el => observer.observe(el));
        }, 1000);

        bgMusic.play().then(() => {
            isPlaying = true;
            audioControlBtn.classList.remove('hidden');
            iconPlay.classList.add('hidden');
            iconPause.classList.remove('hidden');
        }).catch((err) => {
            isPlaying = false;
            audioControlBtn.classList.remove('hidden');
            iconPlay.classList.remove('hidden');
            iconPause.classList.add('hidden');
        });
    });

    audioControlBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            iconPause.classList.add('hidden');
            iconPlay.classList.remove('hidden');
        } else {
            bgMusic.play();
            iconPlay.classList.add('hidden');
            iconPause.classList.remove('hidden');
        }
        isPlaying = !isPlaying;
    });

    /* --- 3. Scroll Animation Observer --- */
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    }, observerOptions);

    /* --- 4. Countdown Timer --- */
    const targetDateStr = (typeof U_CONFIG !== 'undefined') ? U_CONFIG.event.targetDate : "2026-12-30T08:00:00";
    const targetDate = new Date(targetDateStr).getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById('cd-days').innerText = "00";
            document.getElementById('cd-hours').innerText = "00";
            document.getElementById('cd-mins').innerText = "00";
            document.getElementById('cd-secs').innerText = "00";
            return;
        }
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('cd-days').innerText = days.toString().padStart(2, '0');
        document.getElementById('cd-hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('cd-mins').innerText = mins.toString().padStart(2, '0');
        document.getElementById('cd-secs').innerText = secs.toString().padStart(2, '0');
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    /* --- 5. Lightbox for Media Showcase --- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lbClose = document.querySelector('.lightbox-close');
    const lbPrev = document.querySelector('.lightbox-prev');
    const lbNext = document.querySelector('.lightbox-next');
    let currentImageIndex = 0;

    // We bind after gallery generated
    setTimeout(() => {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentImageIndex = index;
                lightboxImg.src = galleryItems[currentImageIndex].src;
                lightbox.classList.add('active');
            });
        });

        lbPrev.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : galleryItems.length - 1;
            lightboxImg.src = galleryItems[currentImageIndex].src;
        });

        lbNext.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex < galleryItems.length - 1) ? currentImageIndex + 1 : 0;
            lightboxImg.src = galleryItems[currentImageIndex].src;
        });
    }, 100);

    const closeLightbox = () => lightbox.classList.remove('active');
    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg && e.target !== lbPrev && e.target !== lbNext) closeLightbox();
    });

    /* --- 6. Toast & Copy to Clipboard --- */
    const toast = document.getElementById('toast');
    let toastTimeout;
    function showToast(msg) {
        if (msg) toast.innerText = msg;
        toast.className = 'toast show';
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => { toast.className = 'toast hidden'; }, 3000);
    }

    setTimeout(() => {
        const copyBtns = document.querySelectorAll('.btn-copy');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const copyText = btn.getAttribute('data-copy');
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(copyText).then(() => showToast('Teks berhasil disalin!'));
                }
            });
        });
    }, 100);

    /* --- 7. RSVP Form --- */
    const rsvpForm = document.getElementById('rsvp-form');
    const guestbookList = document.getElementById('guestbook-list');

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('rsvp-name').value;
        const attendance = document.getElementById('rsvp-attendance').value;
        const msg = document.getElementById('rsvp-message').value;

        let badgeClass = 'badge-present';
        if (attendance === 'Tidak Hadir') badgeClass = 'badge-absent';
        if (attendance === 'Masih Ragu') badgeClass = 'badge-doubt';

        const newItem = document.createElement('div');
        newItem.className = 'guest-msg-item scroll-anim show';
        newItem.innerHTML = `
            <p class="guest-name">${name} <span class="badge ${badgeClass}">${attendance}</span></p>
            <p class="guest-msg">${msg}</p>
            <p class="guest-time">Baru saja</p>
        `;
        guestbookList.insertBefore(newItem, guestbookList.firstChild);

        document.getElementById('rsvp-attendance').value = '';
        document.getElementById('rsvp-message').value = '';
        showToast('Terima kasih atas ucapan Anda!');
    });
});
