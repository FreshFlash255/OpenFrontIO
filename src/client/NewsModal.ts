import { LitElement, css, html } from "lit";
import { resolveMarkdown } from "lit-markdown";
import { customElement, property, query } from "lit/decorators.js";
import { translateText } from "../client/Utils";
import "./components/baseComponents/Button";
import "./components/baseComponents/Modal";

@customElement("news-modal")
export class NewsModal extends LitElement {
  @query("o-modal") private modalEl!: HTMLElement & {
    open: () => void;
    close: () => void;
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this.handleKeyDown);
  }

  disconnectedCallback() {
    window.removeEventListener("keydown", this.handleKeyDown);
    super.disconnectedCallback();
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      e.preventDefault();
      this.close();
    }
  };

  // Hier trägst du manuell deinen Changelog ein (Markdown erlaubt)
  private manualChangelog: string = `
# 📰 Update v0.1
**Released:** Nov. 2025

### What's New?
- Modded by CHTriple & FreshFlash
`;

  @property({ type: String }) markdown = this.manualChangelog;
  private initialized: boolean = false;

  static styles = css`
    :host {
      display: block;
    }

    .news-container {
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .news-content {
      color: #ddd;
      line-height: 1.5;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 8px;
      padding: 1rem;
    }

    .news-content a {
      color: #4a9eff !important;
      text-decoration: underline !important;
      transition: color 0.2s ease;
    }

    .news-content a:hover {
      color: #6fb3ff !important;
    }
    o-button {
      display: block;
      margin: 1.5rem auto 0 auto; /* oben etwas Abstand, horizontal mittig */
      width: 50%; /* kannst du anpassen, z. B. 40% oder 100% */
      max-width: 250px; /* verhindert, dass er zu breit wird */
      text-align: center;
    }

    @media (max-width: 600px) {
      o-button {
        width: 80%; /* auf kleineren Displays etwas breiter */
      }
    }
  `;

  render() {
    return html`
      <o-modal title=${translateText("news.title")}>
        <div class="options-layout">
          <div class="options-section">
            <div class="news-container">
              <div class="news-content">
                ${resolveMarkdown(this.markdown, {
                  includeImages: true,
                  includeCodeBlockClassNames: true,
                })}
              </div>
            </div>
          </div>
        </div>

        <o-button
          title=${translateText("common.close")}
          @click=${this.close}
          blockDesktop
        ></o-button>
      </o-modal>
    `;
  }

  public open() {
    if (!this.initialized) {
      this.initialized = true;
      this.markdown = this.manualChangelog;
    }
    this.requestUpdate();
    this.modalEl?.open();
  }

  private close() {
    this.modalEl?.close();
  }
}
