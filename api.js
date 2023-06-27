export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJjMjI5NWZjNi1kNDQ1LTQ2MTMtOTFkZC05ZmQ0NWFkMTY4MmEiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY4Nzg2MTc1NCwiZXhwIjoxNjkwNDUzNzU0fQ.PL2Qr4bNXEfrJRD2KXuO636wpSp98lQeDxkR_LItKn4";
// API call to create meeting
export const createMeeting = async ({ token }) => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const { roomId } = await res.json();
  return roomId;
};