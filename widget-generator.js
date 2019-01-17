const productLinkInput = flight.component(function() {
  this.after('initialize', function() {
    this.$node.find('input').on('input', event => {
      const productLink = event.target.value;
      this.trigger(document, 'productLinkChanged', { productLink });
    });
  });
});

productLinkInput.attachTo('#product-link-input');

const DisplayStyleChooser = flight.component(function() {
  this.doSomething = function(event) {
    if (event.target.value) {
      const selectedDisplayStyle = event.target.value;
      this.trigger(document, 'displayStyleSelected', { selectedDisplayStyle });
    }
  };

  this.after('initialize', function() {
    this.on('click', this.doSomething);
  });
});
DisplayStyleChooser.attachTo('#display-style-chooser');

const ButtonTextInput = flight.component(function() {
  this.after('initialize', function() {
    this.on(document, 'displayStyleSelected', (event, data) => {
      if (data.selectedDisplayStyle === 'button') {
        this.$node.show();
      } else {
        this.$node.hide();
      }
    });
    this.$node.find('input').on('input', event => {
      const buttonText = event.target.value || 'Buy my product!';
      this.trigger(document, 'buttonTextChanged', { buttonText });
    });
  });
});

ButtonTextInput.attachTo('#button-text-input');

const WidgetCodeSnippet = flight.component(function() {
  this.snippetData = {
    productLink: '',
    buttonText: 'Buy my product',
    displayStyle: 'button'
  };
  this.generateCodeSnippet = function() {
    if (!this.snippetData.productLink) {
      alert('Enter a valid link to a Gumroad product page.');
      return;
    }
    let buttonText = 'Loading';
    let buttonClassName = '';
    if (this.snippetData.displayStyle === 'button') {
      buttonText = this.snippetData.buttonText;
      buttonClassName = 'gumroad-button';
    }
    const codeSnippet = `<a class="${buttonClassName}" href="${
      this.snippetData.productLink
    }" target="_blank" data-display-style="${this.snippetData.displayStyle}">
      ${buttonText}
</a>
<script src="https://gumroad.now.sh/gumroadDev.js" />`;

    this.$node.find('textarea').val(codeSnippet);
    this.$node.find('#preview').html('');
    $('.gumroad-iframe-wrapper').remove();
    this.$node.find('#preview').html(codeSnippet);
    this.$node.find('#preview').show();
  };
  this.after('initialize', function() {
    this.on(document, 'productLinkChanged', (event, data) => {
      this.snippetData.productLink = data.productLink;
      this.generateCodeSnippet();
    });
    this.on(document, 'buttonTextChanged', (event, data) => {
      this.snippetData.buttonText = data.buttonText;
      this.generateCodeSnippet();
    });
    this.on(document, 'displayStyleSelected', (event, data) => {
      this.snippetData.displayStyle = data.selectedDisplayStyle;
      this.generateCodeSnippet();
    });
  });
});
WidgetCodeSnippet.attachTo('#widget-code-sinippet');
