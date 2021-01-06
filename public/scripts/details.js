
$('#uploadImg').click(e=>{
    e.preventDefault();
    var fd = new FormData();
    var files = $('#inputimage3')[0].files;
    fd.append('file',files[0]);

    $.ajax({
        url: '/trainer/uploadImg',
        // url: 'http://127.0.0.1:3500/trainer/uploadImg',
        type: 'PUT',
        data: fd,
        contentType: false,
        processData: false,
        success:(res)=>{
            if(res.message){alert(res.message);}
        }
    });
});


$('#formEdit').click(e => {
    e.preventDefault();
    
    var name = $(`input[id='name']`).val();
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
    var payment = [];
    $('input:checkbox[name="payment"]:checked').each(function() 
    {
       payment.push($(this).val())
    });
    var data2={
        name,
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
        payment,
    }
    console.log(data2);

    $.ajax({
        url:'/trainer/submitDetails',
        type:'PUT',
        data:data2,
        success:(data)=>{
            alert('Saved Details');
            window.location= '/trainer';
        }
    });

});


