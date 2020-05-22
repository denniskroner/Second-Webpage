/*eslint-env browser*/


//initiate a global variable containing the json file content
var prizesArr;

//function that imports data when called
function importData_from_PrizesByYear(){
    //assign new object to variable
    var xmlhttp_prizes = new XMLHttpRequest();
    //assign file source 
    var url_prizes = "../json/prizesByYear.json";

    //define function to be called each time readyState property changes
    xmlhttp_prizes.onreadystatechange = function () {
        //if request finished & response is ready & status is ok then
        if(this.readyState == 4 && this.status == 200){
            //assign json file content to gloabal variable
            prizesArr = JSON.parse(this.responseText);
        }
    };
    //specifying the type of request
    xmlhttp_prizes.open("GET", url_prizes, false);
    xmlhttp_prizes.send();
}
