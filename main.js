
// <!-- https://opentdb.com/api.php?amount=10&token=YOURTOKENHERE -->
// <!-- https://quizapi.io/api/v1/questions?apiKey=CjpszrbUynVKWrkVQXbT681Dj4jfNNf3z5hNwMCF&limit=10 -->
const categories = ["Linux", "DevOps", "Code", "CMS", "Docker", "SQL"];

let table = document.getElementById("QuestionsTable");
let selectCategory = document.getElementById("SelectCatigories");
let selectDifficulty = document.getElementById("SelectDifficulty");
let addUserBtn = document.getElementById("AddUserBtn");
let startBtn = document.getElementById("Start");
let usersList = document.getElementById("SelectUserName");
let newUsrTxt = document.getElementById("UserNameTxt");

var savedUsers = localStorage.getItem("Users");
if (savedUsers != null && savedUsers.length != 0) { }
else {
        savedUsers = [];
        newUsrTxt.value  = ["Mahmoud Zakaria Mahmoud Taha Noureldin"];
        addUser();
        newUsrTxt.value = "";
    // savedUsers = ["Mahmoud Zakaria Mahmoud Taha Noureldin"];
    // localStorage.setItem("Users", savedUsers.toString());
}
savedUsers = savedUsers.split(',');
savedUsers.forEach(us => {
    usersList.innerHTML += (`<option>${us}</option>`);

});
startBtn.addEventListener("click", startExam);
addUserBtn.addEventListener("click", addUser)

categories.forEach(ct => {
    selectCategory.innerHTML += (`<option>${ct}</option>`);

});
function startExam() {
    sessionStorage.setItem("Category", selectCategory.selectedIndex);
    sessionStorage.setItem("Difficulty", selectDifficulty.value);
    sessionStorage.setItem("User", usersList[usersList.selectedIndex].value);
    window.location.replace("exam.html");

}
function addUser() {


    if (newUsrTxt != null && newUsrTxt.value != "") {
        for (let index = 0; index < savedUsers.length; index++) {
            if (savedUsers[index] == newUsrTxt.value) {
                console.log("User Already Registered")
                usersList.selectedIndex = index;
                return;
            }
        }
        savedUsers[savedUsers.length] = newUsrTxt.value;
        localStorage.setItem("Users", savedUsers.toString());
        usersList.innerHTML += (`<option>${newUsrTxt.value}</option>`);
        usersList.selectedIndex = usersList.length - 1;
        console.log("User Added " + newUsrTxt.value);
    }
}
