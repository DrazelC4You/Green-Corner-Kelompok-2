/* =========================================================
   GREEN CORNER — FINAL JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MOBILE NAVIGATION
    ========================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const navbar = document.querySelector(".navbar");
    const nav = document.querySelector(".navbar nav");

    const setMenu = (open) => {
        if (!navbar || !menuToggle) return;

        navbar.classList.toggle("menu-open", open);
        if (nav) nav.classList.toggle("open", open);

        menuToggle.setAttribute("aria-expanded", String(open));

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars", !open);
            icon.classList.toggle("fa-xmark", open);
        }
    };

    if (menuToggle && navbar && nav) {

        menuToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            setMenu(!navbar.classList.contains("menu-open"));
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => setMenu(false));
        });

        document.addEventListener("click", (event) => {
            if (!navbar.contains(event.target)) {
                setMenu(false);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setMenu(false);
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 820) {
                setMenu(false);
            }
        });
    }

    /* =========================
       ACTIVE PAGE
    ========================= */

    const currentFile =
        window.location.pathname.split("/").pop().toLowerCase() || "index.html";

    document.querySelectorAll(".navbar a[href]").forEach(link => {

        const href = link.getAttribute("href");
        if (!href || href.startsWith("#")) return;

        const linkFile =
            href.split("/").pop().split("#")[0].toLowerCase();

        link.classList.toggle(
            "active",
            linkFile === currentFile ||
            (currentFile === "index.html" && linkFile === "home.html")
        );
    });

    /* =========================
       NAV UNDERLINE
       (garis tipis yang geser mulus
        mengikuti menu aktif/hover)
    ========================= */

    if (nav) {
        const navList = nav.querySelector("ul");

        if (navList && window.innerWidth > 820) {

            const underline = document.createElement("span");
            underline.className = "nav-underline";
            navList.appendChild(underline);

            const moveUnderline = (link) => {
                if (!link) {
                    underline.style.opacity = "0";
                    return;
                }
                const linkRect = link.getBoundingClientRect();
                const listRect = navList.getBoundingClientRect();
                underline.style.width = linkRect.width + "px";
                underline.style.left = (linkRect.left - listRect.left) + "px";
                underline.style.opacity = "1";
            };

            const getActiveLink = () => navList.querySelector("a.active");

            moveUnderline(getActiveLink());

            navList.querySelectorAll("a").forEach(link => {
                link.addEventListener("mouseenter", () => moveUnderline(link));
            });

            navList.addEventListener("mouseleave", () => moveUnderline(getActiveLink()));

            window.addEventListener("resize", () => moveUnderline(getActiveLink()));
        }
    }

    /* =========================
       FAQ ACCORDION
    ========================= */

    document.querySelectorAll(".faq-question").forEach(question => {

        question.setAttribute("aria-expanded", "false");

        question.addEventListener("click", () => {

            const item = question.closest(".faq-item");
            if (!item) return;

            const wasOpen = item.classList.contains("active");

            document.querySelectorAll(".faq-item").forEach(other => {
                other.classList.remove("active");

                const button = other.querySelector(".faq-question");
                if (button) {
                    button.setAttribute("aria-expanded", "false");
                    const icon = button.querySelector("i");
                    if (icon) {
                        icon.classList.remove("fa-minus");
                        icon.classList.add("fa-plus");
                    }
                }
            });

            if (!wasOpen) {
                item.classList.add("active");
                question.setAttribute("aria-expanded", "true");

                const icon = question.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-plus");
                    icon.classList.add("fa-minus");
                }
            }
        });
    });

    /* =========================
       SCROLL REVEAL
    ========================= */

    /* =========================
       SCROLL REVEAL
       (otomatis pasang class fade-up
        ke elemen berulang di semua halaman,
        dengan efek stagger per kelompok)
    ========================= */

    const autoRevealGroups = [
        ".section-title",
        ".info-card",
        ".plant-card",
        ".care-card",
        ".tool-card",
        ".result-card",
        ".highlight-card",
        ".learning-card",
        ".team-card",
        ".gallery-item",
        ".step-item",
        ".faq-item",
        ".note-card",
        ".plant-detail",
        ".closing-info-card",
        ".timeline-item",
        ".objective-item",
        ".plant-result-card",
        ".progress-card"
    ];

    document.querySelectorAll(autoRevealGroups.join(",")).forEach(el => {
        el.classList.add("fade-up");
    });

    // stagger ringan per kelompok kartu yang sejajar (sibling)
    document.querySelectorAll(
        ".intro-cards, .plant-cards, .care-grid, .tools-grid, " +
        ".result-grid, .highlight-grid, .learning-grid, .team-grid, " +
        ".gallery-grid, .notes-grid, .closing-info-grid, .progress-grid"
    ).forEach(group => {
        Array.from(group.children).forEach((child, i) => {
            child.style.transitionDelay = (i % 4) * 0.09 + "s";
        });
    });

    const revealElements =
        document.querySelectorAll(".fade-in, .fade-up");

    if ("IntersectionObserver" in window && revealElements.length) {

        const observer = new IntersectionObserver((entries, obs) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    obs.unobserve(entry.target);
                }

            });

        }, {
            threshold: 0.12
        });

        revealElements.forEach(element => observer.observe(element));

    } else {
        revealElements.forEach(element => {
            element.classList.add("show");
        });
    }

    /* =========================
       PLANT PROGRESS BARS
       (mengisi progress bar saat
        section terlihat di layar)
    ========================= */

    document.querySelectorAll(".progress-bar-fill").forEach(bar => {

        const target = bar.getAttribute("data-progress") || "0";

        if ("IntersectionObserver" in window) {

            const progressObserver = new IntersectionObserver((entries, obs) => {

                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        bar.style.width = target + "%";
                        obs.unobserve(bar);
                    }
                });

            }, { threshold: 0.4 });

            progressObserver.observe(bar);

        } else {
            bar.style.width = target + "%";
        }
    });

    /* =========================
       COUNTER ANGKA
       (menghitung naik saat elemen
        [data-count-to] terlihat di layar)
    ========================= */

    const counters = document.querySelectorAll("[data-count-to]");

    if (counters.length) {

        const animateCounter = (el) => {
            const target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
            const duration = 900;
            const start = performance.now();

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                el.textContent = Math.round(progress * target);
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };

        if ("IntersectionObserver" in window) {

            const counterObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(el => counterObserver.observe(el));

        } else {
            counters.forEach(el => {
                el.textContent = el.getAttribute("data-count-to");
            });
        }
    }

    /* =========================
       INDEX LOADING SCREEN
    ========================= */

    const loadingScreen = document.getElementById("loading-screen");
    const mainContent = document.getElementById("main-content");

    if (loadingScreen && mainContent) {

        const finishLoading = () => {
            loadingScreen.classList.add("loaded");
            mainContent.classList.add("loaded");

            setTimeout(() => {
                loadingScreen.remove();
            }, 650);
        };

        window.addEventListener("load", () => {
            setTimeout(finishLoading, 1450);
        });

        /* Fallback jika browser terlalu lambat */
        setTimeout(finishLoading, 3500);
    }

    /* =========================
       GROWTH PROGRESS BAR
       (bar tipis di atas yang "tumbuh"
        mengikuti scroll halaman)
    ========================= */

    const growthBar = document.createElement("div");
    growthBar.className = "growth-progress-bar";
    document.body.prepend(growthBar);

    const updateGrowthBar = () => {
        const scrollTop = window.scrollY;
        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        growthBar.style.width = percent + "%";
    };

    window.addEventListener("scroll", updateGrowthBar, { passive: true });
    window.addEventListener("resize", updateGrowthBar);
    updateGrowthBar();

    /* =========================
       BACK TO TOP BUTTON
    ========================= */

    const backToTop = document.createElement("button");
    backToTop.className = "back-to-top";
    backToTop.setAttribute("aria-label", "Kembali ke atas");
    backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    const toggleBackToTop = () => {
        backToTop.classList.toggle("show", window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* =========================
       GALLERY LIGHTBOX
       (dokumentasi.html — siap dipakai
        begitu foto asli ditambahkan)
    ========================= */

    const galleryImages = document.querySelectorAll(".gallery-image");

    if (galleryImages.length) {

        const overlay = document.createElement("div");
        overlay.className = "lightbox-overlay";
        overlay.innerHTML =
            '<button class="lightbox-close" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>' +
            '<div class="lightbox-box"></div>';
        document.body.appendChild(overlay);

        const lightboxBox = overlay.querySelector(".lightbox-box");
        const closeBtn = overlay.querySelector(".lightbox-close");

        const openLightbox = (imageEl) => {
            lightboxBox.innerHTML = imageEl.innerHTML;
            overlay.classList.add("open");
            document.body.classList.add("lightbox-locked");
        };

        const closeLightbox = () => {
            overlay.classList.remove("open");
            document.body.classList.remove("lightbox-locked");
        };

        galleryImages.forEach(img => {
            img.style.cursor = "zoom-in";
            img.addEventListener("click", () => openLightbox(img));
        });

        closeBtn.addEventListener("click", closeLightbox);

        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) closeLightbox();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeLightbox();
        });
    }

    /* =========================
       UPLOAD FOTO
       (klik kotak foto untuk pilih gambar
        dari perangkat, disimpan di localStorage
        browser ini — dikompres dulu biar hemat)
    ========================= */

    const photoSlots = document.querySelectorAll(".photo-upload-slot");

    if (photoSlots.length) {

        const PHOTO_PREFIX = "greencorner-photo-";
        const MAX_DIMENSION = 900;
        const JPEG_QUALITY = 0.72;

        const compressImage = (file) => new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onerror = () => reject(new Error("Gagal membaca file"));

            reader.onload = () => {
                const img = new Image();

                img.onerror = () => reject(new Error("File bukan gambar yang valid"));

                img.onload = () => {
                    let width = img.width;
                    let height = img.height;

                    if (width > height && width > MAX_DIMENSION) {
                        height = Math.round(height * (MAX_DIMENSION / width));
                        width = MAX_DIMENSION;
                    } else if (height > MAX_DIMENSION) {
                        width = Math.round(width * (MAX_DIMENSION / height));
                        height = MAX_DIMENSION;
                    }

                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    canvas.getContext("2d").drawImage(img, 0, 0, width, height);

                    resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
                };

                img.src = reader.result;
            };

            reader.readAsDataURL(file);
        });

        const loadSavedPhoto = (id) => {
            try {
                return localStorage.getItem(PHOTO_PREFIX + id);
            } catch (e) {
                return null;
            }
        };

        const showPhoto = (slot, dataUrl) => {
            let img = slot.querySelector(".photo-upload-img");
            if (!img) {
                img = document.createElement("img");
                img.className = "photo-upload-img";
                img.alt = slot.getAttribute("data-photo-label") || "Foto Green Corner";
                slot.appendChild(img);
            }
            img.src = dataUrl;
            slot.classList.add("has-photo");
        };

        const setupSlot = (slot) => {
            const id = slot.getAttribute("data-photo-id");
            if (!id) return;

            const saved = loadSavedPhoto(id);
            const defaultSrc = slot.getAttribute("data-photo-default");

            if (saved) {
                showPhoto(slot, saved);
            } else if (defaultSrc) {
                // Belum ada foto upload-an sendiri di browser ini —
                // pakai foto asli bawaan (assets/) biar semua pengunjung
                // langsung lihat foto beneran, bukan ikon kosong.
                showPhoto(slot, defaultSrc);
            }

            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.className = "photo-upload-input";
            slot.appendChild(input);

            const hint = document.createElement("div");
            hint.className = "photo-upload-hint";
            slot.appendChild(hint);

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.className = "photo-upload-remove";
            removeBtn.setAttribute("aria-label", "Hapus foto");
            removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            slot.appendChild(removeBtn);

            const setHintText = () => {
                const label = slot.classList.contains("has-photo") ? "Ganti" : "Unggah";
                hint.innerHTML =
                    '<i class="fa-solid fa-camera"></i><span>Klik untuk ' + label + ' foto</span>';
            };
            setHintText();

            // Slot foto di Dokumentasi ada di dalam ".gallery-image" yang
            // sudah punya fitur lightbox (klik = perbesar foto). Supaya
            // tidak bentrok: kalau sudah ada foto, klik kotak = perbesar
            // (lightbox), ganti foto lewat overlay "Klik untuk Ganti foto".
            // Kalau belum ada foto, atau di luar galeri dokumentasi,
            // klik kotak langsung buka pilih file.
            const inLightboxGallery = !!slot.closest(".gallery-image");

            slot.addEventListener("click", (event) => {
                if (removeBtn.contains(event.target)) return;
                if (inLightboxGallery && slot.classList.contains("has-photo")) return;
                input.click();
            });

            hint.addEventListener("click", (event) => {
                event.stopPropagation();
                input.click();
            });

            input.addEventListener("change", async () => {
                const file = input.files && input.files[0];
                if (!file) return;

                try {
                    const dataUrl = await compressImage(file);

                    try {
                        localStorage.setItem(PHOTO_PREFIX + id, dataUrl);
                    } catch (e) {
                        alert("Penyimpanan browser penuh. Hapus beberapa foto lama dulu, lalu coba lagi.");
                        return;
                    }

                    showPhoto(slot, dataUrl);
                    setHintText();

                } catch (err) {
                    alert("Gagal memuat gambar. Coba file lain.");
                }
            });

            removeBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                try {
                    localStorage.removeItem(PHOTO_PREFIX + id);
                } catch (e) { /* localStorage tidak tersedia, lewati saja */ }

                const img = slot.querySelector(".photo-upload-img");
                if (img) img.remove();

                slot.classList.remove("has-photo");
                setHintText();
            });
        };

        photoSlots.forEach(setupSlot);
    }

    /* =========================
       CHATBOT (rule-based, tanpa API)
       — hanya aktif di halaman FAQ
    ========================= */

    const chatbotForm = document.getElementById("chatbot-form");

    if (chatbotForm) {

        const chatInput = document.getElementById("chatbot-input");
        const chatMessages = document.getElementById("chatbot-messages");

        /* =========================
           AI OPSIONAL (Gemini API)
           Key disimpan di localStorage
           browser ini saja, tidak pernah
           dikirim ke server manapun selain
           langsung ke Google.
        ========================= */

        const GEMINI_KEY_STORAGE = "greencorner-gemini-key";
        const GEMINI_MODEL = "gemini-3.6-flash";

        const aiToggleBtn = document.getElementById("chatbot-ai-toggle");
        const aiPanel = document.getElementById("chatbot-ai-panel");
        const aiKeyInput = document.getElementById("chatbot-ai-key-input");
        const aiKeySaveBtn = document.getElementById("chatbot-ai-key-save");
        const aiKeyClearBtn = document.getElementById("chatbot-ai-key-clear");
        const chatbotNote = document.getElementById("chatbot-note");

        const getGeminiKey = () => {
            try {
                return localStorage.getItem(GEMINI_KEY_STORAGE) || "";
            } catch (e) {
                return "";
            }
        };

        const updateChatbotNote = () => {
            if (!chatbotNote) return;

            if (getGeminiKey()) {
                chatbotNote.innerHTML =
                    '*Mode AI aktif (Gemini). Kalau AI gagal dihubungi, otomatis kembali ke jawaban kata kunci.';
            } else {
                chatbotNote.innerHTML =
                    '*Mode kata kunci sederhana, belum pakai AI. Klik ' +
                    '<i class="fa-solid fa-wand-magic-sparkles"></i> di atas untuk aktifkan AI (opsional, gratis).';
            }
        };

        if (aiToggleBtn && aiPanel) {
            aiToggleBtn.addEventListener("click", () => {
                aiPanel.hidden = !aiPanel.hidden;
                if (!aiPanel.hidden && aiKeyInput) aiKeyInput.value = getGeminiKey();
            });
        }

        if (aiKeySaveBtn && aiKeyInput) {
            aiKeySaveBtn.addEventListener("click", () => {
                const key = aiKeyInput.value.trim();
                if (!key) return;

                try {
                    localStorage.setItem(GEMINI_KEY_STORAGE, key);
                } catch (e) { /* localStorage tidak tersedia, lewati saja */ }

                if (aiPanel) aiPanel.hidden = true;
                updateChatbotNote();
            });
        }

        if (aiKeyClearBtn) {
            aiKeyClearBtn.addEventListener("click", () => {
                try {
                    localStorage.removeItem(GEMINI_KEY_STORAGE);
                } catch (e) { /* localStorage tidak tersedia, lewati saja */ }

                if (aiKeyInput) aiKeyInput.value = "";
                updateChatbotNote();
            });
        }

        updateChatbotNote();

        // Panggil Gemini API langsung dari browser (CORS didukung Google).
        // Kalau gagal (key kosong/salah, tidak ada internet, limit habis),
        // pemanggil (submit handler di bawah) otomatis pakai findAnswer().
        const askGemini = async (question, apiKey) => {
            const systemContext =
                "Kamu adalah asisten chatbot untuk website sekolah bernama Green Corner, " +
                "proyek penanaman Bougainvillea dan Zinnia oleh Kelompok 2 SMK Negeri 2 Purwokerto. " +
                "Jawab singkat (maksimal 3 kalimat), ramah, dan hanya seputar tanaman, berkebun, " +
                "atau proyek ini. Kalau pertanyaan di luar topik itu, arahkan dengan sopan kembali ke topik Green Corner.";

            const url =
                "https://generativelanguage.googleapis.com/v1beta/models/" +
                GEMINI_MODEL + ":generateContent";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: question }] }],
                    systemInstruction: { parts: [{ text: systemContext }] },
                    generationConfig: {
                        // "minimal" = mode tercepat Gemini, cocok buat
                        // chatbot jawaban singkat kayak gini (gak perlu
                        // mikir panjang kayak soal matematika/koding).
                        thinkingConfig: { thinkingLevel: "minimal" }
                    }
                })
            });

            if (!response.ok) {
                throw new Error("Gemini request gagal: " + response.status);
            }

            const data = await response.json();
            const text = data &&
                data.candidates && data.candidates[0] &&
                data.candidates[0].content && data.candidates[0].content.parts &&
                data.candidates[0].content.parts[0] &&
                data.candidates[0].content.parts[0].text;

            if (!text) throw new Error("Gemini tidak mengembalikan jawaban");

            return text.trim();
        };

        // Database jawaban: setiap entri punya daftar kata kunci.
        // Skor dihitung dari jumlah kata kunci yang cocok pada
        // pertanyaan pengguna; skor tertinggi yang dijawab.
        const chatDatabase = [
            {
                keywords: ["apa itu green corner", "green corner itu apa", "green corner"],
                answer: "Green Corner adalah proyek penanaman dan perawatan tanaman yang kami lakukan sebagai bagian dari kegiatan proyek kolaborasi kelompok."
            },
            {
                keywords: ["tujuan", "manfaat proyek"],
                answer: "Tujuan proyek ini adalah memberikan pengalaman langsung menanam dan merawat tanaman, sekaligus melatih kerja sama dan tanggung jawab anggota kelompok."
            },
            {
                keywords: ["tanaman apa", "jenis tanaman", "tanaman yang digunakan"],
                answer: "Tanaman yang digunakan dalam proyek Green Corner adalah Bougainvillea dan Zinnia."
            },
            {
                keywords: ["alat", "peralatan"],
                answer: "Alat yang digunakan antara lain sekop kecil, gunting, ember, alat penyiram, dan alat pengaduk."
            },
            {
                keywords: ["bahan"],
                answer: "Bahan yang digunakan antara lain tanah, pupuk, bibit tanaman, dan air."
            },
            {
                keywords: ["proses tanam", "cara menanam", "cara tanam", "menanamnya"],
                answer: "Prosesnya dimulai dari menyiapkan media tanam, mengisi wadah dengan tanah, menanam bibit, menyiram, memberi pupuk, lalu melakukan pengamatan dan perawatan rutin."
            },
            {
                keywords: ["kenapa dirawat", "mengapa dirawat", "perlu dirawat"],
                answer: "Perawatan diperlukan agar tanaman mendapat air dan nutrisi yang cukup, serta agar kita bisa memantau kondisi dan perkembangannya."
            },
            {
                keywords: ["belajar apa", "pelajaran", "yang dipelajari"],
                answer: "Dari proyek ini kami belajar proses menanam dan merawat tanaman, serta belajar bekerja sama, bertanggung jawab, dan membagi tugas dalam kelompok."
            },
            {
                keywords: ["berhenti setelah tanam", "selesai setelah tanam"],
                answer: "Tidak. Setelah ditanam, tanaman tetap perlu disiram, diamati, dan dirawat secara berkala sesuai kebutuhannya."
            },
            {
                keywords: ["hasil", "hasil utama", "hasil proyek"],
                answer: "Hasil utama proyek ini adalah tanaman yang berhasil ditanam dan dirawat, serta pengalaman kerja sama tim dalam melakukan kegiatan penanaman."
            },
            {
                keywords: ["cara merawat bougainvillea", "merawat bougenville", "bougainvillea"],
                answer: "Bougainvillea perlu sinar matahari yang cukup, disiram secukupnya, dipangkas bagian yang kering, dan dipupuk sesuai kebutuhan agar tumbuh optimal."
            },
            {
                keywords: ["cara merawat zinnia", "merawat zinnia", "zinnia"],
                answer: "Zinnia membutuhkan sinar matahari yang cukup dan penyiraman teratur sesuai kondisi media tanam agar bunganya tumbuh cerah dan sehat."
            },
            {
                keywords: ["beda bougainvillea zinnia", "perbedaan tanaman", "bougainvillea vs zinnia", "zinnia vs bougainvillea"],
                answer: "Bedanya, Bougainvillea adalah tanaman semak berbunga kertas yang tahan panas dan disiram secukupnya, sedangkan Zinnia adalah bunga musiman yang butuh penyiraman lebih teratur. Detail lengkapnya ada di tabel perbandingan pada halaman Tanaman."
            },
            {
                keywords: ["siram", "penyiraman", "jadwal siram"],
                answer: "Penyiraman dilakukan secukupnya sesuai kondisi media tanam — jangan sampai terlalu basah atau terlalu kering. Cek status penyiraman tiap tanaman di halaman Tanaman."
            },
            {
                keywords: ["pupuk", "pemupukan"],
                answer: "Pemberian pupuk dilakukan sesuai kebutuhan untuk membantu pertumbuhan tanaman, biasanya di sela masa perawatan rutin."
            },
            {
                keywords: ["kelompok", "anggota", "siapa saja"],
                answer: "Proyek Green Corner ini dikerjakan oleh Kelompok 2 dari SMK Negeri 2 Purwokerto."
            },
            {
                keywords: ["halo", "hai", "hi", "pagi", "siang", "malam"],
                answer: "Halo juga! 👋 Silakan tanya apa saja seputar Green Corner, Bougainvillea, atau Zinnia."
            },
            {
                keywords: ["terima kasih", "makasih", "thanks"],
                answer: "Sama-sama! Senang bisa membantu 🌱"
            }
        ];

        const fallbackAnswer =
            "Maaf, aku belum menemukan jawaban yang cocok untuk pertanyaan itu. " +
            "Coba tanyakan seputar tanaman, cara merawat, alat/bahan, atau proyek Green Corner ya!";

        const findAnswer = (question) => {

            const q = question.toLowerCase();
            let bestScore = 0;
            let bestAnswer = null;

            chatDatabase.forEach(entry => {
                let score = 0;
                entry.keywords.forEach(keyword => {
                    if (q.includes(keyword)) {
                        score += keyword.split(" ").length;
                    }
                });
                if (score > bestScore) {
                    bestScore = score;
                    bestAnswer = entry.answer;
                }
            });

            return bestAnswer || fallbackAnswer;
        };

        const appendMessage = (text, who) => {
            const msg = document.createElement("div");
            msg.className = "chatbot-msg " + who;
            msg.textContent = text;
            chatMessages.appendChild(msg);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return msg;
        };

        chatbotForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const question = chatInput.value.trim();
            if (!question) return;

            appendMessage(question, "user");
            chatInput.value = "";

            const typingMsg = appendMessage("mengetik...", "typing");
            const apiKey = getGeminiKey();

            if (apiKey) {
                askGemini(question, apiKey)
                    .then(answer => {
                        typingMsg.remove();
                        appendMessage(answer, "bot");
                    })
                    .catch(() => {
                        // Gemini gagal (offline, key salah, limit habis, dll)
                        // — diam-diam kembali ke jawaban kata kunci lokal.
                        typingMsg.remove();
                        appendMessage(findAnswer(question), "bot");
                    });
            } else {
                setTimeout(() => {
                    typingMsg.remove();
                    appendMessage(findAnswer(question), "bot");
                }, 550);
            }
        });
    }

    /* =========================
       MONITORING TANAMAN + LOGIN ANGGOTA
       (pakai Supabase: database asli + login asli,
        menggantikan localStorage. Hanya aktif di
        tanaman.html — cek window.supabase karena
        library-nya cuma dimuat di halaman itu)
    ========================= */

    const monitorCards = document.querySelectorAll(".monitor-card");

    if (monitorCards.length && window.supabase) {

        // >>> WAJIB DIISI — ambil dari dashboard Supabase:
        //     Project Settings > API > Project URL & anon public key
        const SUPABASE_URL = "https://aoxmngtntxfpfrusntac.supabase.co";
        const SUPABASE_ANON_KEY = "sb_publishable_pNIj4s6E7RiVdKkRV_Yodw_JTZQzjSZ";

        const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const loginForm = document.getElementById("monitor-login-form");
        const loginEmail = document.getElementById("monitor-login-email");
        const loginPassword = document.getElementById("monitor-login-password");
        const loginError = document.getElementById("monitor-login-error");
        const loggedInBox = document.getElementById("monitor-logged-in");
        const loggedInName = document.getElementById("monitor-logged-in-name");
        const logoutBtn = document.getElementById("monitor-logout-btn");

        const setEditable = (editable) => {
            monitorCards.forEach(card => {
                card.querySelectorAll("select, input[type='checkbox'], textarea").forEach(el => {
                    el.disabled = !editable;
                });
                card.classList.toggle("monitor-readonly", !editable);
            });
        };

        const formatWaktu = (iso) => {
            if (!iso) return "-";
            try {
                return new Date(iso).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short"
                });
            } catch (e) {
                return iso;
            }
        };

        const loadMonitoringData = async () => {
            const { data, error } = await sb.from("monitoring").select("*");

            if (error) {
                console.error("Gagal ambil data monitoring:", error.message);
                return;
            }

            data.forEach(row => {
                const card = document.querySelector(
                    '.monitor-card[data-plant="' + String(row.nama_tanaman).toLowerCase() + '"]'
                );
                if (!card) return;

                const statusSelect = card.querySelector(".monitor-status-select");
                const wateredCheckbox = card.querySelector(".monitor-watered-checkbox");
                const noteText = card.querySelector(".monitor-note-text");
                const metaText = card.querySelector(".monitor-meta-text");

                if (statusSelect) statusSelect.value = row.kondisi || "Baik";
                if (wateredCheckbox) wateredCheckbox.checked = !!row.disiram_hari_ini;
                if (noteText) noteText.value = row.catatan || "";

                if (metaText) {
                    metaText.textContent =
                        "Terakhir diupdate: " + formatWaktu(row.diupdate_pada) +
                        (row.diupdate_oleh ? " oleh " + row.diupdate_oleh : "");
                }
            });
        };

        const saveMonitoringRow = async (plantLabel, updates) => {
            const { data: userData } = await sb.auth.getUser();
            const user = userData && userData.user;
            const nama =
                (user && user.user_metadata && user.user_metadata.nama) ||
                (user && user.email) ||
                "Anggota";

            const { error } = await sb.from("monitoring")
                .update(Object.assign({}, updates, {
                    diupdate_oleh: nama,
                    diupdate_pada: new Date().toISOString()
                }))
                .eq("nama_tanaman", plantLabel);

            if (error) {
                alert("Gagal simpan perubahan: " + error.message);
            } else {
                loadMonitoringData();
            }
        };

        monitorCards.forEach(card => {
            const h3 = card.querySelector("h3");
            const plantLabel = h3 ? h3.textContent.trim() : card.getAttribute("data-plant");

            const statusSelect = card.querySelector(".monitor-status-select");
            const wateredCheckbox = card.querySelector(".monitor-watered-checkbox");
            const noteText = card.querySelector(".monitor-note-text");

            if (statusSelect) {
                statusSelect.addEventListener("change", () => {
                    saveMonitoringRow(plantLabel, { kondisi: statusSelect.value });
                });
            }

            if (wateredCheckbox) {
                wateredCheckbox.addEventListener("change", () => {
                    saveMonitoringRow(plantLabel, { disiram_hari_ini: wateredCheckbox.checked });
                });
            }

            if (noteText) {
                noteText.addEventListener("change", () => {
                    saveMonitoringRow(plantLabel, { catatan: noteText.value });
                });
            }
        });

        /* --- LOGIN / LOGOUT --- */

        if (loginForm) {
            loginForm.addEventListener("submit", async (event) => {
                event.preventDefault();
                if (loginError) loginError.textContent = "";

                const { error } = await sb.auth.signInWithPassword({
                    email: loginEmail.value.trim(),
                    password: loginPassword.value
                });

                if (error) {
                    // Tampilkan pesan asli dari Supabase (bukan cuma
                    // "salah") biar ketahuan kalau penyebabnya beda,
                    // misalnya akun belum "confirmed".
                    if (loginError) loginError.textContent = error.message;
                } else {
                    loginPassword.value = "";
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => sb.auth.signOut());
        }

        const applyAuthState = (session) => {
            const loggedIn = !!session;
            setEditable(loggedIn);

            if (loginForm) loginForm.hidden = loggedIn;
            if (loggedInBox) loggedInBox.hidden = !loggedIn;

            if (loggedInName && session) {
                loggedInName.textContent =
                    (session.user.user_metadata && session.user.user_metadata.nama) ||
                    session.user.email;
            }
        };

        sb.auth.onAuthStateChange((_event, session) => applyAuthState(session));

        // Muat data tanaman + cek status login saat halaman pertama dibuka
        loadMonitoringData();
        sb.auth.getSession().then(({ data }) => applyAuthState(data.session));
    }

});