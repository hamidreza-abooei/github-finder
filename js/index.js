const inputUsername = document.querySelector('#inputUsername');
const submitBtn = document.querySelector('#submitBtn');
const cardFooter = document.querySelector('.cardfooter');
const profile = document.querySelector('#profileImg');
const details = document.querySelector('.details');
const cardUsername = document.querySelector('#usernamelabel');
const cardBio = document.querySelector('#biolabel');
const errorform = document.querySelector('.errorForm');
const errorfieldset = document.querySelector('.errorfieldset');

// Submit event handler, Send request to github API, check validity and ask createCard to format the card
async function getGitProf(event) {
    let username = inputUsername.value;
    if (checkValidity(username)) {
        try {
            // showError('https://api.github.com/users/${username}');
            let respJSON;
            let savedJSON = loadUsernameDetails(username);
            if (savedJSON == null){
                let response = await fetch('https://api.github.com/users/' + username);
                respJSON = await response.json();
                if (response.status != 200) {
                    if (response.status == 404) {
                        showError("Username does not exist.")
                    } else {
                        showError("Connection Error. Try again later.")
                    }
                    return Promise.reject('Request failed with error ${response.status}');
                }
                saveUsernames(respJSON);
            }else{
                respJSON = JSON.parse(savedJSON);
            }
            getFavLang(respJSON);
            // console.log(toplang);
            // respJSON.topLang = toplang;
            // console.log(respJSON.topLang);
            createCard(respJSON);
        } catch (error) {
            console.log(error);
            showError(""+error)
        }

    }

}
// This function extracts data from input JSON and updates the card (left pannel)
function createCard(respJSON) {
    if (respJSON.avatar_url != null){
        profile.src = respJSON.avatar_url;
    }
    let cardUsernameString = "Username: <a href='" + respJSON.html_url + "'>" + respJSON.login + "</a>" ;
    if (respJSON.name != null){
        cardUsernameString = cardUsernameString + "<br/>Name: " + respJSON.name;
    }
    if (respJSON.company != null){
        cardUsernameString = cardUsernameString + "<br/> Company: " + respJSON.company;
    }
    if (respJSON.blog != null){
        cardUsernameString = cardUsernameString + "<br/> blog: <a href='" + respJSON.blog+"'>"+respJSON.blog+"</a>";
    }
    if (respJSON.location != null){
        cardUsernameString = cardUsernameString + "<br/> Location: " + respJSON.location;
    }
    cardUsername.innerHTML = cardUsernameString;
    let cardBioString = "";
    if (respJSON.bio!=null){
        cardBioString = cardBioString + "Bio: " + respJSON.bio;
    }
    
    cardBioString = cardBioString + "<br/>Public repositories: " + respJSON.public_repos +
    "<br/>Followers: " + respJSON.followers + "<br/>Following: " + respJSON.following;
    
    cardBio.innerHTML = cardBioString;
    cardFooter.innerHTML = "";
    const creationDateElement = document.createElement("span");
    const nodec = document.createTextNode("Created at: " + respJSON.created_at.slice(0, 10));
    creationDateElement.appendChild(nodec);
    const updateDateElement = document.createElement("span");
    const nodeu = document.createTextNode("Last updated at: " + respJSON.updated_at.slice(0, 10));
    updateDateElement.appendChild(nodeu);
    cardFooter.appendChild(creationDateElement);
    cardFooter.appendChild(updateDateElement);

}

async function getFavLang(respJSON){
    try{
        let response = await fetch(respJSON.repos_url);
        if (response.status != 200) {
            return Promise.reject('Request failed with error ${response.status}');
        }
        // console.log(response);  
        const repos = await response.json();
        // console.log(repos);
        // console.log(repos.length)
        // let repoNum = 0;

        // let lastrepos = []
        // for (let repoNum=0;repoNum<repos.length;repoNum++){
        //     let repo = repos[repoNum];
        //     for (let lastrepoCounter=0;lastrepoCounter<)
        //     console.log(a.language);
        // }
        // for (let repoNum=0;repoNum<repos.length;repoNum++){
        //     console.log(repos[repoNum].pushed_at);
        // }
        repos.sort(customSort);
        // console.log(repos);
        // console.log(repos);
        // for (let repoNum=0;repoNum<repos.length;repoNum++){
        //     console.log(repos[repoNum].pushed_at);
        // }
        // let checklen = min(5,repos.length)
        // console.log(checklen);
        let topLang = null;
        let score = 0;
        let maxRepos = 5;
        for (let repoNum=0;repoNum<maxRepos;repoNum++){
            // console.log(repos[repoNum].pushed_at);
            let repo = repos[repoNum];
            if (repo == null){
                break;
            }
            if (repo.language == null){
                maxRepos++;
                continue
            }
            if (repo.size>score){
                score = repo.size;
                topLang = repo.language;
                // console.log(topLang);
                // console.log(repo.name);
            }
        }
        // console.log(topLang);
        console.log(topLang)
        if (topLang!=null){
            addLangToCard(topLang);
        }
        // return topLang;
        
    }catch (error){
        console.log(error);
    }


}
function addLangToCard(topLang){
    
    cardBio.innerHTML = cardBio.innerHTML  + "<br/>Top Language: " + topLang;
}

function customSort(a,b){
    let time1 = a.pushed_at;
    let time2 = b.pushed_at;
    let res = new Date(time2) - new Date(time1);
    // console.log(res);
    return res;
}

// Function to save every successfull inqueries into local storages
function saveUsernames(respJSON) {
    localStorage.setItem(respJSON.login,JSON.stringify(respJSON));
}

// Function to load a username from local storage
function loadUsernameDetails(username){
    const savedJSON = localStorage.getItem(username);
    return savedJSON;
}

// This regex has been extracted from: https://github.com/shinnn/github-username-regex
function checkValidity(name) {
    const regex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    const validity = name.match(regex);
    if (validity != null) {
        return true;
    }
    showError("Username is not valid. Try again")
    return false;
}
// This function displays an error message in card section 
function showError(errorMsg) {
    errorform.style.display = "block";
    const newelement = document.createElement("span");
    const node = document.createTextNode(errorMsg);
    newelement.appendChild(node);
    errorfieldset.appendChild(newelement)
    setTimeout(() => {  // remove error form after 3 seconds
        errorform.style.display = "none";
        errorfieldset.removeChild(newelement);
    }, 3000);
}

// Add eventListener
submitBtn.addEventListener('click', getGitProf);
window.localStorage.clear();
