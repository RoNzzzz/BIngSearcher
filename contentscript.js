/*
// contentscript.js
var counter;
// Function to increment the counter and store it in the browser's storage
function incrementCounter() {
      counter = 1;
  }
  executeScript();
  // Call the incrementCounter function when the content script is executed
  incrementCounter();*/
  function executeScript(){
       var scroll = document.querySelector("shopping-page-base")
      ?.shadowRoot.querySelector("shopping-homepage")
      ?.shadowRoot.querySelector("msft-feed-layout")
      ?.shadowRoot.querySelector("msn-shopping-game-pane");
      if(scroll==null){
        // executeScript();
        console.log(scroll);
        return;
      }
      else{
        scroll.scrollIntoView({behavior: 'smooth'})
      }
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('script.js');
        s.onload = function() { this.remove(); };
        // see also "Dynamic values in the injected code" section in this answer
        (document.head || document.documentElement).appendChild(s);
        chrome.storage.local.set({ buttonClicked: "" });
  }
  function gameFix(){
      var scroll = document.querySelector("shopping-page-base")
     ?.shadowRoot.querySelector("shopping-homepage")
     ?.shadowRoot.querySelector("msft-feed-layout")
     ?.shadowRoot.querySelector("msn-shopping-game-pane");
     if(scroll==null){
      console.log(scroll);
      //  gameFix();
      return;
     }
     else{
       scroll.scrollIntoView({behavior: 'smooth'})
     }
     var s = document.createElement('script');
     s.src = chrome.runtime.getURL('gamefix.js');
     s.onload = function() {
       this.remove();
       // Code to be executed after the script is loaded and executed
     };
     (document.head || document.documentElement).appendChild(s);     
       chrome.storage.local.set({ buttonClicked: "" });
  }

chrome.storage.local.get(['buttonClicked'], function(result) {
  var buttonClicked = result.buttonClicked;
  if (typeof buttonClicked !== 'undefined') {
    if (buttonClicked === 'gameButton') {
      console.log('gameButton was clicked');
      executeScript();
    } else if (buttonClicked === 'gameFixButton') {
      console.log('gameFixButton was clicked');
      gameFix();
    }
  }
});

// document.addEventListener('change', function(event) {
//   var target = event.target;
//   if (target.tagName.toLowerCase() === 'select') {
//     console.log('Game Fix');
//     gameFix();
//   }
// });