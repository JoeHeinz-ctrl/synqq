import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

interface CallState {
  isInCall: boolean;
  isCalling: boolean;
  isReceivingCall: boolean;
  caller: { id: number; name: string } | null;
  callType: "audio" | "video" | null;
}

export function useWebRTC(socket: Socket | null) {
  const [callState, setCallState] = useState<CallState>({
    isInCall: false,
    isCalling: false,
    isReceivingCall: false,
    caller: null,
    callType: null,
  });

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming calls
    socket.on("incoming_call", ({ from, callType }: { from: { id: number; name: string }; callType: "audio" | "video" }) => {
      setCallState({
        isInCall: false,
        isCalling: false,
        isReceivingCall: true,
        caller: from,
        callType,
      });
    });

    // Listen for call accepted
    socket.on("call_accepted", async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallState((prev) => ({ ...prev, isCalling: false, isInCall: true }));
      }
    });

    // Listen for call rejected
    socket.on("call_rejected", () => {
      endCall();
      alert("Call was rejected");
    });

    // Listen for call ended
    socket.on("call_ended", () => {
      endCall();
    });

    // Listen for ICE candidates
    socket.on("ice_candidate", async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => {
      socket.off("incoming_call");
      socket.off("call_accepted");
      socket.off("call_rejected");
      socket.off("call_ended");
      socket.off("ice_candidate");
    };
  }, [socket]);

  const createPeerConnection = () => {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("ice_candidate", { candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      remoteStreamRef.current = event.streams[0];
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return pc;
  };

  const startCall = async (targetUserId: number, callType: "audio" | "video") => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: callType === "video",
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = createPeerConnection();
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (socket) {
        socket.emit("call_user", {
          targetUserId,
          offer,
          callType,
        });
      }

      setCallState({
        isInCall: false,
        isCalling: true,
        isReceivingCall: false,
        caller: null,
        callType,
      });
    } catch (error) {
      console.error("Error starting call:", error);
      alert("Could not access camera/microphone");
    }
  };

  const answerCall = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: callState.callType === "video",
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = createPeerConnection();
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // This would need the offer from the caller - simplified for now
      setCallState((prev) => ({
        ...prev,
        isReceivingCall: false,
        isInCall: true,
      }));

      if (socket) {
        socket.emit("answer_call", { accepted: true });
      }
    } catch (error) {
      console.error("Error answering call:", error);
      alert("Could not access camera/microphone");
    }
  };

  const rejectCall = () => {
    if (socket) {
      socket.emit("reject_call");
    }
    setCallState({
      isInCall: false,
      isCalling: false,
      isReceivingCall: false,
      caller: null,
      callType: null,
    });
  };

  const endCall = () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Notify server
    if (socket) {
      socket.emit("end_call");
    }

    setCallState({
      isInCall: false,
      isCalling: false,
      isReceivingCall: false,
      caller: null,
      callType: null,
    });
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  return {
    callState,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
  };
}
