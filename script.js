const SUPABASE_URL = "https://ipwxkrcogbyfealgimej.supabase.co";
const PUBLISHABLE_KEY = "sb_publishable_6D7h8u4b6KN8vlW8h4HNWQ_VqHTmMqD";
const TABLE_URL = SUPABASE_URL + "/rest/v1/guestbook";

const headers = {
  apikey: PUBLISHABLE_KEY,
  "Content-Type": "application/json",
};

const nicknameInput = document.getElementById("nickname");
const messageInput = document.getElementById("message");
const saveButton = document.getElementById("save-button");
const list = document.getElementById("guestbook-list");

async function loadGuestbook() {
  try {
    const response = await fetch(
      TABLE_URL + "?select=nickname,message,created_at&order=created_at.desc",
      { headers }
    );
    if (!response.ok) {
      throw new Error("목록 불러오기 실패: " + response.status);
    }
    const rows = await response.json();

    list.textContent = "";
    for (const row of rows) {
      const item = document.createElement("li");
      item.textContent = row.nickname + ": " + row.message;
      list.appendChild(item);
    }
  } catch (error) {
    console.error(error);
    alert("방명록을 불러오지 못했습니다.");
  }
}

async function saveEntry() {
  const nickname = nicknameInput.value.trim();
  const message = messageInput.value.trim();

  if (nickname === "" || message === "") {
    alert("별명과 한마디를 모두 적어 주세요.");
    return;
  }

  try {
    const response = await fetch(TABLE_URL, {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({ nickname, message }),
    });
    if (!response.ok) {
      throw new Error("저장 실패: " + response.status);
    }

    nicknameInput.value = "";
    messageInput.value = "";
    await loadGuestbook();
  } catch (error) {
    console.error(error);
    alert("저장하지 못했습니다. 잠시 후 다시 해 주세요.");
  }
}

saveButton.addEventListener("click", saveEntry);
loadGuestbook();
