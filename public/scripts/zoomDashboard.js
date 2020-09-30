import { ZoomMtg } from '@zoomus/websdk'

// prepare required files
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

	fetch(`http://127.0.0.1:3500/trainer/signature`, {
			method: 'POST',
		})
		.then(response => {
			// call the init method with meeting settings
      const joinUrl = "/trainer/meeting/?" + `meetingNumber=${response.meetingNumber}&username=${response.username}&signature=${response.signature}&password=${response.password}`;
      window.open(joinUrl);

	});

var sign = $('#signature');
console.log(sign);