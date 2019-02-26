/**
 * @param {string} string - your template litteral string for the template
 */
export const html = string => { /** @source https://alligator.io/web-components/composing-slots-named-slots/ */
  const tpl = document.createElement('template');
  tpl.innerHTML = string;
  return Object.freeze({ raw: string, tpl });
};

/**
 * @param {string} str - really need to find out type of this.shadowRoot
 * @param {[Class]} sheets - need to figure out how to define spread of args and also what is the dam type on that
 */
export const css = (...sheets) => { /** @source  https://developers.google.com/web/fundamentals/web-components/shadowdom */
  const createStyleSheet = str => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(str);
    const styles = [sheet, ...sheets];
    return Object.freeze({ raw: str, styles });
  };
  return str => createStyleSheet(str);
};

/**
 * @param {string} element - let's find our lovely node
 * @param {any} context - really need to find out type of this.shadowRoot
 */
export const $ = (element, context = document) => {
  const el = context.querySelector(element);
  const setAttribute = (...args) => {
    el.setAttribute(...args);
  };
  const getAttribute = attr => {
    el.getAttribute(attr);
  };
  const update = (key, message) => {
    el.update[key](message);
  };
  const on = (...args) => {
    el.addEventListener(...args);
  };
  const off = (...args) => {
    el.removeEventListener(...args);
  };
  return Object.freeze({
    setAttribute,
    getAttribute,
    update,
    on,
    off,
  });
};

export const createElement = ({
  tag,
  template,
  style,
  mode = 'open',
  delegatesFocus,
  component,
}) => {
  const upgradeAttribute = Symbol('lazy update properties');
  class Element extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode, delegatesFocus });
      const { styles } = style;
      this.shadowRoot.adoptedStyleSheets = styles;
      const { tpl } = template;
      this.shadowRoot.appendChild(tpl.content.cloneNode(true));
    }

    connectedCallback() {
      this.constructor.observedAttributes
        .forEach(attr => this[upgradeAttribute](attr));
    }

    [upgradeAttribute](attr) {
      if (this.hasOwnProperty(attr)) {
        const value = this[attr];
        delete this[attr];
        this[attr] = value;
      }
    }
  }
  component
    ? customElements.define(tag, component(Element))
    : customElements.define(tag, class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const { styles } = style;
        this.shadowRoot.adoptedStyleSheets = styles;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
      }
    });
};
