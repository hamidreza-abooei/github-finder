const inputUsername = document.querySelector('#inputUsername');
const submitBtn = document.querySelector('#submitBtn');
const cardFooter = document.querySelector('.cardfooter');
const profile = document.querySelector('#profileImg');
const details = document.querySelector('.details');
const cardUsername = document.querySelector('#usernamelabel');
const cardBio = document.querySelector('#biolabel');
const errorform = document.querySelector('.errorForm');
// const errorMassage = document.querySelector('#errorMsg');
const errorfieldset = document.querySelector('.errorfieldset');
async function getGitProf(event) {
    let username = inputUsername.value;
    if (checkValidity(username)){
        try{
            // showError('https://api.github.com/users/${username}');
            let response = await fetch('https://api.github.com/users/'+username);
            console.log(response);
            let respJSON = await response.json();
            if (response.status != 200){
                if (response.status == 404){
                    showError("Username does not exist.")
                }else{
                    showError("Connection Error. Try again later.")
                }
                return Promise.reject('Request failed with error ${response.status}');
            }
            console.log(respJSON)
            createCard(respJSON);
        }catch (error){
            console.log(error);
            // showError("")
        }

    }

}

function createCard(respJSON){
    profile.src = respJSON.avatar_url;
    cardUsername.innerHTML = "Username: " + respJSON.login + "<br/>Name: " + respJSON.name;
    cardBio.innerHTML = "Bio: " + respJSON.bio + "<br/>Followers: " +
                         respJSON.followers+"<br/>Following: " + respJSON.following+
                         "<br/>Public repositories: "+ respJSON.public_repos;
    cardFooter.innerHTML = "";
    const creationDateElement = document.createElement("span");
    const nodec = document.createTextNode("Created at: " + respJSON.created_at.slice(0,10));
    creationDateElement.appendChild(nodec);
    const updateDateElement = document.createElement("span");
    const nodeu = document.createTextNode("Last updated at: "+respJSON.updated_at.slice(0,10));
    updateDateElement.appendChild(nodeu);
    cardFooter.appendChild(creationDateElement);
    cardFooter.appendChild(updateDateElement);

}

async function saveUsernames(){


}

// This regex has been extracted from: https://github.com/shinnn/github-username-regex
function checkValidity(name){
    const regex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    const validity = name.match(regex);
    if (validity != null){
        return true;
    }
    showError("Username is not valid. Try again")
    return false;
}

function showError (errorMsg){
    errorform.style.display = "block";
    const newelement = document.createElement("span");
    const node = document.createTextNode(errorMsg);
    newelement.appendChild(node);
    errorfieldset.appendChild(newelement)
    // errorfieldset.innerHTML = "<span>"+errorMsg+"</span>"
    // errorMassage.value = errorMsg;
    setTimeout(() => {  // remove error form after 3 seconds
        errorform.style.display = "none";
        errorfieldset.removeChild(newelement);
    }, 3000);
}

submitBtn.addEventListener('click',getGitProf);
window.localStorage.clear();
