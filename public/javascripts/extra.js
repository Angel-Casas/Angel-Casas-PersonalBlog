// Extra functionality for the Blog
// Light/Dark theme persistent
// Like button toogle

window.addEventListener('load', function() {
  var lightInputValue = JSON.parse(localStorage.getItem('lightInputValues')) || false;
  var input = document.querySelector('#light-input');

  input.addEventListener('change', function() {
    lightInputValue = this.checked;
    console.log('saved');

    localStorage.setItem('lightInputValues', JSON.stringify(lightInputValue));
  });
  if (lightInputValue) {
    input.checked = true;
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
window.attachEvent('onload', function() {
  var lightInputValue = JSON.parse(localStorage.getItem('lightInputValues')) || false;
  var input = document.querySelector('#light-input');

  input.attachEvent('change', function() {
    lightInputValue = this.checked;
    console.log('saved');

    localStorage.setItem('lightInputValues', JSON.stringify(lightInputValue));
  });
  if (lightInputValue) {
    input.checked = true;
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
