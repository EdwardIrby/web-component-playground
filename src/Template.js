/**
 * @param {string} string - your template litteral string for the template
 */
export const html = string => { /** @source https://alligator.io/web-components/composing-slots-named-slots/ */
  const tpl = document.createElement('template');
  tpl.innerHTML = string;
  return Object.freeze({ raw: string, tpl });
};

/**
 * @param {[string]} sheets
 */
export const css = (...sheets) => {
  /** @param {string} str */
  const createStyleSheet = str => [...sheets, str].join('\n');
  return /** @param {string} str */str => createStyleSheet(str);
};

/**
 * @param {HTMLElement} context - the shadowRoot most of the time
 */
export const query = (context = document) => (
  /** @param {string} identifier */
  identifier => {
    const el = context.querySelector(identifier);
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
  }
);
/**
 * @param {Object} config - configuration
 * @param {string} config.tag - dash-cased component name;
 * @param {HTMLTemplateElement} config.template - template created using html function
 * @param {string} config.style - string created using css function
 * @param {string} [config.mode=open] - shadowroot mode options are open or close
 * @param {boolean} [config.delegatesFocus=undefine] - delgateFocus in the webcomponent
 * @param {class} [config.component]
 */
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
      this.shadowRoot.prepend = `<style>${style}</style>`;
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
        this.attachShadow({ mode, delegatesFocus });
        this.shadowRoot.prepend = `<style>${style}</style>`;
        const { tpl } = template;
        this.shadowRoot.appendChild(tpl.content.cloneNode(true));
      }
    });
};

createElement({
  tag: 'nex-component',
  style: css()`.one{color:red}`,
  template: html`<div class='red'></div>`,
  component: base => class extends base {
    constructor() { 
      super();
      this.update = this.update.bind(this);
    }
    update(message){

    }
  },
});