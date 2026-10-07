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
            if (!imageEl.querySelector("img")) return; // Jangan buka modal jika belum ada foto asli
            lightboxBox.innerHTML = imageEl.innerHTML;
            overlay.classList.add("open");
            document.body.classList.add("lightbox-locked");
        };

        const closeLightbox = () => {
            overlay.classList.remove("open");
            document.body.classList.remove("lightbox-locked");
        };

        galleryImages.forEach(img => {
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
       FOTO TANAMAN/DOKUMENTASI
       Foto statis dari folder assets/ saja.
       Tidak ada fitur upload dari browser sama sekali —
       baik pengunjung maupun anggota yang login tidak
       bisa mengganti foto lewat website. Foto hanya bisa
       diganti dengan mengedit file di folder assets/ dan
       atribut data-photo-default di HTML.
    ========================= */

    document.querySelectorAll(".photo-upload-slot").forEach(slot => {
        const defaultSrc = slot.getAttribute("data-photo-default");
        if (!defaultSrc) return; // belum ada foto asli, biarkan ikon placeholder

        const img = document.createElement("img");
        img.className = "photo-upload-img";
        img.alt = slot.getAttribute("data-photo-label") || "Foto Green Corner";
        img.src = defaultSrc;
        slot.appendChild(img);
        slot.classList.add("has-photo");
    });


    /* =========================
       CHATBOT (rule-based, tanpa API)
       — hanya aktif di halaman FAQ
    ========================= */

    const chatbotForm = document.getElementById("chatbot-form");

    if (chatbotForm) {

        const chatInput = document.getElementById("chatbot-input");
        const chatMessages = document.getElementById("chatbot-messages");

        /* =========================
           AI (Gemini API)
           Key ditanam langsung di sini —
           aktif otomatis buat semua pengunjung,
           tidak perlu isi apa-apa.
        ========================= */

        const GEMINI_API_KEY = "AQ.Ab8RN6L8R3mkQHC3C41MzgS8WBfAUB_SpV4kpRoMXnoVuqNntg";
        const GEMINI_MODEL = "gemini-3.6-flash";

        const chatbotNote = document.getElementById("chatbot-note");
        if (chatbotNote) {
            chatbotNote.textContent =
                "*Dijawab otomatis pakai AI. Kalau AI gagal dihubungi, otomatis kembali ke jawaban kata kunci.";
        }

        // Panggil Gemini API langsung dari browser.
        // Ditambahkan timeout 10 detik dan logging error agar mudah dilacak jika gagal.
        const askGemini = async (question, apiKey) => {
            const systemContext =
                "Kamu adalah asisten chatbot untuk website sekolah bernama Green Corner, " +
                "proyek penanaman Bougainvillea dan Zinnia oleh Kelompok 2 SMK Negeri 2 Purwokerto. " +
                "Jawab singkat (maksimal 3 kalimat), ramah, dan hanya seputar tanaman, berkebun, " +
                "atau proyek ini. Kalau pertanyaan di luar topik itu, arahkan dengan sopan kembali ke topik Green Corner.";

            const url =
                "https://generativelanguage.googleapis.com/v1beta/models/" +
                GEMINI_MODEL + ":generateContent";

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            try {
                const response = await fetch(url, {
                    method: "POST",
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json",
                        "x-goog-api-key": apiKey
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: question }] }],
                        systemInstruction: { parts: [{ text: systemContext }] },
                        generationConfig: {
                            thinkingConfig: { thinkingLevel: "minimal" }
                        }
                    })
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errDetail = await response.text().catch(() => "");
                    throw new Error(`HTTP ${response.status}: ${errDetail.slice(0, 120)}`);
                }

                const data = await response.json();
                const text = data &&
                    data.candidates && data.candidates[0] &&
                    data.candidates[0].content && data.candidates[0].content.parts &&
                    data.candidates[0].content.parts[0] &&
                    data.candidates[0].content.parts[0].text;

                if (!text) throw new Error("Format respons API kosong");

                return text.trim();
            } catch (err) {
                clearTimeout(timeoutId);
                throw err;
            }
        };

        // Database jawaban lokal (cadangan cerdas jika API Gemini gagal/offline)
        const chatDatabase = [
            {
                keywords: ["apa itu green corner", "green corner itu apa", "green corner", "tentang proyek", "latar belakang"],
                answer: "Green Corner adalah proyek penanaman dan perawatan tanaman yang kami lakukan sebagai bagian dari kegiatan proyek kolaborasi kelompok di SMK Negeri 2 Purwokerto."
            },
            {
                keywords: ["tujuan", "manfaat", "maksud proyek", "alasan proyek", "mengapa dibuat"],
                answer: "Tujuan proyek ini adalah memberikan pengalaman langsung menanam dan merawat tanaman, sekaligus melatih kerja sama, tanggung jawab, dan kepedulian lingkungan bagi anggota kelompok."
            },
            {
                keywords: ["tanaman apa", "jenis tanaman", "tanaman yang digunakan", "tanaman yang ditanam", "bunga apa"],
                answer: "Tanaman yang digunakan dalam proyek Green Corner adalah Bougainvillea (bunga kertas) dan Zinnia (kembang kertas)."
            },
            {
                keywords: ["alat", "peralatan", "perlengkapan", "sekop", "gunting", "ember", "sprayer", "penyiram"],
                answer: "Alat yang digunakan antara lain sekop kecil untuk mengolah tanah, gunting tanaman untuk pemangkasan, ember, alat penyiram (sprayer/gembor), dan pengaduk media tanam."
            },
            {
                keywords: ["bahan", "material", "media tanam", "tanah", "kompos", "bibit"],
                answer: "Bahan yang digunakan meliputi tanah subur, pupuk kandang/kompos, bibit tanaman Bougainvillea dan Zinnia, serta air bersih untuk penyiraman."
            },
            {
                keywords: ["proses tanam", "cara menanam", "cara tanam", "menanamnya", "langkah tanam", "tahapan tanam"],
                answer: "Prosesnya dimulai dari persiapan wadah dan media tanam, memasukkan campuran tanah dan pupuk, menanam bibit secara hati-hati, melakukan penyiraman awal, dan perawatan rutin berkala."
            },
            {
                keywords: ["kenapa dirawat", "mengapa dirawat", "perlu dirawat", "alasan perawatan", "tujuan perawatan"],
                answer: "Perawatan diperlukan agar tanaman mendapat asupan air dan nutrisi yang seimbang, terlindungi dari hama/penyakit, serta terpantau pertumbuhannya hingga berbunga optimal."
            },
            {
                keywords: ["belajar apa", "pelajaran", "yang dipelajari", "manfaat untuk siswa", "kesan"],
                answer: "Dari proyek ini kami belajar teknik dasar agrikultur/berkebun, kedisiplinan jadwal piket perawatan, serta nilai gotong royong dan tanggung jawab bersama dalam tim."
            },
            {
                keywords: ["berhenti setelah tanam", "selesai setelah tanam", "apakah selesai"],
                answer: "Tentu tidak. Setelah tahap penanaman selesai, tanaman harus terus dirawat, disiram, disiangi dari gulma, dan dipupuk secara teratur agar tetap hidup dan subur."
            },
            {
                keywords: ["hasil", "hasil utama", "hasil proyek", "evaluasi", "kesimpulan"],
                answer: "Hasil proyek ini meliputi tanaman Bougainvillea dan Zinnia yang tumbuh sehat dan segar, peningkatan area hijau di sekolah, serta dokumentasi dan data monitoring perkembangan tanaman."
            },
            {
                keywords: ["cara merawat bougainvillea", "merawat bougenville", "bougainvillea", "bougenville", "bunga kertas", "tips bougenvil"],
                answer: "Bougainvillea membutuhkan paparan sinar matahari penuh (minimal 6 jam/hari), penyiraman secukupnya (hindari media terlalu becek), pemangkasan ranting kering, dan pemupukan berkala."
            },
            {
                keywords: ["cara merawat zinnia", "merawat zinnia", "zinnia", "zinia", "kembang kertas", "tips zinnia"],
                answer: "Zinnia menyukai sinar matahari langsung dan membutuhkan penyiraman teratur saat lapisan atas tanah mulai kering. Hindari menyiram langsung ke kelopak bunga agar tidak membusuk."
            },
            {
                keywords: ["beda bougainvillea zinnia", "perbedaan tanaman", "bougainvillea vs zinnia", "zinnia vs bougainvillea", "bedanya"],
                answer: "Bougainvillea adalah tanaman semak berkayu menahun yang sangat tahan cuaca panas dan bunganya berupa seludang tipis, sedangkan Zinnia adalah tanaman herba musiman dengan bunga mekar cerah yang membutuhkan media tanam lebih lembap."
            },
            {
                keywords: ["siram", "penyiraman", "jadwal siram", "nyiram", "disiram", "kapan disiram", "berapa kali siram"],
                answer: "Penyiraman dilakukan secara rutin 1–2 kali sehari (pagi atau sore hari) disesuaikan dengan kelembapan tanah. Jika cuaca hujan atau tanah masih lembap, penyiraman dapat dikurangi."
            },
            {
                keywords: ["pupuk", "pemupukan", "kapan pupuk", "jenis pupuk", "nutrisi"],
                answer: "Pemupukan diberikan setiap 2–3 minggu sekali menggunakan pupuk NPK seimbang atau pupuk organik kompos untuk menyuplai unsur hara bagi daun dan perangsang bunga."
            },
            {
                keywords: ["kelompok", "anggota", "siapa saja", "nama anggota", "pembuat", "tim", "siapa yang buat"],
                answer: "Website dan proyek Green Corner ini dibuat dan dikelola oleh Kelompok 2 dari SMK Negeri 2 Purwokerto yang beranggotakan 6 siswa."
            },
            {
                keywords: ["smk", "sekolah", "smkn 2", "purwokerto"],
                answer: "Proyek ini dilaksanakan di lingkungan SMK Negeri 2 Purwokerto sebagai bagian dari kegiatan pembelajaran berbasis proyek ramah lingkungan."
            },
            {
                keywords: ["halo", "hai", "hi", "hey", "pagi", "siang", "sore", "malam", "assalamualaikum"],
                answer: "Halo! 🌱 Senang bertemu denganmu. Silakan tanyakan apa saja tentang proyek Green Corner, tanaman Bougainvillea, Zinnia, atau tips perawatannya!"
            },
            {
                keywords: ["terima kasih", "makasih", "thanks", "tengkyu", "matur nuwun"],
                answer: "Sama-sama! Senang bisa membantu. Tetap semangat menjaga lingkungan hijau bersama Green Corner! 🌿"
            }
        ];

        const fallbackAnswer =
            "Maaf, aku belum menemukan jawaban yang cocok untuk pertanyaan itu. " +
            "Coba tanyakan seputar tanaman Bougainvillea/Zinnia, cara merawat, alat & bahan, atau proyek Green Corner ya!";

        // Algoritma pencocokan cerdas dengan skor token kata & frasa
        const findAnswer = (question) => {
            const cleanQ = question.toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\"]/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            const queryWords = cleanQ.split(" ").filter(w => w.length > 2);
            let bestScore = 0;
            let bestAnswer = null;

            chatDatabase.forEach(entry => {
                let score = 0;

                // 1. Cek frasa penuh (nilai tinggi)
                entry.keywords.forEach(keyword => {
                    const kw = keyword.toLowerCase();
                    if (cleanQ.includes(kw)) {
                        score += kw.split(" ").length * 5;
                    } else {
                        // 2. Cek kecocokan per kata (token matching)
                        const kwWords = kw.split(" ").filter(w => w.length > 2);
                        kwWords.forEach(kwWord => {
                            queryWords.forEach(qWord => {
                                if (qWord === kwWord || qWord.includes(kwWord) || kwWord.includes(qWord)) {
                                    score += 2;
                                }
                            });
                        });
                    }
                });

                if (score > bestScore) {
                    bestScore = score;
                    bestAnswer = entry.answer;
                }
            });

            return (bestScore >= 2 && bestAnswer) ? bestAnswer : fallbackAnswer;
        };

        const appendMessage = (text, who, sourceLabel) => {
            const msg = document.createElement("div");
            msg.className = "chatbot-msg " + who;

            const textEl = document.createElement("span");
            textEl.textContent = text;
            msg.appendChild(textEl);

            if (sourceLabel) {
                const tag = document.createElement("span");
                tag.className = "chatbot-source-tag chatbot-source-" + sourceLabel.type;
                tag.textContent = sourceLabel.text;
                msg.appendChild(tag);
            }

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
            const apiKey = GEMINI_API_KEY;

            if (apiKey) {
                askGemini(question, apiKey)
                    .then(answer => {
                        typingMsg.remove();
                        appendMessage(answer, "bot", { type: "ai", text: "🤖 AI" });
                    })
                    .catch(err => {
                        // Jika Gemini API gagal (misal: kuota limit, CORS di HP, atau jaringan putus),
                        // catat error ke console agar bisa diperiksa dan beralih mulus ke database lokal.
                        console.warn("[Green Corner AI] Gagal terhubung ke Gemini API:", err);
                        typingMsg.remove();
                        appendMessage(findAnswer(question), "bot", { type: "fallback", text: "📋 Kata kunci" });
                    });
            } else {
                setTimeout(() => {
                    typingMsg.remove();
                    appendMessage(findAnswer(question), "bot", { type: "fallback", text: "📋 Kata kunci" });
                }, 550);
            }
        });

        // Quick question chips
        document.querySelectorAll(".chip-btn").forEach(chip => {
            chip.addEventListener("click", () => {
                chatInput.value = chip.getAttribute("data-query") || chip.textContent;
                chatbotForm.dispatchEvent(new Event("submit", { cancelable: true }));
            });
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

    if (monitorCards.length) {

        const applyDefaultMonitoring = () => {
            monitorCards.forEach(card => {
                const metaText = card.querySelector(".monitor-meta-text");
                if (metaText && metaText.textContent.includes("Memuat")) {
                    metaText.textContent = "Status: Terpantau rutin oleh Kelompok 2";
                }
            });
        };

        if (!window.supabase) {
            applyDefaultMonitoring();
            return;
        }

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
            try {
                const { data, error } = await sb.from("monitoring").select("*");

                if (error || !data || !data.length) {
                    throw new Error(error ? error.message : "Data belum tersedia");
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
            } catch (err) {
                console.warn("[Monitoring] Menggunakan status default lokal:", err.message);
                applyDefaultMonitoring();
            }
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
