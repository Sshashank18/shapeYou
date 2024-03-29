var selectedCategory = null;

// $("select.categories").change(function(){
//     selectedCategory = 'Category'; 
//     // $(this).children("option:selected").val();
//     if (selectedCategory == 'Fitness Trainer'){
//         $('.fitness').removeAttr('hidden');
//         $('.wellness').attr('hidden','');
//         $('.counselling').attr('hidden','');
//     }
//     else if (selectedCategory == 'Wellness'){
//         $('.wellness').removeAttr('hidden');
//         $('.fitness').attr('hidden','');
//         $('.counselling').attr('hidden','');
//     }
//     else if (selectedCategory == 'Counselling'){
//         $('.counselling').removeAttr('hidden');
//         $('.wellness').attr('hidden','');
//         $('.fitness').attr('hidden','');
//     }else{
//         $('.counselling').attr('hidden','');
//         $('.wellness').attr('hidden','');
//         $('.fitness').attr('hidden','');
//     }
// });


$('#uploadImg').click(e=>{
    e.preventDefault();
    var fd = new FormData();
    var files = $('#inputimage3')[0].files;
    fd.append('file',files[0]);

    $.ajax({
        url: '/trainer/uploadImg',
        // url: 'http://127.0.0.1:3500/trainer/uploadImg',
        type: 'POST',
        data: fd,
        contentType: false,
        processData: false,
        success:(res)=>{
            if(res.message){alert(res.message);}
            else{
                alert(res.location);
            }
        }
    });
});

$('#uploadAadhar').click(e=>{
    e.preventDefault();
    var fd = new FormData();
    var files = $('#adhaar')[0].files;
    fd.append('file',files[0]);

    $.ajax({
        url: '/trainer/uploadAadhar',
        // url: 'http://127.0.0.1:3500/trainer/uploadAadhar',
        type: 'POST',
        data: fd,
        contentType: false,
        processData: false,
        success:(res)=>{
            if(res.message){alert(res.message);}
            else{
                alert(res.location);
            }
        }
    });
});

$('#uploadResume').click(e=>{
    e.preventDefault();
    var fd = new FormData();
    var files = $('#resume')[0].files;
    fd.append('file',files[0]);

    $.ajax({
        url: '/trainer/uploadCV',
        // url: 'http://127.0.0.1:3500/trainer/uploadAadhar',
        type: 'POST',
        data: fd,
        contentType: false,
        processData: false,
        success:(res)=>{
            if(res.message){alert(res.message);}
            else{
                alert(res.location);
            }
        }
    });
});

$(function(){
    var dtToday = new Date();
    
    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if(month < 10)
        month = '0' + month.toString();
    if(day < 10)
        day = '0' + day.toString();
    
    var maxDate = year + '-' + month + '-' + day;
    $('#dob').attr('max', maxDate);
});

document.getElementById('mon').onchange = function() {
    document.getElementById('monday').disabled = !this.checked;
};
document.getElementById('tue').onchange = function() {
    document.getElementById('tuesday').disabled = !this.checked;
};
document.getElementById('wed').onchange = function() {
    document.getElementById('wednesday').disabled = !this.checked;
};
document.getElementById('thur').onchange = function() {
    document.getElementById('thursday').disabled = !this.checked;
};
document.getElementById('fri').onchange = function() {
    document.getElementById('friday').disabled = !this.checked;
};
document.getElementById('sat').onchange = function() {
    document.getElementById('saturday').disabled = !this.checked;
};
document.getElementById('sun').onchange = function() {
    document.getElementById('sunday').disabled = !this.checked;
};

$('#formSubmit').click(e => {

    e.preventDefault();
    var subcategories = [];
    $.each($(`input[name='Subcategory']:checked`), function(){
        subcategories.push($(this).val());
    });
    var name = $(`input[id='name']`).val();
    var dob = $(`input[name='DateofBirth']`).val();
    var address = $(`input[name='address']`).val();
    var contact = $(`input[name='contact']`).val();
    var alternateContact = $(`input[name='alternateContact']`).val();
    var amount = $(`input[name='amount']`).val();
    var experiencePlace = $(`input[name='experiencePlace']`).val();
    var experienceYears = $(`input[name='experienceYears']`).val();
    var about = $(`textarea[name='About']`).val();
    var certification = $(`input[name='certification']`).val();
    var education = $(`input[name='education']`).val();
    var socialHandle = $(`input[name='socialHandle']`).val();
    var website = $(`input[name='website']`).val();
    var aadhar = $(`input[name='aadhar']`).val();
    var referral = $(`input[name='referral']`).val();
    var payment = [];
    var timings = {};
    $('input:checkbox[name="payment"]:checked').each(function() 
    {
       payment.push($(this).val())
    });


    $('input:checkbox[name="day"]:checked').each(function() 
    {
       timings[$(this).val()] = $(this).next().val()
    });

    console.log(timings);

    var data2={
        name,
        dob,
        address,
        contact,
        alternateContact,
        amount,
        experiencePlace,
        experienceYears,
        about,
        certification,
        education,
        socialHandle,
        website,
        referral,
        payment,
        timings,
        subcategories
    }
    console.log(data2);
    $('.errorName').html(' ');
    $('.errorContact').html(' ');
    $('.errorAmount').html(' ');
    $('.errorExperiencePlace').html(' ');
    $('.errorExperienceYears').html(' ');
    $('.errorAbout').html(' ');
    $('.errorCertification').html(' ');
    $('.errorEducation').html(' ');
    $('.errorAadhar').html(' ');
    $('.errorSubcategories').html(' ');

    if(name && contact && amount && experiencePlace && experienceYears && about && certification && education && aadhar && subcategories.length!=0) {
        
        $.ajax({
            url:'/trainer/aadhar',
            type:'GET',
            success:(d)=>{
                if(d.message){
                    alert(d.message);
                }
                else{
                    $.ajax({
                        url:'/trainer/registerForm',
                        type:'PUT',
                        data:data2,
                        success:(data)=>{
                            alert('Saved Details');
                            // window.location="http://127.0.0.1:3500/trainer"
                            // window.location="https://shapeyou-demo.herokuapp.com/trainer"
                            window.location="https://shapeyou.in/trainer"
                        }
                    });
                }
            }
        });
    }else{

        if(!name){
            $('.errorName').html('Please fill this field');
            $('.errorName').css('color','red');
        }
        if(!contact){
            $('.errorContact').html('Please fill this field');
            $('.errorContact').css('color','red');
        }
        if(!amount){
            $('.errorAmount').html('Please fill this field');
            $('.errorAmount').css('color','red');
            
        }
        if(!experiencePlace){
            $('.errorExperiencePlace').html('Please fill this field');
            $('.errorExperiencePlace').css('color','red');
            
        }
        if(!experienceYears){
            $('.errorExperienceYears').html('Please fill this field');
            $('.errorExperienceYears').css('color','red');
            
        }
        if(!about){
            $('.errorAbout').html('Please fill this field');
            $('.errorAbout').css('color','red');
            
        }
        if(!certification){
            $('.errorCertification').html('Please fill this field');
            $('.errorCertification').css('color','red');
            
        }
        if(!education){
            $('.errorEducation').html('Please fill this field');
            $('.errorEducation').css('color','red');
            
        }
        if(!aadhar){
            $('.errorAadhar').html('Please fill this field');
            $('.errorAadhar').css('color','red');
            
        }
        if(subcategories.length!=0){
            $('.errorSubcategories').html('Please fill this field');
            $('.errorSubcategories').css('color','red');
        }
        alert('Fill all fields');

    }


});