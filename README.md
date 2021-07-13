# Teams
Microsoft Engage 2021 Program: Teams clone 
### Version
1.4

## Clone and Run Locally

clone version 1.3
```bash
    $ git clone  https://github.com/YashikaChopra/teams.git --branch 1.3
```

## Install dependencies
```bash
    npm install
```

## Run Server
```bash
    npm run devStart
```

## Wep app link(Deployed on Heroku)
[Teams](https://morning-dawn-31919.herokuapp.com/)

## Demo video link


## App Features
- Video-conferencing
- Audio/Video turn on/off feature
- Leave video-conference
- Copying meet abd chat room codes
- Chat before, during and after meet

### Working of app

#### Homepage

- Create button: Creates a new video-conferencing room with a unique room code 
- Join button: To join to the room whose code is entered in the text box or create a personalised meet code to enter meet
- Join chat button: To join to the chat whose code is entered in the text box(will contain chats of previous chat sessions and meets) or create a personalised chat code to enter chat

#### Video-conferencing page
- Mute/Unmute button: Allows to mute/unmute audio
- Stop Video/Play Video button: Allows to Stop/Play Video
- Copy code button: Copies the meet code to clipboard
- Leave Meeting button: To leave the video-conference
- Chat: To chat with everyone in the meet.

#### Chat room
- Enter message and hit enter to send messages to everyone in the chat room (will contain chats of previous chat sessions and meets)
- copy code: To copy chat room code


## Tech Stack
- MongoDB Atlas
- Express (Nodejs)
- Socket.io
- Peerjs (WebRTC)
- short-uuid
- Bootstrap
- JQuery
- Javascript
- ejs
- HTML
- CSS










