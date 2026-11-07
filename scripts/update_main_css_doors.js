const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'public', 'css', 'main.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Add desktop .dinfo__tabs styling around .dinfo definition
const desktopDinfoOld = `.dinfo.on {
                opacity: 1;
                transform: none;
                transition: opacity .45s ease .08s,transform .6s var(--e-soft) .08s
            }`;

const desktopDinfoNew = `.dinfo.on {
                opacity: 1;
                transform: none;
                pointer-events: auto;
                transition: opacity .45s ease .08s,transform .6s var(--e-soft) .08s
            }
            .dinfo__tabs {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 0.85rem;
            }
            .dinfo__tab {
                flex: 1;
                height: 2.2rem;
                padding: 0 0.85rem;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.14);
                color: rgba(255, 255, 255, 0.8);
                font-family: inherit;
                font-size: 0.8125rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            .dinfo__tab.active {
                background: #E8E4E0;
                color: #1A1818;
                border-color: #E8E4E0;
            }`;

if (css.includes(desktopDinfoOld)) {
    css = css.replace(desktopDinfoOld, desktopDinfoNew);
    console.log('Added desktop .dinfo__tabs styling');
} else {
    console.log('desktop .dinfo.on match failed (check CRLF)');
    const regex = /\.dinfo\.on\s*\{\s*opacity:\s*1;[\s\S]*?transform:\s*none;[\s\S]*?\}/;
    if (regex.test(css)) {
        css = css.replace(regex, desktopDinfoNew);
        console.log('Added desktop .dinfo__tabs via regex');
    }
}

// 2. Replace the mobile doors @media block (lines 3420-3575)
const mobileDoorsRegex = /@media\s*\(max-width:\s*639\.98px\)\s*\{\s*\.doors\s*\{[\s\S]*?margin:\s*\.25rem 0 \.5rem\s*\}\s*\}/;

const mobileDoorsNew = `@media (max-width: 767.98px) {
                .doors {
                    height: auto !important;
                    min-height: auto !important;
                    overflow: visible !important;
                    padding: 3rem 1.25rem 4rem !important;
                }

                .doors__pin {
                    position: relative !important;
                    top: auto !important;
                    height: auto !important;
                    padding-top: 0 !important;
                    overflow: visible !important;
                    background: transparent !important;
                }

                .doors__wall {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    gap: 1.5rem !important;
                    width: 100% !important;
                    max-width: 520px !important;
                    margin: 0 auto !important;
                }

                .paint {
                    font-size: clamp(1.75rem, 5vw, 2.25rem) !important;
                    max-width: none !important;
                    white-space: normal !important;
                    align-self: center !important;
                    text-align: center !important;
                    margin: 0 0 0.5rem !important;
                }

                .doors__hint, .doors__dots {
                    display: none !important;
                }

                /* Mobile Door info card situated cleanly ABOVE the doors */
                .dinfo {
                    position: relative !important;
                    left: auto !important;
                    top: auto !important;
                    width: 100% !important;
                    max-width: 480px !important;
                    margin: 0 auto !important;
                    padding: 1.25rem 1.35rem !important;
                    border-radius: 1.25rem !important;
                    background: rgba(255, 255, 255, 0.04) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    backdrop-filter: blur(12px) !important;
                    opacity: 1 !important;
                    pointer-events: auto !important;
                    transform: none !important;
                    min-height: auto !important;
                    text-align: left !important;
                }

                .dinfo__tabs {
                    display: flex !important;
                    gap: 0.5rem !important;
                    margin-bottom: 0.85rem !important;
                    padding-bottom: 0.75rem !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
                }

                .dinfo__tab {
                    flex: 1 !important;
                    height: 2.25rem !important;
                    border-radius: 999px !important;
                    background: rgba(255, 255, 255, 0.06) !important;
                    border: 1px solid rgba(255, 255, 255, 0.12) !important;
                    color: rgba(255, 255, 255, 0.75) !important;
                    font-size: 0.8125rem !important;
                    font-weight: 600 !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                }

                .dinfo__tab.active {
                    background: #E8E4E0 !important;
                    color: #1A1818 !important;
                    border-color: #E8E4E0 !important;
                }

                .dinfo .dinfo__h {
                    font-size: 1.35rem !important;
                    line-height: 1.15 !important;
                    margin-bottom: 0.25rem !important;
                }

                .dinfo .dinfo__t {
                    font-size: 0.75rem !important;
                    letter-spacing: 0.08em !important;
                    margin-bottom: 0.75rem !important;
                }

                .dinfo .dinfo__p {
                    font-size: 0.875rem !important;
                    line-height: 1.35 !important;
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 0.45rem !important;
                }

                .dinfo .dinfo__p li {
                    display: flex !important;
                    align-items: center !important;
                    gap: 0.6rem !important;
                }

                .dinfo .dinfo__p li::before {
                    width: 0.95rem !important;
                    height: 0.95rem !important;
                    background-size: 0.55rem !important;
                }

                /* Mobile Doors Row: Both doors visible side-by-side without horizontal scrolling */
                .doors__row {
                    display: flex !important;
                    flex-direction: row !important;
                    justify-content: center !important;
                    align-items: flex-end !important;
                    gap: clamp(0.75rem, 3.5vw, 1.5rem) !important;
                    width: 100% !important;
                    margin: 0 auto !important;
                    padding: 0 !important;
                    transform: none !important;
                    overflow: visible !important;
                }

                .doors__row::after {
                    display: none !important;
                }

                .unit {
                    flex: 0 1 clamp(135px, 42vw, 190px) !important;
                    width: clamp(135px, 42vw, 190px) !important;
                    max-width: 190px !important;
                    margin: 0 !important;
                }

                .doorway {
                    width: 100% !important;
                }

                .doors__floor {
                    height: 2rem !important;
                }
            }`;

if (mobileDoorsRegex.test(css)) {
    css = css.replace(mobileDoorsRegex, mobileDoorsNew);
    console.log('Replaced mobile doors media query with clean responsive side-by-side doors');
} else {
    console.log('mobileDoorsRegex match failed');
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('public/css/main.css updated successfully');

