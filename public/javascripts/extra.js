// Extra functionality for the Blog
// Light/Dark theme persistent
// Like button toogle

window.addEventListener('load', function() {
  // Get input and value of light input
  try {
    var lightInputValue = JSON.parse(localStorage.getItem('lightInputValues')) || false;
    var light_input = document.querySelector('#light-input');

    light_input.addEventListener('change', function() {
      lightInputValue = this.checked;
      console.log('light saved');

      localStorage.setItem('lightInputValues', JSON.stringify(lightInputValue));
    });
    if (lightInputValue) {
      light_input.checked = true;
    }
  } catch(err) {
    console.log('No Light input');
  }

  // Get input and value of language input
  try {
    var langInputValue = window.location.href.indexOf('/EN') > -1 ? false : true;
    var lang_input = document.querySelector('#language-input');

    console.log('LangInput: ' + langInputValue);

    if (langInputValue) {
      lang_input.checked = true;
    }

    lang_input.addEventListener('change', function() {
      langInputValue = this.checked;
      localStorage.setItem('lang', JSON.stringify(langInputValue));
      console.log('Lang saved: ' + langInputValue);
      if (window.location.href.indexOf("/EN") > -1 && this.checked) {
        console.log('EN href');
        window.location = window.location.href.replace('EN', 'ES');
      } else if (window.location.href.indexOf("/ES") > -1 && !this.checked) {
        console.log('ES href');
        window.location = window.location.href.replace('ES', 'EN');
      }
    });
    document.querySelector('.js').style.display = 'block';
  } catch(err) {
    console.log('No language input');
  }

  // Check whether a like button exists and add an eventListener
  try {
    let likeBtn = document.querySelector('.button-like');

    likeBtn.addEventListener('click', function(event) {
      likeBtn.classList.toggle('liked');
    });
  } catch(err) {
    console.log('No like button detected.');
  }
});

// For IE only
if (window.attachEvent) {
  window.attachEvent('onload', function() {
    // Get input and value of light input
    try {
      var lightInputValue = JSON.parse(localStorage.getItem('lightInputValues')) || false;
      var light_input = document.querySelector('#light-input');

      light_input.attachEvent('change', function() {
        lightInputValue = this.checked;
        console.log('light saved');

        localStorage.setItem('lightInputValues', JSON.stringify(lightInputValue));
      });
      if (lightInputValue) {
        light_input.checked = true;
      }
    } catch(err) {
      console.log('No Light input');
    }

    // Get input and value of language input
    try {
      var langInputValue = JSON.parse(localStorage.getItem('lang')) || false;
      var lang_input = document.querySelector('#language-input');

      lang_input.attachEvent('change', function() {
        langInputValue = this.checked;
        localStorage.setItem('lang', JSON.stringify(langInputValue));
        console.log('Lang saved: ' + langInputValue);
        if (window.location.href.indexOf("/EN") > -1 && this.checked) {
          console.log('EN href');
          window.location = window.location.href.replace('EN', 'ES');
        } else if (window.location.href.indexOf("/ES") > -1 && !this.checked) {
          console.log('ES href');
          window.location = window.location.href.replace('ES', 'EN');
        }
      });
      if (langInputValue) {
        lang_input.checked = true;
      }
      document.querySelector('.js').style.display = 'block';
    } catch(err) {
      console.log('No language input');
    }

    // Check whether a like button exists and add an eventListener
    try {
      let likeBtn = document.querySelector('.button-like');

      likeBtn.attachEvent('click', function(event) {
        likeBtn.classList.toggle('liked');
      });
    } catch(err) {
      console.log('No like button detected.');
    }
  })
}
