import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

interface CallState {
  isInCall: boolean;
  isCalling: boolean;
  isReceivingCall: boolean;
  caller: { id: number; name: string } | null;
  callType: "audio" | "video" | null;
}

export function useWebRTC(socket: Socket | null, _userId?: number) {
  const [callState, setCallState] = useState<CallState>({
    isInCall: false,
    isCalling: false,
    isReceivingCall: false,
    caller: null,
    callType: null,
  });

  const [targetUserId, setTargetUserId] = useState<number | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming calls
    socket.on("incoming_call", async ({ from, offer, callType }: { from: { id: number; name: string }; offer: RTCSessionDescriptionInit; callType: "audio" | "video" }) => {
      console.log("📞 Incoming call from:", from);
      setCallState({
        isInCall: false,
        isCalling: false,
        isReceivingCall: true,
        caller: from,
        callType,
      });
      setTargetUserId(from.id);
      
      // Store the offer for when user accepts
      if (!peerConnectionRef.current) {
        const pc = createPeerConnection(from.id);
        peerConnectionRef.current = pc;
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
      }
    });

    // Listen for call accepted
    socket.on("call_accepted", async ({ answer }: { answer: RTCSessionDescriptionInit; from: number }) => {
      console.log("✅ Call accepted, setting remote description");
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallState((prev) => ({ ...prev, isCalling: false, isInCall: true }));
      }
    });

    // Listen for call rejected
    socket.on("call_rejected", () => {
      console.log("❌ Call was rejected");
      endCall();
      alert("Call was rejected");
    });

    // Listen for call ended
    socket.on("call_ended", () => {
      console.log("📴 Call ended by other party");
      endCall();
    });

    // Listen for ICE candidates
    socket.on("ice_candidate", async ({ candidate, from }: { candidate: RTCIceCandidateInit; from: number }) => {
      console.log("🧊 Received ICE candidate from:", from);
      if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
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

  const createPeerConnection = (remoteUserId: number) => {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        console.log("🧊 Sending ICE candidate to:", remoteUserId);
        socket.emit("ice_candidate", { 
          candidate: event.candidate,
          targetUserId: remoteUserId
        });
      }
    };

    pc.ontrack = (event) => {
      console.log("📺 Received remote track:", event.track.kind);
      remoteStreamRef.current = event.streams[0];
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        console.log("✅ Remote video element updated");
      }
      // Auto-transition to connected state when we receive tracks
      setCallState((prev) => ({ ...prev, isCalling: false, isInCall: true }));
    };

    pc.oniceconnectionstatechange = () => {
      console.log("🔌 ICE connection state:", pc.iceConnectionState);
      if (pc.iceConnectionState === "connected" || pc.iceConnectionState === "completed") {
        console.log("✅ Call connected!");
        setCallState((prev) => ({ ...prev, isCalling: false, isInCall: true }));
      } else if (pc.iceConnectionState === "failed" || pc.iceConnectionState === "disconnected") {
        console.log("❌ Call connection failed/disconnected");
        endCall();
      }
    };

    return pc;
  };

  const startCall = async (targetUserId: number, callType: "audio" | "video") => {
    try {
      console.log("📞 Starting call to:", targetUserId);
      setTargetUserId(targetUserId);
      
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: callType === "video",
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log("✅ Local video stream set");
      }

      const pc = createPeerConnection(targetUserId);
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => {
        console.log("➕ Adding track:", track.kind);
        pc.addTrack(track, stream);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (socket) {
        console.log("📤 Sending call offer");
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
      alert("Could not access camera/microphone. Please grant permissions.");
      endCall();
    }
  };

  const answerCall = async () => {
    try {
      console.log("✅ Answering call");
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: callState.callType === "video",
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        console.log("✅ Local video stream set (answering)");
      }

      const pc = peerConnectionRef.current;
      if (!pc) {
        console.error("❌ No peer connection found");
        return;
      }

      stream.getTracks().forEach((track) => {
        console.log("➕ Adding track (answering):", track.kind);
        pc.addTrack(track, stream);
      });

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (socket && targetUserId) {
        console.log("📤 Sending answer to:", targetUserId);
        socket.emit("answer_call", { 
          answer,
          targetUserId
        });
      }

      setCallState((prev) => ({
        ...prev,
        isReceivingCall: false,
        isCalling: false,
        isInCall: true,
      }));
    } catch (error) {
      console.error("Error answering call:", error);
      alert("Could not access camera/microphone. Please grant permissions.");
      rejectCall();
    }
  };

  const rejectCall = () => {
    console.log("❌ Rejecting call");
    if (socket && targetUserId) {
      socket.emit("reject_call", { targetUserId });
    }
    setCallState({
      isInCall: false,
      isCalling: false,
      isReceivingCall: false,
      caller: null,
      callType: null,
    });
    setTargetUserId(null);
  };

  const endCall = () => {
    console.log("📴 Ending call");
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

    // Notify server only if we have a target
    if (socket && targetUserId) {
      socket.emit("end_call", { targetUserId });
    }

    setCallState({
      isInCall: false,
      isCalling: false,
      isReceivingCall: false,
      caller: null,
      callType: null,
    });
    setTargetUserId(null);
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
