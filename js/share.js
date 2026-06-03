document.addEventListener('DOMContentLoaded', () => {
    const btnGenLink = document.getElementById('generate-link-btn');
    const guestInput = document.getElementById('guest-input-name');
    const guestResult = document.getElementById('guest-result-link');

    btnGenLink.addEventListener('click', () => {
        let namesText = guestInput.value.trim();
        if (namesText === "") return;

        let names = namesText.split('\n');
        let baseUrl = window.location.href.split('share.html')[0];
        if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

        let resultText = "";

        names.forEach(name => {
            let n = name.trim();
            if (n !== "") {
                let urlName = encodeURIComponent(n);
                // Standard query param '?to=' will be appended
                let finalUrl = `${baseUrl}/?to=${urlName}`;

                // Format Broadcast message
                resultText += `Kepada Yth. Bapak/Ibu/Saudara/i: *${n}*\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada acara Tasyakuran Khitanan putra kami. Detail informasi dapat dilihat pada tautan undangan berikut:\n\n${finalUrl}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.\nTerima kasih.\n\n------------------------\n\n`;
            }
        });

        guestResult.value = resultText.trim();
        guestResult.select();

        // Copys the text gracefully across browsers
        if (navigator.clipboard) {
            navigator.clipboard.writeText(resultText.trim()).then(() => {
                alert("Semua pesan undangan berhasil dibuat dan disalin! Anda tinggal Buka WhatsApp lalu Paste/Tempel.");
            }).catch(ext => {
                document.execCommand('copy');
                alert("Pesan berhasil dibuat. Silakan Salin (Copy) secara manual dari kotak hasil di bawah.");
            });
        } else {
            document.execCommand('copy');
            alert("Semua pesan undangan berhasil dibuat dan disalin! Anda tinggal Buka WhatsApp lalu Paste/Tempel.");
        }
    });
});
