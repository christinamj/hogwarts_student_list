"use strict";

document.addEventListener("DOMContentLoaded", start);

const HTML = {};
let studentJSON = [];
let allStudents = [];
let currentList = [];
let expelledStudents = [];

let countsOfStudents;
const myHeading = document.querySelectorAll(".sort");
const myButtons = document.querySelectorAll(".filter");
let bloodArray = [];
let halfBlood = [];
let pureBlood = [];

const Student = {
  firstName: "",
  lastName: "",
  middleName: null,
  nickName: null,
  image: null,
  house: "",
  bloodstatus: "",
  prefect: false,
  expelled: false
};

//START AND GET JSON

function start() {
  HTML.template = document.querySelector(".students-template");
  HTML.dest = document.querySelector(".list");
  HTML.popup = document.querySelector(".popup");
  HTML.wrapper = document.querySelector(".section-wrapper");
  HTML.studentName = document.querySelector(".contentpopup>h2");

  //ADD EVENTLISTENER FOR FILTER
  document.querySelector("[data-filter='Gryffindor']").addEventListener("click", filterGryffindor);
  document.querySelector("[data-filter='Hufflepuff']").addEventListener("click", filterHufflepuff);
  document.querySelector("[data-filter='Ravenclaw']").addEventListener("click", filterRavenclaw);
  document.querySelector("[data-filter='Slytherin']").addEventListener("click", filterSlytherin);
  document.querySelector("[data-filter='all']").addEventListener("click", showAll);

  myHeading.forEach(button => {
    button.addEventListener("click", sortButtonClick);
  });

  myButtons.forEach(botton => {
    botton.addEventListener("click", filterBottonClick);
  });

  allStudents = currentList;
  getJson();
  document.querySelector("select#theme").addEventListener("change", selectTheme);
}

async function getJson() {
  const jsonData = await fetch("//petlatkea.dk/2020/hogwarts/students.json");
  const bloodData = await fetch("//petlatkea.dk/2020/hogwarts/families.json");

  studentJSON = await jsonData.json();
  bloodArray = await bloodData.json();

  prepareObjects(studentJSON, bloodArray);
}

function selectTheme() {
  document.querySelector("body").setAttribute("data-house", this.value);
}

//POPUP
function showPopup(student) {
  console.log("showPopup");

  HTML.popup.classList.add("popup-appear");

  document.querySelector(".contentpopup").setAttribute("data-house", student.house);

  document.querySelector(".contentpopup>h3").textContent = "House: " + student.house;

  document.querySelector(".contentpopup>h4").textContent = "Gender: " + student.gender;

  document.querySelector(".contentpopup>p").textContent = "Blood-status: " + student.blood;

  document.querySelector("#pstar").textContent = Student.star;

  // document.querySelector("#star").textContent = Student.star;

  document.querySelector(".contentpopup>img").src = `images/${student.image}.png`;

  if (student.lastName == undefined) {
    HTML.studentName.textContent = student.firstName;
  } else if (student.middleName == undefined) {
    HTML.studentName.textContent = student.firstName + " " + student.lastName;
  } else {
    HTML.studentName.textContent = student.firstName + " " + student.middleName + " " + student.lastName;
  }

  if (student.nickName != null) {
    HTML.studentName.textContent = `${student.firstName} "${student.nickName}" ${student.lastName}`;
  }

  document.querySelector(".contentpopup>h3").textContent = "House: " + student.house;
  if (student.fullName == "") {
    HTML.studentName.textContent = student.fullName + "";
  }

  if (student.prefect === true) {
    document.querySelector("#pstar").textContent = "Prefect: Yes";
  } else {
    document.querySelector("#pstar").textContent = "Prefect: No";
  }

  document.querySelector(".close").addEventListener("click", () => {
    HTML.popup.classList.remove("popup-appear");
  });
}

//DATA

function prepareObjects() {
  console.log(halfBlood);
  console.log(pureBlood);
  studentJSON.forEach(cleanData);
}

//CLEAN

function cleanData(studentData) {
  let student = Object.create(Student);

  // NAME TRIM
  let fullName = studentData.fullname.trim();
  fullName = fullName.toLowerCase();

  // FIRSTNAME
  let firstletter = fullName.substring(0, 1);
  firstletter = firstletter.toUpperCase();

  student.firstName = fullName.substring(1, fullName.indexOf(" "));
  student.firstName = firstletter + student.firstName;

  // MIDDLENAME
  student.middleName = fullName.substring(student.firstName.length + 1, fullName.lastIndexOf(" "));
  let firstletterMiddle = student.middleName.substring(0, 1);
  firstletterMiddle = firstletterMiddle.toUpperCase();
  if (student.middleName == " ") {
    student.middleName = null;
  } else if (student.middleName.includes('"')) {
    firstletterMiddle = student.middleName.substring(1, 2);
    firstletterMiddle = firstletterMiddle.toUpperCase();
    student.nickName = firstletterMiddle + fullName.substring(student.firstName.length + 3, fullName.lastIndexOf(" ") - 1);
  } else {
    student.middleName = firstletterMiddle + fullName.substring(student.firstName.length + 2, fullName.lastIndexOf(" "));
  }

  // LASTNAME
  student.lastName = fullName.substring(fullName.lastIndexOf(" ") + 1, fullName.length + 1);

  let firstletterLastName = student.lastName.substring(0, 1);
  firstletterLastName = firstletterLastName.toUpperCase();
  student.lastName = firstletterLastName + fullName.substring(fullName.lastIndexOf(" ") + 2, fullName.length + 1);

  if (fullName.includes(" ") == false) {
    student.firstName = fullName.substring(1);
    student.firstName = firstletter + student.firstName;

    student.middleName = null;
    student.lastName = null;
  }
  // IMAGES

  student.image = student.lastName + "_" + firstletter;
  student.image = student.image.toLowerCase();

  if (student.lastName == "Patil") {
    student.image = student.lastName + "_" + student.firstName;
    student.image = student.image.toLowerCase();
  } else if (student.lastName == "Finch-fletchley") {
    student.image = "fletchley_j";
  } else if (student.lastName == null) {
    student.image = null;
  }

  //GENDER

  let genderDisplay = studentData.gender;
  let firstCharGender = genderDisplay.substring(0, 1);
  firstCharGender = firstCharGender.toUpperCase();
  student.gender = firstCharGender + genderDisplay.substring(1);

  // HOUSE
  student.house = studentData.house.toLowerCase();
  student.house = student.house.trim();
  let houses = student.house.substring(0, 1);
  houses = houses.toUpperCase();
  student.house = houses + student.house.substring(1);

  //BLOODSTATUS
  halfBlood = bloodArray.half;
  pureBlood = bloodArray.pure;

  const halfBloodType = halfBlood.some(halfBlood => {
    return halfBlood === student.lastName;
  });

  const pureBloodType = pureBlood.some(pureBlood => {
    return pureBlood === student.lastName;
  });

  if (halfBloodType === true) {
    student.blood = "halfblood";
  } else if (pureBloodType === true) {
    student.blood = "pureblood";
  } else {
    student.blood = "muggle";
  }

  student.prefect = false;

  allStudents.push(student);
  showStudent(student);
}

//SHOW THE STUDENTS

function showStudent(student) {
  let klon = HTML.template.cloneNode(true).content;

  //SET PREFECT

  if (student.prefect === true) {
    klon.querySelector(".prefect").textContent = "⭐";
  } else {
    klon.querySelector(".prefect").textContent = "☆";
  }

  //CLONE

  if (student.lastName == undefined) {
    klon.querySelector(".name").textContent = student.firstName;
  } else {
    klon.querySelector(".name").textContent = student.firstName + " " + student.lastName;
  }

  if (student.gender === "girl") {
    klon.querySelector(".name").classList.add("girl");
  } else if (student.gender === "boy") {
    klon.querySelector(".name").classList.add("boy");
  }

  if (student.house == "Slytherin") {
    klon.querySelector(".crest").src = "slythcrest.jpg";
  } else if (student.house == "Gryffindor") {
    klon.querySelector(".crest").src = "gryfcrest.jpg";
  } else if (student.house == "Hufflepuff") {
    klon.querySelector(".crest").src = "images/hufcrest.png";
  } else if (student.house == "Ravenclaw") {
    klon.querySelector(".crest").src = "ravcrest.jpg";
  }

  //ATTEMPT TO RANDOMIZE BLOODSTATUS

  // if (student.bloodstatus === "muggle") {
  //   klon.querySelector(".blood").classList.add("muggle");
  // } else if (student.bloodstatus === "pureblood") {
  //   klon.querySelector(".blood").classList.add("pureblood");
  // } else (student.bloodstatus === "halfblood") {
  //   klon.querySelector(".blood").classList.add("halfblood");
  // };

  klon.querySelector(".house").textContent = student.house;
  klon.querySelector(".blood").textContent = Student.bloodstatus;

  klon.querySelector(".prefect").addEventListener("click", () => {
    console.log("set prefect");
    makePrefect(student);
  });

  HTML.dest.appendChild(klon);

  //SHOW POPUP

  HTML.dest.lastElementChild.querySelector(".name").addEventListener("click", () => {
    showPopup(student);
  });
}

//FUNCTION FOR THE FILTER

function displayList(student) {
  //EMPTY THE LIST

  document.querySelector(".list").innerHTML = "";

  //BUILD NEW LIST

  currentList.forEach(showStudent);
}

//PREFECTS

function makePrefect(clickedStudent) {
  console.log("makeprefect");
  document.querySelector("#popup_samehouse > div > button").addEventListener("click", closeError);
  document.querySelector("#popup_toomany > div > button").addEventListener("click", closeError);

  const allPrefects = allStudents.filter(student => {
    return student.prefect === true;
  });

  const prefectsOfHouse = allPrefects.some(student => {
    return student.house === clickedStudent.house;
  });

  if (clickedStudent.prefect === true) {
    clickedStudent.prefect = false;
    console.log("h");
  } else if (prefectsOfHouse) {
    clickedStudent.prefect = false;
    console.log("ERROR: To fra samme hus");
    document.querySelector("#popup_samehouse").style.display = "block";
    document.querySelector(".close").addEventListener("click", closeError);
  } else {
    clickedStudent.prefect = true;
  }
  console.log("j");
  if (allPrefects.length > 1) {
    clickedStudent.prefect = false;
    console.log("ERROR: Du kan ikke have mere end to prefects");
    document.querySelector("#popup_toomany").style.display = "block";
  }
  displayList(Student);
}

//ERROR POPUPS

function closeError() {
  console.log("close error");
  document.querySelector("#popup_toomany").style.display = "none";
  document.querySelector("#popup_samehouse").style.display = "none";
}

//FILTER

function filterGryffindor() {
  currentList = allOfStudent.filter(isGryffindor);
  displayList(currentList);
}

function filterHufflepuff() {
  currentList = allStudents.filter(isHufflepuff);
  displayList(currentList);
}
function filterRavenclaw() {
  currentList = allStudents.filter(isRavenclaw);
  displayList(currentList);
}
function filterSlytherin() {
  currentList = allStudents.filter(isSlytherin);
  displayList(currentList);
}
function showAll() {
  currentList = allStudents.filter(isAll);
  displayList(currentList);
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}
function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}
function isSlytherin(student) {
  return student.house === "Slytherin";
}

function isAll(student) {
  return student;
}

//SORTING
//PETER ULF

function sortButtonClick() {
  console.log("sortButton");

  //const sort = this.dataset.sort;
  if (this.dataset.action === "sort") {
    clearAllSort();
    console.log("forskellig fra sorted", this.dataset.action);
    this.dataset.action = "sorted";
  } else {
    if (this.dataset.sortDirection === "asc") {
      this.dataset.sortDirection = "desc";
      console.log("sortdir desc", this.dataset.sortDirection);
    } else {
      this.dataset.sortDirection = "asc";
      console.log("sortdir asc", this.dataset.sortDirection);
    }
  }
  mySort(this.dataset.sort, this.dataset.sortDirection);
}

function clearAllSort() {
  console.log("clearAllSort");
  myHeading.forEach(botton => {
    botton.dataset.action = "sort";
  });
}

function mySort(sortBy, sortDirection) {
  console.log(`mySort-, ${sortBy} sortDirection-  ${sortDirection}  `);
  let desc = 1;

  currentList = allStudents.filter(allStudents => true);

  if (sortDirection === "desc") {
    desc = -1;
  }

  currentList.sort(function(a, b) {
    var x = a[sortBy];
    var y = b[sortBy];
    if (x < y) {
      return -1 * desc;
    }
    if (x > y) {
      return 1 * desc;
    }
    return 0;
  });

  displayList(currentList);
}

//NEW FILTER

function filterBottonClick() {
  const filter = this.dataset.filter;
  clearAllSort();
  myFilter(filter);
}

function myFilter(filter) {
  console.log("myFilter", filter);
  if (filter === "all") {
    currentList = allStudents.filter(allStudents => true);
    displayList(currentList);
  } else {
    currentList = allStudents.filter(student => student.house === filter);
    displayList(currentList);
  }
}

// function selected() {
//   const theme = this.value;
//   console.log("temaet er ", theme);
//   document.querySelector(".list").dataset.theme = theme;
// }

//HACKING THE SYSTEM

function hackedSystem() {
  console.log("the system is hacked");
  const mySelf = Object.create(Student);
  mySelf.firstName = "Christina";
  mySelf.middleName = null;
  mySelf.lastName = "Jørgensen";
  allStudents.push(mySelf);

  systemIsHacked = true;
}
