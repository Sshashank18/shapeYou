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
    }else{
        $('.counselling').attr('hidden','');
        $('.wellness').attr('hidden','');
        $('.fitness').attr('hidden','');
    }
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

    if(image!=undefined){
        fetch("https://api.cloudinary.com/v1_1/deucalion/image/upload",{                 
            method:"post",
            body:dataI
        })    
        .then(res => res.json())
        .then(data => {
            var data2= null;
            $.ajax({
                url:'/trainer/getDetails',
                type:'GET',
                success:(data1)=>{

                    if((data1.subCategories.length>1 || data1.subCategories.length==0) && (subcategories.length>0)){
                        console.log('in');
                        data2={
                            image:data.url,
                            about:$('#inputabout3').val(),
                            dob:$('#inputdob3').val(),
                            subcategories: subcategories
                        }
                    }else{
                        data2={
                            image:data.url,
                            about:$('#inputabout3').val(),
                            dob:$('#inputdob3').val(),
                            subcategories: data1.subCategories
                        }
                    }

                    $.ajax({
                        url:'/trainer/submitDetails',
                        type:'PUT',
                        data:data2,
                        success:(data)=>{
                            alert('Saved Details');
                            window.location= '/trainer';
                        }
                    });
                    }
                
            });
           
        })
        .catch(err=>console.log(err));  
    }
    else{
        var data2= null;
        $.ajax({
            url:'/trainer/getDetails',
            type:'GET',
            success:(data1)=>{

                if((data1.subCategories.length>1 || data1.subCategories.length==0) && (subcategories.length>0)){
                    console.log('in');
                    data2={
                        image:null,
                        about:$('#inputabout3').val(),
                        dob:$('#inputdob3').val(),
                        subcategories: subcategories
                    }
                }else if(data1.subCategories.length>1 && subcategories.length==0){
                    data2={
                        image:null,
                        about:$('#inputabout3').val(),
                        dob:$('#inputdob3').val(),
                        subcategories: data1.subCategories
                    }
                }else{
                    data2={
                        image:null,
                        about:$('#inputabout3').val(),
                        dob:$('#inputdob3').val(),
                    }
                }

                $.ajax({
                    url:'/trainer/submitDetails',
                    type:'PUT',
                    data:data2,
                    success:(data)=>{
                        alert('Saved Details');
                        window.location= '/trainer';
                    }
                });
                }
            
        });
    }
   
});


