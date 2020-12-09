
// prepare required files
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

fetch(`http://127.0.0.1:3500/trainer/signature`, {
// fetch(`https://shapeyou-demo.herokuapp.com/trainer/signature`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	})
	.then(response => response.json())
	.then(data => {
		// call the init method with meeting settings

	const meetingConfig = {
		leaveUrl:'http://127.0.0.1:3500/trainer',
		// leaveUrl:'https://shapeyou-demo.herokuapp.com/trainer',
		signature: data.meetConfig.signature,
		meetingNumber : data.meetConfig.meetingNumber,
		userName : data.meetConfig.username,
		passWord: data.meetConfig.password,
		apiKey:'lepPeTRsRo6Ap5x5Cb5gKQ'
	}
	
	
	ZoomMtg.preLoadWasm();
	ZoomMtg.prepareJssdk();
	function beginJoin() {
	  ZoomMtg.init({
		leaveUrl: meetingConfig.leaveUrl,
		success: function () {
		  console.log(meetingConfig);
		  console.log("signature", meetingConfig.signature);
		  ZoomMtg.join({
			meetingNumber: meetingConfig.meetingNumber,
			userName: meetingConfig.userName,
			signature: meetingConfig.signature,
			apiKey: meetingConfig.apiKey,
			passWord: meetingConfig.passWord,
			success: function (res) {
			  console.log("join meeting success");
			  console.log("get attendeelist");
			  ZoomMtg.getAttendeeslist({});
			  ZoomMtg.getCurrentUser({
				success: function (res) {
				  console.log("success getCurrentUser", res.result.currentUser);
				},
			  });
			},
			error: function (res) {
			  console.log(res);
			},
		  });
		},
		error: function (res) {
		  console.log(res);
		},
	  });
	}
	
	beginJoin();

});
