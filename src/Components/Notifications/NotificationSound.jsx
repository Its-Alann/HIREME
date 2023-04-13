import defaultAudio from "../../Assets/audio/newMessage.mp3";

const playNotificationSound = (src = defaultAudio) => {
  const audio = new Audio(src);
  audio.play();
  console.log("In here");
};

export default playNotificationSound;
