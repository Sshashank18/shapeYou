import { ZoomMtg } from '@zoomus/websdk'

// prepare required files
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

console.log('enter');


	fetch(`http://127.0.0.1:3500/trainer/signature`, {
			method: 'POST',
			body: JSON.stringify({ meetingData: meetConfig })
		})
		.then(result => result.text())
		.then(response => {
			// call the init method with meeting settings
			ZoomMtg.init({
				leaveUrl: 'http://127.0.0.1:3500/trainer/zoomDashboard',
				isSupportAV: true,
				// on success, call the join method
				success: function() {	
					ZoomMtg.join({
						// pass your signature response in the join method
						signature: response,
						apiKey: 'lepPeTRsRo6Ap5x5Cb5gKQ',
						meetingNumber: 12345,
						userName: 'shashank',
					})		
        },
        error(res) { 
          console.log(res) 
        }
			})
	})

var sign = $('#signature');
console.log(sign);