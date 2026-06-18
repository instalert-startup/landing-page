const i18n = {
    currentLang: 'es',
    translations: {}, 

    async init() {
        const saved = localStorage.getItem('instAlert_lang') || 'es';
        this.setupToggle();
        await this.setLang(saved);
    },

    async fetchTranslations(lang) {
        if (!this.translations[lang]) {
            try {
                const response = await fetch(`public/${lang}.json`);
                if (!response.ok) {
                    throw new Error(`No se pudo cargar el archivo: public/${lang}.json`);
                }
                this.translations[lang] = await response.json();
            } catch (error) {
                console.error("Error cargando los JSON:", error);
            }
        }
    },

    async setLang(lang) {
        this.currentLang = lang;
        document.documentElement.lang = lang;
        localStorage.setItem('instAlert_lang', lang);
        
        await this.fetchTranslations(lang);
        
        if (this.translations[lang]) {
            document.title = this.t('page.title');
            this.applyTranslations();
        }

        this.updateLabels();
        document.getElementById('lang-toggle').checked = lang === 'en';
    },

    t(key) {
        return key.split('.').reduce((obj, k) => obj?.[k], this.translations[this.currentLang]) ?? key;
    },

    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = this.t(el.dataset.i18n);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = this.t(el.dataset.i18nPlaceholder);
        });
        document.querySelectorAll('[data-i18n-alt]').forEach(el => {
            el.alt = this.t(el.dataset.i18nAlt);
        });
    },

    updateLabels() {
        const isEN = this.currentLang === 'en';
        
        // Manejando las clases para cambiar el color activo
        const labelEs = document.getElementById('label-es');
        const labelEn = document.getElementById('label-en');
        
        if (isEN) {
            labelEs.classList.remove('active');
            labelEn.classList.add('active');
        } else {
            labelEs.classList.add('active');
            labelEn.classList.remove('active');
        }
    },

    setupToggle() {
        document.getElementById('lang-toggle').addEventListener('change', async (e) => {
            await this.setLang(e.target.checked ? 'en' : 'es');
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});