document.addEventListener('DOMContentLoaded', () => {

    // Helper untuk mengubah Link GDrive foto otomatis
    function processImageUrl(url) {
        if (!url || typeof url !== 'string') return url;
        let fileId = null;
        const regexD = /\/file\/d\/([a-zA-Z0-9_-]+)/;
        const matchD = url.match(regexD);
        if (matchD && matchD[1]) {
            fileId = matchD[1];
        } else if (url.includes('drive.google.com')) {
            const urlQuery = url.split('?')[1];
            if (urlQuery) {
                const urlParams = new URLSearchParams(urlQuery);
                if (urlParams.has('id')) fileId = urlParams.get('id');
            }
        }
        if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1080-h1920`;
        return url;
    }

    const generateBtn = document.getElementById('generate-btn');
    const outputArea = document.getElementById('output-area');
    const copyBtn = document.getElementById('copy-btn');
    const galleryFields = document.getElementById('gallery-fields');
    const addGalBtn = document.getElementById('add-gal-btn');

    // --- PRE-FILL DATA DARI CONFIG ---
    if (typeof U_CONFIG !== 'undefined') {
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el && val !== undefined) el.value = val;
        };

        // Theme
        setVal('theme-bg-primary', U_CONFIG.theme?.bgPrimary);
        setVal('theme-bg-secondary', U_CONFIG.theme?.bgSecondary);
        setVal('theme-footer-logo', U_CONFIG.theme?.footerLogo);

        // Cover
        setVal('cover-bg', U_CONFIG.cover?.backgroundUrl);
        setVal('cover-music', U_CONFIG.cover?.musicUrl);
        setVal('cover-title', U_CONFIG.cover?.title);
        setVal('cover-child', U_CONFIG.cover?.childName);

        // Profile
        setVal('prof-intro', U_CONFIG.profile?.intro);
        setVal('prof-name', U_CONFIG.profile?.name);
        setVal('prof-parents', U_CONFIG.profile?.parents);
        setVal('prof-photo', U_CONFIG.profile?.photoUrl);

        // Event
        setVal('event-title', U_CONFIG.event?.title);
        setVal('event-target', U_CONFIG.event?.targetDate);
        setVal('event-date', U_CONFIG.event?.date);
        setVal('event-time', U_CONFIG.event?.time);
        setVal('event-loc', U_CONFIG.event?.location ? U_CONFIG.event.location.replace(/<br>/g, '\n') : '');
        setVal('event-map', U_CONFIG.event?.mapUrl);

        // Closing
        setVal('closing-text', U_CONFIG.closingText ? U_CONFIG.closingText.replace(/<br>/g, '\n') : '');

        // Digital Gift
        if (U_CONFIG.digitalGift && U_CONFIG.digitalGift.length > 0) {
            setVal('bank-1', U_CONFIG.digitalGift[0].bank);
            setVal('acc-num-1', U_CONFIG.digitalGift[0].accNumber);
            setVal('acc-name-1', U_CONFIG.digitalGift[0].accName);
        }
        if (U_CONFIG.digitalGift && U_CONFIG.digitalGift.length > 1) {
            setVal('bank-2', U_CONFIG.digitalGift[1].bank);
            setVal('acc-num-2', U_CONFIG.digitalGift[1].accNumber);
            setVal('acc-name-2', U_CONFIG.digitalGift[1].accName);
        }
    }

    // --- RENDER GALLERY FIELDS ---
    function createGalleryInput(index, value = "") {
        const itemWrap = document.createElement('div');
        itemWrap.className = 'gal-group';

        const input = document.createElement('input');
        input.type = 'url';
        input.className = 'gal-input';
        input.placeholder = `URL Foto ${index}`;
        input.value = value;
        input.id = `gal-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-danger';
        removeBtn.innerText = 'Hapus';
        removeBtn.onclick = () => {
            itemWrap.remove();
        };

        itemWrap.appendChild(input);
        itemWrap.appendChild(removeBtn);
        return itemWrap;
    }

    function renderInitialGallery() {
        if (!galleryFields) return;
        galleryFields.innerHTML = '';

        let initialGalleries = [];
        if (typeof U_CONFIG !== 'undefined' && U_CONFIG.galleryFiles && U_CONFIG.galleryFiles.length > 0) {
            initialGalleries = U_CONFIG.galleryFiles;
        } else {
            // Default 3 fields placeholder if not set
            initialGalleries = [
                "https://placehold.co/400x400/ccc/333?text=Foto+1",
                "https://placehold.co/400x400/ccc/333?text=Foto+2",
                "https://placehold.co/400x400/ccc/333?text=Foto+3"
            ];
        }

        initialGalleries.forEach((url, i) => {
            galleryFields.appendChild(createGalleryInput(i + 1, url));
        });
    }

    renderInitialGallery();

    if (addGalBtn && galleryFields) {
        addGalBtn.addEventListener('click', () => {
            const currentInputsCount = galleryFields.querySelectorAll('.gal-input').length;
            galleryFields.appendChild(createGalleryInput(currentInputsCount + 1, ""));
        });
    }

    generateBtn.addEventListener('click', () => {
        const configObj = {
            theme: {
                bgPrimary: processImageUrl(document.getElementById('theme-bg-primary') ? document.getElementById('theme-bg-primary').value : '#f8fbff'),
                bgSecondary: processImageUrl(document.getElementById('theme-bg-secondary') ? document.getElementById('theme-bg-secondary').value : '#f0f7fc'),
                footerLogo: processImageUrl(document.getElementById('theme-footer-logo') ? document.getElementById('theme-footer-logo').value : '')
            },
            cover: {
                backgroundUrl: processImageUrl(document.getElementById('cover-bg').value),
                musicUrl: document.getElementById('cover-music').value,
                title: document.getElementById('cover-title').value,
                childName: document.getElementById('cover-child').value
            },
            profile: {
                intro: document.getElementById('prof-intro').value,
                name: document.getElementById('prof-name').value,
                parents: document.getElementById('prof-parents').value,
                photoUrl: processImageUrl(document.getElementById('prof-photo').value)
            },
            event: {
                title: document.getElementById('event-title').value,
                targetDate: document.getElementById('event-target').value,
                date: document.getElementById('event-date').value,
                time: document.getElementById('event-time').value,
                location: document.getElementById('event-loc').value.replace(/\n/g, '<br>'),
                mapUrl: document.getElementById('event-map').value
            },
            galleryFiles: Array.from(document.querySelectorAll('.gal-input'))
                .map(i => processImageUrl(i.value))
                .filter(g => g.trim() !== ""),
            digitalGift: [
                {
                    bank: document.getElementById('bank-1').value,
                    accNumber: document.getElementById('acc-num-1').value,
                    accName: document.getElementById('acc-name-1').value
                },
                {
                    bank: document.getElementById('bank-2') ? document.getElementById('bank-2').value : '',
                    accNumber: document.getElementById('acc-num-2') ? document.getElementById('acc-num-2').value : '',
                    accName: document.getElementById('acc-name-2') ? document.getElementById('acc-name-2').value : ''
                }
            ].filter(g => g.bank.trim() !== ""),
            closingText: document.getElementById('closing-text').value.replace(/\n/g, '<br>')
        };

        const configString = `const U_CONFIG = ${JSON.stringify(configObj, null, 4)};`;

        outputArea.textContent = configString;
        outputArea.style.display = 'block';
        copyBtn.style.display = 'inline-block';
    });

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(outputArea.textContent).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = "Berhasil Disalin!";
            copyBtn.style.background = "#27ae60";
            setTimeout(() => {
                copyBtn.innerText = originalText;
                copyBtn.style.background = "#3498db";
            }, 3000);
        });
    });

    // Guest Link Generator
    const btnGenLink = document.getElementById('generate-link-btn');
    const guestInput = document.getElementById('guest-input-name');
    const guestResult = document.getElementById('guest-result-link');

    btnGenLink.addEventListener('click', () => {
        let namesText = guestInput.value.trim();
        if (namesText === "") return;

        let names = namesText.split('\n');
        let baseUrl = window.location.href.split('admin.html')[0];
        if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

        let resultText = "";

        names.forEach(name => {
            let n = name.trim();
            if (n !== "") {
                let urlName = encodeURIComponent(n);
                // Menambahkan format simple sesuai permintaan
                let finalUrl = `${baseUrl}/?to=${urlName}`;
                resultText += `${finalUrl}\n`;
            }
        });

        guestResult.value = resultText.trim();
        guestResult.select();
        document.execCommand('copy');
        alert("Link berhasil dibuat dan disalin!");
    });
});
