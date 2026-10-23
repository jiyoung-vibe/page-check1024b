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
const errorMessage = document.getElementById("error-message");
const list = document.getElementById("guestbook-list");

function showError(text) {
  errorMessage.textContent = text;
}

function clearError() {
  errorMessage.textContent = "";
}

// 서버가 돌려준 실패 이유를 읽는다. 읽을 수 없으면 상태 코드를 쓴다.
async function readReason(response) {
  try {
    const body = await response.json();
    return body.message || JSON.stringify(body);
  } catch (error) {
    return response.status + " " + response.statusText;
  }
}

async function loadGuestbook() {
  clearError();
  try {
    const response = await fetch(
      TABLE_URL + "?select=nickname,message,created_at&order=created_at.desc",
      { headers }
    );
    if (!response.ok) {
      throw new Error(await readReason(response));
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
    showError("방명록을 불러오지 못했습니다. 이유: " + error.message);
  }
}

async function saveEntry() {
  const nickname = nicknameInput.value.trim();
  const message = messageInput.value.trim();

  if (nickname === "" || message === "") {
    alert("별명과 한마디를 모두 적어 주세요.");
    return;
  }

  clearError();
  try {
    const response = await fetch(TABLE_URL, {
      method: "POST",
      headers: { ...headers, Prefer: "return=minimal" },
      body: JSON.stringify({ nickname, message }),
    });
    if (!response.ok) {
      throw new Error(await readReason(response));
    }

    nicknameInput.value = "";
    messageInput.value = "";
    await loadGuestbook();
  } catch (error) {
    console.error(error);
    showError("방명록을 남기지 못했습니다. 이유: " + error.message);
  }
}

saveButton.addEventListener("click", saveEntry);
loadGuestbook();
