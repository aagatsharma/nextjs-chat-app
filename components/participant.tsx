import React from "react";
import {
  ParticipantLoop,
  ParticipantName,
  useParticipants,
} from "@livekit/components-react";

const Participant = () => {
  const participants = useParticipants();

  // Get participant names
  // const participantNames = participants.map(
  //   (participant) => participant.identity
  // );

  // Calculate total number of participants
  const totalParticipants = participants.length;

  return (
    <div className="absolute z-10 left-2 top-2">
      {/* <h2>Participant Names</h2>
      <ul>
        {participantNames.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul> */}
      <p className="text-lg">Total Users: {totalParticipants}</p>
    </div>
  );
};

export default Participant;
