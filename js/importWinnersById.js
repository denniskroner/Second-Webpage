/*eslint-env browser*/


//initiate a global variable containing the json file content
var winnerArr;

//function that imports data when called
function importData_from_WinnerById(){
    //assign new object to variable
    var xmlhttp_winner = new XMLHttpRequest();
    //assign file source 
    var url_winner = "../json/winnersById.json";

    //define function to be called each time readyState property changes
    xmlhttp_winner.onreadystatechange = function () {
        //if request finished & response is ready & status is ok then
        if(this.readyState == 4 && this.status == 200){
            //assign json file content to gloabal variable
            winnerArr = JSON.parse(this.responseText);  
        }
    };
    //specifying the type of request
    xmlhttp_winner.open("GET", url_winner, false);
    xmlhttp_winner.send();
}