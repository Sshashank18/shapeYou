

$('#formSubmit').click(e => {
    e.preventDefault();

    let image = $('#inputimage3')[0].files[0];
    let url = null;

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
                }
            }).then(res=>{
            console.log(res);
        })
    })
    .catch(err=>console.log(err));  

    
});

