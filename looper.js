
var init = function() {


	//VARIABLES							
	var playback = false,
		overdubbing = false,
		playRecordButton = document.getElementById('record'),
		audioContext,
		osc,
		rec1,
		loopLength,
		loopRepetition,
		overdubs = [],

		// START NEW AUDIO CONTEXT
		audioContext = new AudioContext;


		// DEFINE NODES
		LooperInput = audioContext.createGain();
		LooperOutput = audioContext.createGain();
		Recorder = new Recorder(LooperInput);
		

		// INITIAL CONNECTIONS
		LooperInput.gain.value = 0.5;
		LooperInput.connect(LooperOutput);
		
		LooperOutput.gain.value = 1;
		LooperOutput.connect(audioContext.destination);
		




		




	var recordSound = function() {

		if (!playback) {
			// NOT RECORDING YET

			// START RECORDING
			Recorder.record();

			document.getElementById('record').innerHTML = 'Recording...';
			console.log("recording");

			playback = true;

		
		} else {

			// OVERDUBBING
			document.getElementById('record').innerHTML = 'Overdubbing...';
			overdub();

		}


	}

	overdub = function() {

		// Restart the recording
		Recorder.stop();
		Recorder.record();

		// play last recording on loop
		playLastRecording();
	}

	playLastRecording = function() {

		
		// play the buffer
		Recorder.getBuffer(function (buffers){
			var newSource = audioContext.createBufferSource();
		    var newBuffer = audioContext.createBuffer( 2, buffers[0].length, audioContext.sampleRate );
		    newBuffer.getChannelData(0).set(buffers[0]);
		    newBuffer.getChannelData(1).set(buffers[1]);
		    newSource.buffer = newBuffer;

		    newSource.connect( LooperOutput );
		    

		    if (!overdubbing){

		    	// FIRST RECORDING

		    	loopLength = newBuffer.duration; // length of the loop
		    	console.log("First recording length = "+ loopLength);

		    	var currTime = audioContext.currentTime; //
		    	console.log("The current time = " +currTime);

		    	loopRepetition = 1;
		    	overdubbing = true;

		    	newSource.start(0);
			    overdub();
			    
			    

		    } else {

		    	// OVERDUBBING


		    	setTimeout(function(){
		    		newSource.start(0);
			        overdub();
			        loopRepetition++
			        console.log("This loopRepetition = "+ loopRepetition )
			    },loopLength*1000);

		    }

		});

	}

	var stop = function() {

		// IF WE ARE PLAYING
		if (playback) {

			// STOP ALL LOOPS
			// for (i = 0; i < Recorder.Array.length; i++){
			// 	Recorder[i].stop();
			// }

			newSource.stop(0)

			playback = false;

		} else {

			// WE ARE ALREADY STOPPED SO DO NOTHING

		}
	}


	var play = function() {
		
		// IF NOT ALREADY PLAYING
		if (!playback) {

			// PLAY ALL LOOPS
			for (i = 0; i < Recorder.Array.length; i++){
				Recorder[i].play();
			}

			playback = true;

		} else {

			// WE ARE ALREADY PLAYING SO DO NOTHING
			return;
		}
	}



	playSound = function() {
		console.log('playing');
		osc = audioContext.createOscillator();
		osc.connect(LooperInput);
		osc.start(0);
	}

	stopSound = function() {
		console.log('stopped');
		osc.stop(0);
		// osc.disconnect();
	}



	// EVENT LISTENERS
	document.getElementById('record').addEventListener('click', recordSound, false);
	// document.getElementById('play').addEventListener('click', play, false);
	// document.getElementById('stop').addEventListener('click', stop, false);
	document.getElementById('sound').addEventListener('mousedown', playSound, false);
	document.getElementById('sound').addEventListener('mouseup', stopSound, false);


}



