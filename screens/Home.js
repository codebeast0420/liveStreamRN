import React, { useState } from "react";
import {
	SafeAreaView,
	TouchableOpacity,
	Text,
	TextInput,
	View,
	FlatList,
} from "react-native";
import {
	MeetingProvider,
	useMeeting,
	useParticipant,
	MediaStream,
	RTCView,
} from "@videosdk.live/react-native-sdk";
import { createMeeting, token } from "../api";

function JoinScreen(props) {
	const [meetingVal, setMeetingVal] = useState("");
	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: "#F6F6FF",
				justifyContent: "center",
				paddingHorizontal: 6 * 10,
			}}
		>
			<TouchableOpacity
				onPress={() => {
					props.getMeetingId();
					props.setServer(true);
				}}
				style={{ backgroundColor: "#1178F8", padding: 12, borderRadius: 6 }}
			>
				<Text style={{ color: "white", alignSelf: "center", fontSize: 18 }}>
					Create Stream
				</Text>
			</TouchableOpacity>

			<Text
				style={{
					alignSelf: "center",
					fontSize: 22,
					marginVertical: 16,
					fontStyle: "italic",
					color: "grey",
				}}
			>
				---------- OR ----------
			</Text>
			<TextInput
				value={meetingVal}
				onChangeText={setMeetingVal}
				placeholder={"XXXX-XXXX-XXXX"}
				style={{
					padding: 12,
					borderWidth: 1,
					borderRadius: 6,
					fontStyle: "italic",
				}}
			/>
			<TouchableOpacity
				style={{
					backgroundColor: "#1178F8",
					padding: 12,
					marginTop: 14,
					borderRadius: 6,
				}}
				onPress={() => {
					props.getMeetingId(meetingVal);
				}}
			>
				<Text style={{ color: "white", alignSelf: "center", fontSize: 18 }}>
					Watch Stream
				</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const Button = ({ onPress, buttonText, backgroundColor }) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				backgroundColor: backgroundColor,
				justifyContent: "center",
				alignItems: "center",
				padding: 12,
				borderRadius: 4,
			}}
		>
			<Text style={{ color: "white", fontSize: 12 }}>{buttonText}</Text>
		</TouchableOpacity>
	);
};

function ControlsContainer({ join, leave, toggleWebcam, toggleMic }) {
	return (
		<View
			style={{
				padding: 24,
				flexDirection: "row",
				justifyContent: "space-between",
			}}
		>
			<Button
				onPress={() => {
					join();
				}}
				buttonText={"Join"}
				backgroundColor={"#1178F8"}
			/>
			<Button
				onPress={() => {
					toggleWebcam();
				}}
				buttonText={"Toggle Webcam"}
				backgroundColor={"#1178F8"}
			/>
			<Button
				onPress={() => {
					toggleMic();
				}}
				buttonText={"Toggle Mic"}
				backgroundColor={"#1178F8"}
			/>
			<Button
				onPress={() => {
					leave();
				}}
				buttonText={"Leave"}
				backgroundColor={"#FF0000"}
			/>
		</View>
	);
}

function ParticipantView({ participantId }) {
	const { webcamStream, webcamOn } = useParticipant(participantId);

	return webcamOn && webcamStream ? (
		<RTCView
			streamURL={new MediaStream([webcamStream.track]).toURL()}
			objectFit={"cover"}
			style={{
				height: 600,
				marginVertical: 8,
				marginHorizontal: 8,
			}}
		/>
	) : (
		<View
			style={{
				backgroundColor: "grey",
				height: 300,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text style={{ fontSize: 16 }}>NO MEDIA</Text>
		</View>
	);
}

function ParticipantList({ participants, isServer }) {
	return participants.length > 0 ? (
		isServer ? <ParticipantView participantId={participants[0]} /> : <ParticipantView participantId={participants[1]} />
	) : (
		<View
			style={{
				flex: 1,
				backgroundColor: "#F6F6FF",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text style={{ fontSize: 20 }}>Press Join button to enter meeting.</Text>
		</View>
	);
}

function MeetingView({ setMeetingId, isServer, setServer }) {
	const { join, leave, toggleWebcam, toggleMic, participants } = useMeeting({});
	const participantsArrId = [...participants.keys()];
	const _leave = () => {
		leave();
		setMeetingId(null);
		setServer(false);
	}


	return (
		<View style={{ flex: 1 }}>
			<ParticipantList participants={participantsArrId} isServer={isServer} />
			<ControlsContainer
				join={join}
				leave={_leave}
				toggleWebcam={toggleWebcam}
				toggleMic={toggleMic}
			/>
		</View>
	);
}

const Home = () => {
	const [meetingId, setMeetingId] = useState(null);
	const [isServer, setIsServer] = useState(false);

	const getMeetingId = async (id) => {
		const meetingId = id == null ? await createMeeting({ token }) : id;
		setMeetingId(meetingId);
	};

	return meetingId ? (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#F6F6FF" }}>
			<MeetingProvider
				config={{
					meetingId,
					micEnabled: false,
					webcamEnabled: true,
					name: "Test User",
				}}
				token={token}
			>
				<Text style={{ marginLeft: '30px', textAlign: 'center' }}>{meetingId}</Text>
				<MeetingView setMeetingId={setMeetingId} isServer={isServer} setServer={setIsServer} />
			</MeetingProvider>
		</SafeAreaView>
	) : (
		<JoinScreen getMeetingId={getMeetingId} setServer={setIsServer}/>
	);
}

export default Home;