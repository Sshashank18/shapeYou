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

    $('input:checkbox[class="day"]:checked').each(function() 
    {
       timings[$(this).val()] = $(this).next().val()
    });

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
        aadhar,
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
            url:'/trainer/registerForm',
            type:'PUT',
            data:data2,
            success:(data)=>{
                alert('Saved Details');
                window.location="http://127.0.0.1:3500/trainer"
                // window.location="https://shapeyou-demo.herokuapp.com/trainer"
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