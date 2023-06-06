var intervalId;
var desktopUserAgent = navigator.userAgent;
var mobileUserAgent = "Mozilla/5.0 (Linux; Android 10; SM-G970F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36";
var userAgent = navigator.userAgent;
var result="";
var activeTabId = null;
var searchUrl;
var stopSearch = false;

function modeSearch(numSearchesD,numSearchesM, searchType, searchGen){
  if (searchType === "desktop") {
    desktopSearch(numSearchesD,numSearchesM,searchType,searchGen);
  } else if (searchType === "mobile") {
    mobileSearch(numSearchesD,numSearchesM,searchType,searchGen);
  }else if(searchType === "desktopmobile"){
    desktopMobileSearch(numSearchesD,numSearchesM,searchType,searchGen);
  }
   else {
    console.error("Invalid search type: " + searchType);
    return;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function desktopMobileSearch(numSearchesD, numSearchesM, searchType, searchGen) {
  if (searchType === "desktopmobile") {
    console.log("Executing Desktop and Mobile Search");

    await desktopSearch(numSearchesD,numSearchesM,"desktopD" ,searchGen);
    console.log("Finished performing desktop search.");

    // await delay(numSearchesD * 1000);

    if (numSearchesM > 0) {
      await mobileSearch(numSearchesD,numSearchesM,"mobileM", searchGen);
      console.log("Finished performing mobile search.");
    }
  } else {
    console.error("Invalid search type: " + searchType);
    return;
  }
}


async function desktopSearch(numSearchesD,numSearchesM,searchType,searchGen) {
  if (searchType === "desktop"||searchType === "desktopD") {
    searchUrl = "https://www.bing.com/search?q=";
    userAgent = desktopUserAgent;
  } else {
    console.error("Invalid search type: " + searchType);
    return;
  }
  await actualSearch(numSearchesD,numSearchesM, searchType, searchGen);
}

async function mobileSearch(numSearchesD,numSearchesM,searchType, searchGen) {
  if (searchType === "mobile"||searchType === "mobileM") {
    searchUrl = "https://www.bing.com/search?q=";
    userAgent = mobileUserAgent;
  } else {
    console.error("Invalid search type: " + searchType);
    return;
  }
  await actualSearch(numSearchesD,numSearchesM, searchType, searchGen);
}

async function actualSearch(numSearchesD,numSearchesM, searchType, searchGen) {
  var searchCount = 0;
  var prevSearches = [];
  var numSearches=0 ;
  result="";
  if(searchType==="desktop" ||searchType==="desktopD"){
    numSearches = numSearchesD;
  }else if(searchType==="mobile"||searchType==="mobileM"){
    numSearches =numSearchesM;
  }
  while (searchCount < numSearches) {
    if (searchGen == "precise") {
      var searchTerm = generateSearchTerm();
    } else if (searchGen == "random") {
      var searchTerm = "";
      if(searchType==="desktop"||searchType==="desktopD"){
        searchTerm = generateString(numSearchesD);
      }else if(searchType==="mobile"||searchType==="mobileM"){
        searchTerm = generateString(numSearchesM);
      }
      
    } else {
      console.log("Error, (Random/Preceise)");
      return;
    }

    if (stopSearch) {
      result = "";
      if (searchType === "mobile"||searchType==="mobileM") {
        userAgent = desktopUserAgent;
      }
      if(searchType==="desktopD"){
        stopSearch = true;
      }
      console.log("Stopped performing searches.");
      return;
    }

    if (prevSearches.includes(searchTerm)) {
      console.log("Skipping duplicate search term: " + searchTerm);
      continue;
    }
    prevSearches.push(searchTerm);

    var url = searchUrl + encodeURIComponent(searchTerm);

    // if (activeTabId) {
    //   await new Promise((resolve) => {
    //     chrome.tabs.update(activeTabId, { url: url }, function (tab) {
    //       console.log("Searching for: " + searchTerm + " in " + searchType);
    //       resolve();
    //     });
    //   });
    // } 
    if (activeTabId) {
      // Update tab URL
      chrome.tabs.update(activeTabId, { url: url });
    
      // Listen for tab load completion
      chrome.tabs.onUpdated.addListener(function onTabUpdated(tabId, changeInfo) {
        if (tabId === activeTabId && changeInfo.status === "complete") {
          // Website is fully loaded, perform your desired actions here
          console.log("Website is fully loaded");
           // Perform another search
        // actualSearch(numSearchesD, numSearchesM, searchType, searchGen);
          // Remove the event listener
          chrome.tabs.onUpdated.removeListener(onTabUpdated);
        }
      });
    }else {
      chrome.runtime.sendMessage({
        type: "start-searches",
        numSearchesD: numSearchesD,
        numSearchesM: numSearchesM,
        searchType: searchType,
        searchGen: searchGen,
      });
    }
    if(searchCount >= numSearches){
      result="";
      userAgent = desktopUserAgent;
      clearInterval(intervalId);
      if (searchType === "mobile"||searchType==="mobileM") {
        userAgent = desktopUserAgent;
      }
      console.log("Finished performing searches.");
      return;
    }
    searchCount++;
    await delay(1000);
  }
}


function generateString(numSearches){
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  if(result===""){
      for (var i = 0; i < numSearches; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  }else{
    result=result.slice(0,-1);
  }
  return result;
}

function generateSearchTerm() {
  var adjectives = [
    "famous",
    "delicious",
    "scary",
    "fantastic",
    "beautiful",
    "silly",
    "colorful",
    "exciting",
    "amazing",
    "weird",
    "abrupt",
    "adorable",
    "amiable",
    "awkward",
    "bizarre",
    "blushing",
    "brisk",
    "calm",
    "charming",
    "cheerful",
    "clumsy",
    "cooperative",
    "courageous",
    "creative",
    "cute",
    "delightful",
    "determined",
    "diligent",
    "elegant",
    "enthusiastic",
    "fabulous",
    "friendly",
    "funny",
    "gentle",
    "glamorous",
    "gorgeous",
    "graceful",
    "hilarious",
    "humble",
    "innocent",
    "intelligent",
    "jolly",
    "kind-hearted",
    "lively",
    "lovely",
    "lucky",
    "magnificent",
    "mysterious",
    "naughty",
    "happy",
    "embarrassing",
    "tall",
    "uncomfortable",
    "suspicious",
    "goofy",
    "cowardly",
    "brave",
    "groovy",
    "abrupt"
  ];
  var nouns = [
    "dog",
    "cat",
    "robot",
    "unicorn",
    "dragon",
    "spaceship",
    "planet",
    "piano",
    "jungle",
    "mountain",
    "apple",
    "banana",
    "book",
    "bottle",
    "car",
    "chair",
    "cloud",
    "coffee",
    "computer",
    "cup",
    "desk",
    "door",
    "flower",
    "guitar",
    "hat",
    "house",
    "jacket",
    "key",
    "lamp",
    "leaf",
    "lightning",
    "moon",
    "motorcycle",
    "ocean",
    "painting",
    "phone",
    "pillow",
    "rain",
    "river",
    "shoe",
    "sky",
    "snowflake",
    "star",
    "sunflower",
    "table",
    "tree",
    "umbrella",
    "window",
    "tulu",
    "ron",
    "sagar",
    "bipin",
    "lee",
    "jadu",
    "game",
    "valo",
    "rohan",
    "tulasha",
    "rito",
    "video"
  ];

  var adjIndex = Math.floor(Math.random() * adjectives.length);
  var nounIndex = Math.floor(Math.random() * nouns.length);

  return adjectives[adjIndex] + " " + nouns[nounIndex];
}
var tabId=null;
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  
  if (message.type === "start-searches") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        activeTabId = tabs[0].id; // Store the tab ID of the active tab
        // performSearches(message.numSearches, message.searchType, message.searchGen);
      } else {
        console.error("No active tab found.");
      }
    });
    stopSearch=false;
    modeSearch(message.numSearchesD,message.numSearchesM, message.searchType, message.searchGen);
  } else if (message.type === "stop-searches") {
    stopSearch = true;
    userAgent = desktopUserAgent;
    clearInterval(intervalId);
    result="";
    console.log("Stopped performing searches.");
  }else if (message.type === "game-button") {
    chrome.tabs.query({ url: "https://www.msn.com/en-us/shopping/*" }, function(tabs) {
      if (tabs.length > 0) {
        // Tab already exists, update it and get the tab ID
        chrome.tabs.update(tabs[0].id, { active: true }, function(updatedTab) {
          tabId = updatedTab.id;
          console.log("Tab ID:", tabId);
          // Continue with further logic using the tab ID
        });
        console.log("Either URL is opened.");
      } else {
        // Tab doesn't exist, create a new one and get the tab ID
        chrome.tabs.create({ url: "https://www.msn.com/en-us/shopping" }, function(createdTab) {
          tabId = createdTab.id;
          console.log("Tab ID:", tabId);
          // Continue with further logic using the tab ID
        });
        console.log("Neither URL is opened.");
      }
    });
  }
  
  if(message.type === "game-fix-button"){
    if(tabId){
      startFixExecution(tabId);
    }
  }
});

var fixIntervalId;
function executeFixFunction(tabId) {
  chrome.tabs.executeScript(tabId, { code: 'gameFix();' });
}

function startFixExecution(tabId) {
  executeFixFunction(tabId);
  fixIntervalId = setInterval(function () {
    executeFixFunction(tabId);
  }, 2000);
}

function stopFixExecution() {
  // Clear the interval
  clearInterval(fixIntervalId);
}
// Listen for tab removal
chrome.tabs.onRemoved.addListener(function (removedTabId, removeInfo) {
  // Check if the removed tab matches the tab you're interested in
  if (removedTabId === tabId) {
    // Stop executing the function
    stopFixExecution();
  }
});

// add webRequest listener at the end of the file
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    for (var i = 0; i < details.requestHeaders.length; ++i) {
      if (details.requestHeaders[i].name === 'User-Agent') {
        details.requestHeaders[i].value = userAgent;
        break;
      }
    }
    return {requestHeaders: details.requestHeaders};
  },
  {urls:
 ["<all_urls>"]},
  ["blocking", "requestHeaders"]);
