const decorate = (tag, template) => { /** @source https://matthewphillips.info/programming/decorate-element.html */
  customElements.define(tag, class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      const root = this.shadowRoot;
      !root.firstChild && root.appendChild(document.importNode(template.content, true));
    }
  });
};

customElements.define('decorate-element', class extends HTMLElement {
  connectedCallback() {
    const tag = this.getAttribute('tag');
    let template = this.firstElementChild;
    const observer = () => {
      const mo = new MutationObserver(() => {
        template = this.firstElementChild;
        const cleanUp = () => {
          mo.disconnect();
          decorate(tag, template);
        };
        template && cleanUp();
      });
      mo.observe(this, { childList: true });
    };
    template
      ? decorate(tag, template)
      : observer();
  }
});
