var selectedCategory = null;

$("select.categories").change(function(){
    selectedCategory = $(this).children("option:selected").val();
    if (selectedCategory == 'Fitness Trainer'){
        $('.fitness').removeAttr('hidden');
        $('.wellness').attr('hidden','');
        $('.counselling').attr('hidden','');
    }
    else if (selectedCategory == 'Wellness'){
        $('.wellness').removeAttr('hidden');
        $('.fitness').attr('hidden','');
        $('.counselling').attr('hidden','');
    }
    else if (selectedCategory == 'Counselling'){
        $('.counselling').removeAttr('hidden');
        $('.wellness').attr('hidden','');
        $('.fitness').attr('hidden','');
    };
});



$('#formSubmit').click(e => {
    e.preventDefault();

    let image = $('#inputimage3')[0].files[0];
    let url = null;

    var subcategories = [];
    $.each($(`input[name='${selectedCategory}']:checked`), function(){
        subcategories.push($(this).val());
    });

    const dataI = new FormData();
    dataI.append('file',image);
    dataI.append('upload_preset','shapeYou');
    dataI.append('cloud_name','deucalion');


    fetch("https://api.cloudinary.com/v1_1/deucalion/image/upload",{                 
            method:"post",
            body:dataI
        })    
        .then(res => res.json())
        .then(data => {
            $.ajax({
                url:'/trainer/submitDetails',
                type:'PUT',
                data:{
                    image:data.url,
                    about:$('#inputabout3').val(),
                    dob:$('#inputdob3').val(),
                    subcategories: subcategories
                    },
                success:(data)=>{
                    alert('Saved Details');
                    window.location= '/trainer/userInfo';
                }
            });
        })
        .catch(err=>console.log(err));  
});

