/*eslint-env browser*/
importData_from_PrizesByYear();
importData_from_WinnerById();

var id_selected = [];


//function that initiates the sidebarby providing the data dynamically
function loadSidebar(prizesData) {
    var used_year = [];
    var used_category = [];
    var out_year = '<option value="" Default selected> </option>';
    var out_category = '';
    var year;
    var cat;
    
    for(year of prizesData.prizes){
        if(!used_year.includes(year.year)){
            used_year.push(year.year);
            out_year += '<option value=' + year.year + '>' + year.year + '</option>';
        }
    }
    
    for(cat of prizesData.prizes){
        if(!used_category.includes(cat.category)){
            used_category.push(cat.category);
        }
    }
    
    used_category.sort();
    
    for(cat of used_category){
        out_category += '<option value=' + cat+ '>' + cat + '</option>';
    }
    
    document.getElementById("minyear").innerHTML = out_year;
    document.getElementById("maxyear").innerHTML = out_year;
    document.getElementById("dropdownCat").innerHTML = out_category;    
}




function displayData(prizesData, winnerData){
    //local variable
    //get values from webpage
    var maxyear = document.getElementById("maxyear").value;
    var minyear = document.getElementById("minyear").value;
    var category = document.getElementById("dropdownCat");
    //initiate array
    var cat_selected = [];
    
    //gloabl variable
    id_selected = [];
    
    //reverse order to have most current on top
    winnerData.laureates.reverse();
             
    /*
        check if min year and max year were selected 
        and if max year is greater than min year
    */
    if(maxyear != "" && minyear != ""){
        if(maxyear < minyear){
            alert("Please select an end year that comes after the start year!")
            return null
        }
        
        //create array with selected categories
        for(cat of category){
            if(cat.selected){
                cat_selected.push(cat.value);
            }
        }
        /*
            if no category was selected create array with
            provide categories
        */
        if(cat_selected.length === 0){
            for(cat of prizesData.prizes){
                if(!cat_selected.includes(cat.category)){
                    cat_selected.push(cat.category);
                }
            }
        }
        
        //create array to store information about which years were selected
        var year_selected = [];
        
        //fill array with selected years
        for(obj of prizesData.prizes){
            if(obj.year >= minyear && obj.year <= maxyear && cat_selected.includes(obj.category)){
                //check if year was used already in order to create box
                if(!year_selected.includes(obj.year)){
                    year_selected.push(obj.year);
                }    
            }   
        }
        
        //create array with number of entries depeding on amount of different years
        var output = [];
        for(i in year_selected){
            output[i]="";
        }
        
        //create html elements and store each year in seperate entrie of output array
        var i;
        var obj;
        var j;
        for(obj of prizesData.prizes){
            if(obj.year >= minyear && obj.year <= maxyear && cat_selected.includes(obj.category)){
                i = year_selected.indexOf(obj.year);
                output[i] += '<li class="dropdown-cat">'+
                                '<div class="dropbtn-cat">'+
                                    '<div onclick="displayDetails(\'content-'+ obj.year+obj.category+'\')">'+ '<p>'+obj.category+'</p><i class="fa fa-caret-down"></i>'+
                                    '</div>'+
                                '</div>'+
                                '<ul id="content-'+obj.year+obj.category+'">';
                
                //loop through each winner in a chosen year and category
                for(j of obj.laureates){
                    output[i] += '<li class="dropdown-content" id="dropdown-content-'+j.id+'">'+
                                    '<div class="dropbtn-content">'+
                                        '<div onclick="displayDetails(\'content-'+j.id+'\')">'+
                                            '<p>Name: '+j.firstname+' '+j.surname+'</p><i class="fa fa-caret-down"></i>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="content">';
                    if(Object.keys(obj).includes("overallMotivation")){
                        output[i] += '<div class="motivation"><p>Overall Motivation: '+obj.overallMotivation+'</p></div>';
                    }else{
                        output[i] += '<div class="motivation"><p>Motivation: '+j.motivation+'</p></div>';
                    }
                                        
                    output[i] +='<div id="content-'+j.id+'">';                             
                    
                    //add personal and prizes related details of a winner
                    output[i] += detailedInfo(winnerData, j.id);
                    
                    output[i] += '</div></div></li>'; 
                }
                output[i] += '</ul></li>';
            }   
        }
        
        //wrap the year box around the content
        for(i in year_selected){
            output[i] = '<li class="dropdown-year">' +
                            '<div class="dropbtn-year">'+
                                '<div onclick="displayDetails(\'content-'+year_selected[i]+'\')">' +
                                    '<p>'+year_selected[i]+'</p><i class="fa fa-caret-down"></i>'+
                                '</div>'+
                                '<form><p>Display Gender:</p>'+
                                    '<input type="radio" name="gender" onclick="genderSelection(\''+year_selected[i]+'\', null)" value="both" checked><p>Both</p>'+
                                    '<input type="radio" name="gender" onclick="genderSelection(\''+year_selected[i]+'\', \'female\')" value="female"><p>Female</p>'+
                                    '<input type="radio" name="gender" onclick="genderSelection(\''+year_selected[i]+'\', \'male\')" value="male"><p>Male</p>'+
                                '</form>'+
                            '</div>'+
                            '<ul id="content-'+year_selected[i]+'">'+
                                output[i]+
                            '</ul>'+
                        '</li>';
        }
        
        
        var html_out = "<ul>";
        for(i of output){
            html_out += i;
        }
        
        html_out += "</ul>";
        //end of html creating process
        
        //display the html elements in webpage
        document.getElementById("output_area").innerHTML = html_out;
        
        //function call to select gender after submit button was pressed
        var gender="";
        if(document.getElementsByClassName("nav_radio")[0].checked){
            gender=null;   
        }else if(document.getElementsByClassName("nav_radio")[1].checked){
            gender="female";   
        }else{
            gender='male';       
        }
        genderSelection(null, gender);
        
    }else{
        window.alert("Please select a start and end year!")
        return null
    }
}
    


function detailedInfo(winnerData, winnerId){
    var output = '';
    var obj;
    var prz;
    var aff;
    
    for(obj of winnerData.laureates){
        if(obj.id === winnerId){
            id_selected.push(obj.id);
            if(obj.died === "0000-00-00"){
                var dead = "-";
            }else{
                var dead = obj.died;
            }
            if(obj.born === "0000-00-00"){
                var born = "-";
            }else{
                var born = obj.born;
            }

            output += '<div class="personalDetails">'+
                        '<p>Personal:</p>'+
                        '<p>Date of Birth: </p><p>'+born+'</p>'+
                        '<p>Date of Death: </p><p>'+dead+'</p>'+
                        '<p>City of Birth: </p><p>'+obj.bornCity+'</p>'+
                        '<p>Country of Birth: </p><p>'+obj.bornCountry+'</p>'+
                        '<p>Gender: </p><p>'+obj.gender+'</p>'+
                      '</div>';
            
            output += '<div class="prizesDetails"><p>Prizes:</p>';
            
            for(prz of obj.prizes){
                output += '<p class="awards">Category of Award: </p><p>'+prz.category+'</p><p class="affi">Affiliations: </p>';
                for(aff of prz.affiliations){
                    output += '<p class="affi-cont">Name: </p><p>'+aff.name+'</p><p  class="affi-cont">City: </p><p>'+aff.city+'</p><p  class="affi-cont">Country: </p><p>'+aff.country+'</p>';
                }
            }
            output += '</div>';
        }     
    }
    return output;
}

//function to display the gender
function genderSelection(year, gender){
    var x;
    var obj;
    for(obj of winnerArr.laureates){
        //check for id's which are used in order to display winners
        if(id_selected.includes(obj.id)){
            //if called from sidebar year is empyt
            if(year === null){
                if(gender === 'male'){
                    //identifier for the html element
                    var x = "dropdown-content-"+obj.id;
                    if(obj.gender === 'male'){
                        //show html element
                        document.getElementById(x).style.display = "block";
                    }else{
                        //hide html element
                        document.getElementById(x).style.display = "none";
                    }
                }
                else if(gender === 'female'){
                    //identifier for the html element
                    var x = "dropdown-content-"+obj.id;
                    if(obj.gender === 'female'){
                        //show html element
                        document.getElementById(x).style.display = "block";
                    }else{
                        //hide html element
                        document.getElementById(x).style.display = "none";
                    }
                }
                else{
                    //identifier for the html element
                    var x = "dropdown-content-"+obj.id;
                    //show html element
                    document.getElementById(x).style.display = "block";
                }
            //if called from a specific year
            }else{
                if(gender === 'male'){
                    for(x of obj.prizes){
                        if(x.year === year){
                            //identifier for the html element
                            var x = "dropdown-content-"+obj.id;
                            if(obj.gender === 'male'){
                                //show html element
                                document.getElementById(x).style.display = "block";
                            }else{
                                //hide html element
                                document.getElementById(x).style.display = "none";
                            }    
                        }  
                    }
                }
                else if(gender === 'female'){
                    for(x of obj.prizes){
                        if(x.year === year){
                            //identifier for the html element
                            var x = "dropdown-content-"+obj.id;
                            if(obj.gender === 'female'){
                                //show html element
                                document.getElementById(x).style.display = "block";
                            }else{
                                //hide html element
                                document.getElementById(x).style.display = "none";
                            }
                        } 
                    }
                }
                else{
                    for(x of obj.prizes){
                        if(x.year === year){
                            //identifier for the html element
                            var x = "dropdown-content-"+obj.id;
                            //show html element
                            document.getElementById(x).style.display = "block";
                        }
                    }
                }
            }    
        }
    }
}


//display and hide dropwdon content
function displayDetails(value){
    //identifier for the html element
    var x = document.getElementById(value).style.display;
    if(x === "none" || x === ""){
        //show html element
        document.getElementById(value).style.display = "block";
    }else{
        //hide html element
        document.getElementById(value).style.display = "none";
    }
}