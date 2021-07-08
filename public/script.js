const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    // host: '/',
    // port: '4001'

    //added new
    path: '/peerjs',
    host: '/',
    port: '4000'
    // port: '443'
})

// var currentPeer

//added new
let myVideoStream;
const myVideo = document.createElement('video')
// const myScreen = document.createElement('video')

// const recordScreen = require('record-screen')

// muting ourselves so that we dont hear ourseles back
myVideo.muted = true

const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
            // currentPeer = call.peerConnection

        })
        // call.on('close', () => {
        //     video.remove()
        // })
    })

    socket.on('user-connected', userId => {
        setTimeout(() => {
            connectToNewUser(userId, stream)
        }, 100)   
    })

    // input value
    let text = $('#chat_message')
    // let peerName = $('#peername').val()
    // const peerName = localStorage.getItem("nameEntered")
    // when press enter send message
    $('html').keydown(function (e) {
        if (e.which == 13 && text.val().length !== 0) {
        console.log(text.val())
        socket.emit('message', text.val());
        text.val('')
        }
    });
    socket.on("createMessage", message => {
      // console.log(peerName)
        $("ul").append(`<li class="message"><b>Anonymous</b><br/>${message}</li>`);
        scrollToBottom()
    })
})


// const muteUnmute = () => {
//   const enabled = myVideoStream.getAudioTracks()[0].enabled;
//   if (enabled) {
//     myVideoStream.getAudioTracks()[0].enabled = false;
//     setUnmuteButton();
//   } else {
//     setMuteButton();
//     myVideoStream.getAudioTracks()[0].enabled = true;
//   }
// }


const leaveMeet = () => {
  console.log("in leave")
  // myPeer.destroy()
  window.location.href='/'
}
socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})


function connectToNewUser(userId, stream) {
    // calling user with user id -> userId, and passing our video audio wih stream
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
        currentPeer = call.peerConnection
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

// socket.on('user-connected', userId => {
//     console.log('User connected: ' + userId)
// })

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
  }
  
  
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}
  
const playStop = () => {
  // console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}
  
const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}
  
const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}


const screenRecord = () => {
  console.log("in rec")
  const recording = recordScreen('/tmp/test.mp4', {
    resolution: '1440x900' // Display resolution
  })
  
  recording.promise
    .then(result => {
      // Screen recording is done
      process.stdout.write(result.stdout)
      process.stderr.write(result.stderr)
    })
    .catch(error => {
      // Screen recording has failed
      console.error(error)
    })
  
  // As an example, stop the screen recording after 10 seconds:
  setTimeout(() => recording.stop(), 10000)
  console.log("rec 10 done")
}



// const shareScreen = () => {
//   // @ts-ignore
//   navigator.mediaDevices.getDisplayMedia({
//     video: {
//       cursor: 'always'
//     },
//     audio: {
//       echoCancellation: true,
//       noiseSuppression: true
//     }
//   }).then(stream => {
//     const videoTrack = stream.getVideoTracks()[0];
//     videoTrack.onended = () => {
//       stopScreenShare();
//     };

//     const sender = currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
//     sender.replaceTrack(videoTrack);
//   }).catch(err => {
//     console.log('Unable to get display media ' + err);
//   });
// }

// const stopScreenShare = () => {
//   const videoTrack = myVideo.getVideoTracks()[0];
//   const sender = currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
//   sender.replaceTrack(videoTrack);
// }


// const startElem = document.getElementById("start");
// const stopElem = document.getElementById("stop");


// var displayMediaOptions = {
//   video: {
//     cursor: "always"
//   },
//   audio: false
// };

// // Set event listeners for the start and stop buttons
// startElem.addEventListener("click", function(evt) {
//   startCapture();
// }, false);

// stopElem.addEventListener("click", function(evt) {
//   stopCapture();
// }, false);


// async function startCapture() {

//     // @ts-ignore
//   navigator.mediaDevices.getDisplayMedia({
//     video: {
//       cursor: 'always'
//     },
//     audio: {
//       echoCancellation: true,
//       noiseSuppression: true
//     }
//   }).then(stream => {
//     const videoTrack = stream.getVideoTracks()[0];
//     videoTrack.onended = () => {
//        this.stopScreenShare();
//     };

//     const sender = currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
//     sender.replaceTrack(videoTrack);
//   }).catch(err => {
//     console.log('Unable to get display media ' + err)
//   });
// }
    // let screenStream = await navigator.mediaDevices.getDisplayMedia({
    //   video: true
    // });
    // myPeer.call(userId, screenStream);

    // myVideoStream = stream;
    // addVideoStream(myScreen, stream)

    // myPeer.on('call', call => {
    //     const video = document.createElement('video')
    //     call.on('stream', myVideoStream => {
    //         addVideoStream(video, myVideoStream)
    //     })
    //     // call.on('close', () => {
    //     //     video.remove()
    //     // })
    // })
    
    // const video = document.createElement('video')
    // video.autoplay = true
    // console.log("in share")
    // stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
    // video.srcObject = stream
    // // stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    // // const call = myPeer.call(stream)
    // // call.on('stream', userVideoStream => {
    // //     addVideoStream(video, userVideoStream)
    // // })
    // // video.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    // videoGrid.append(video)
    // // videoGrid = video
    // console.log("af share")
    // myPeer.on('call', call => {
    //   const video = document.createElement('video')
    //   call.on('stream', myVideoStream => {
    //       addVideoStream(video, myVideoStream)
    //   })
    //   // call.on('close', () => {
    //   //     video.remove()
    //   // })
    // })
  //   console.log("af connect share")
  // } catch(err) {
  //   console.error("Error: " + err);
  // }
// }

// function stopCapture(evt) {
//   let tracks = videoGrid.srcObject.getTracks();

//   tracks.forEach(track => track.stop());
//   videoGrid.srcObject = null;

