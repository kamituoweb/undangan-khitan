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
            galleryFiles: [
                processImageUrl(document.getElementById('gal-1').value),
                processImageUrl(document.getElementById('gal-2').value),
                processImageUrl(document.getElementById('gal-3').value)
            ].filter(g => g.trim() !== ""),
            digitalGift: [
                {
                    bank: document.getElementById('bank-1').value,
                    accNumber: document.getElementById('acc-num-1').value,
                    accName: document.getElementById('acc-name-1').value
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
