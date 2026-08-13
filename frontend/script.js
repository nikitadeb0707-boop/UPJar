/* =========================================================
   UPJAR - FRONTEND JAVASCRIPT (DIRECT FASTAPI + SUPABASE API)
   ========================================================= */

// Dynamic backend API URL pointing directly to FastAPI port 8000
const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8000`;


/* =========================================================
   CUSTOM POPUP TOAST NOTIFICATIONS (NO DEFAULT BROWSER ALERTS)
   ========================================================= */

function showToast(message, type = 'success', duration = 3000) {
    let container = document.getElementById("customToastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "customToastContainer";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `custom-toast ${type}`;
    const iconSymbol = type === 'success' ? '✓' : '✕';
    toast.innerHTML = `<span class="custom-toast-icon">${iconSymbol}</span><span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);

    // Trigger smooth slide-in
    setTimeout(() => toast.classList.add("show"), 10);

    // Auto dismiss
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 350);
    }, duration);
}


/* =========================================================
   1. AUTHENTICATION (REGISTER, LOGIN, LOGOUT)
   ========================================================= */

function setupRegister() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("registerName")?.value.trim() || "";
        const email = document.getElementById("registerEmail")?.value.trim() || "";
        const phoneInput = document.getElementById("registerPhone");
        const phone = phoneInput ? phoneInput.value.trim() : "";
        const upiInput = document.getElementById("registerUpi");
        const upi = upiInput ? upiInput.value.trim() : "";
        const password = document.getElementById("registerPassword")?.value || "";
        const confirmPassword = document.getElementById("confirmPassword")?.value || "";

        if (!name || !email || !password || !confirmPassword) {
            showToast("Please fill in all required fields.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    phonenumber: phone || `9${Math.floor(100000000 + Math.random() * 900000000)}`,
                    upi_id: upi || `${name.toLowerCase().replace(/\s+/g, '')}@upi`
                })
            });

            const data = await response.json();

            if (!response.ok) {
                showToast(data.detail || "Registration failed. Please try again.", "error");
                return;
            }

            if (data.access_token) {
                localStorage.setItem("access_token", data.access_token);
            }
            if (data.user_id) {
                localStorage.setItem("user_id", data.user_id);
            }
            localStorage.setItem("userName", name);
            localStorage.setItem("userEmail", email);
            localStorage.setItem("isLoggedIn", "true");

            showToast("Account created successfully!", "success");
            setTimeout(() => {
                window.location.href = "connect.html";
            }, 600);
        } catch (error) {
            console.error("Signup Error:", error);
            showToast("Unable to connect to backend server.", "error");
        }
    });
}


function setupLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail")?.value.trim() || "";
        const password = document.getElementById("loginPassword")?.value || "";

        if (!email || !password) {
            showToast("Please enter email and password.", "error");
            return;
        }

        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                showToast(data.detail || "Invalid email or password.", "error");
                return;
            }

            if (data.access_token) {
                localStorage.setItem("access_token", data.access_token);
            }
            if (data.user_id) {
                localStorage.setItem("user_id", data.user_id);
            }
            localStorage.setItem("userEmail", email);
            localStorage.setItem("isLoggedIn", "true");

            showToast("Login successful!", "success");
            setTimeout(() => {
                window.location.href = "Dashboard.html";
            }, 600);
        } catch (error) {
            console.error("Login Error:", error);
            showToast("Unable to connect to backend server.", "error");
        }
    });
}


function setupLogout() {
    const logoutBtn = document.querySelector(".logout");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        localStorage.setItem("isLoggedIn", "false");
        showToast("Logged out successfully.", "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 400);
    });
}


/* =========================================================
   2. DASHBOARD DATA FETCHING & RENDERING (DIRECT FROM BACKEND)
   ========================================================= */

async function updateDashboard() {
    const dashboard = document.querySelector(".dashboard-body");
    if (!dashboard) return;

    const token = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Render User Info
    const userNameEl = document.getElementById("userName");
    if (userNameEl) {
        const storedName = localStorage.getItem("userName");
        const storedEmail = localStorage.getItem("userEmail");
        userNameEl.textContent = storedName || (storedEmail ? storedEmail.split('@')[0] : "there");
    }

    // Default Investment Settings
    let threshold = 100;
    let cycle = "Monthly";
    let frequency = 5;

    // Fetch User Investment Plan from Backend
    if (userId) {
        try {
            const res = await fetch(`${API_BASE_URL}/users/${userId}/investments`);
            if (res.ok) {
                const invData = await res.json();
                if (invData.total_amount_to_invest) threshold = Number(invData.total_amount_to_invest);
                if (invData.investment_frequency) cycle = invData.investment_frequency;
                if (invData.taxable_frequency) frequency = Number(invData.taxable_frequency);
            }
        } catch (e) {
            console.error("Error loading investment plan:", e);
        }
    }

    // Fetch Transactions directly from FastAPI / Supabase Backend
    let transactions = [];
    try {
        const res = await fetch(`${API_BASE_URL}/transactions/`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
            transactions = await res.json();
        }
    } catch (e) {
        console.error("Error loading transactions:", e);
    }

    // Calculate Round-up Balance and Total Invested directly from Backend Data
    let totalRoundUpPool = 0;
    transactions.forEach(tx => {
        totalRoundUpPool += Number(tx.round_up_amount || 0);
    });

    let totalInvested = 0;
    let currentPool = totalRoundUpPool;

    while (currentPool >= threshold && threshold > 0) {
        currentPool -= threshold;
        totalInvested += threshold;
    }

    // UI Updates
    setText("balance", currentPool.toFixed(2));
    setText("bigBalance", currentPool.toFixed(2));
    setText("invested", totalInvested.toFixed(2));
    setText("portfolioValue", totalInvested.toFixed(2));

    setText("bigThreshold", threshold);
    setAllText("thresholdDisplay", threshold);
    setText("cycleDisplay", cycle);
    setText("frequencyDisplay", frequency);

    const remaining = Math.max(threshold - currentPool, 0);
    setText("remaining", remaining.toFixed(2));
    setText("progressRemaining", remaining.toFixed(2));

    // Progress Bar
    const progressPercent = Math.min((currentPool / threshold) * 100, 100);
    const progressFill = document.getElementById("progressFill");
    if (progressFill) {
        progressFill.style.width = progressPercent + "%";
    }
    setText("progressPercent", Math.round(progressPercent));

    // Render Transactions List
    renderTransactions(transactions);
    updateSettingsButtonsUI(cycle, threshold, frequency);
}


/* =========================================================
   3. TRANSACTIONS & MODAL
   ========================================================= */

function openTransactionModal() {
    const modal = document.getElementById("transactionModal");
    if (modal) modal.classList.add("show");
}

function closeTransactionModal() {
    const modal = document.getElementById("transactionModal");
    if (modal) modal.classList.remove("show");
}

async function addTransaction() {
    const merchantInput = document.getElementById("merchantName");
    const amountInput = document.getElementById("transactionAmount");

    if (!merchantInput || !amountInput) return;

    const merchant = merchantInput.value.trim();
    const amount = Number(amountInput.value);

    if (!merchant) {
        showToast("Please enter a merchant name.", "error");
        return;
    }

    if (!amount || amount <= 0) {
        showToast("Please enter a valid amount.", "error");
        return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
        showToast("Session expired. Please log in again.", "error");
        setTimeout(() => { window.location.href = "login.html"; }, 600);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/transactions/ingest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ amount: amount, upi_id: 1 })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast(data.detail || "Failed to add transaction.", "error");
            return;
        }

        // Store merchant label locally for display lookup
        if (data.transaction_id) {
            const merchants = JSON.parse(localStorage.getItem("txMerchants") || "{}");
            merchants[data.transaction_id] = merchant;
            localStorage.setItem("txMerchants", JSON.stringify(merchants));
        }

        merchantInput.value = "";
        amountInput.value = "";
        closeTransactionModal();

        await updateDashboard();

        showToast(
            `Transaction Added! Original: ₹${Number(data.original_amount).toFixed(2)}, Round-up: ₹${Number(data.round_up_amount).toFixed(2)}`,
            "success"
        );
    } catch (error) {
        console.error("Add Transaction Error:", error);
        showToast("Failed to submit transaction to backend API.", "error");
    }
}


function renderTransactions(transactions) {
    const list = document.querySelector(".transaction-list");
    if (!list) return;

    list.innerHTML = "";

    if (!transactions || transactions.length === 0) {
        list.innerHTML = `
            <p style="color:#777b82; text-align:center; padding:25px;">
                No transactions recorded yet.
            </p>
        `;
        return;
    }

    const merchants = JSON.parse(localStorage.getItem("txMerchants") || "{}");

    transactions.slice().reverse().slice(0, 10).forEach(tx => {
        const row = document.createElement("div");
        row.className = "transaction-row";

        const merchantName = merchants[tx.transaction_id] || "UPI Payment";
        const dateStr = tx.timestamp ? new Date(tx.timestamp).toLocaleDateString() : "Today";
        const amount = Number(tx.original_amount || 0).toFixed(2);
        const roundUp = Number(tx.round_up_amount || 0).toFixed(2);

        row.innerHTML = `
            <div class="transaction-left">
                <div class="transaction-icon">💳</div>
                <div>
                    <strong>${escapeHTML(merchantName)}</strong>
                    <p>${dateStr}</p>
                </div>
            </div>
            <div class="transaction-right">
                <strong>₹${amount}</strong>
                <span>+₹${roundUp}</span>
            </div>
        `;
        list.appendChild(row);
    });
}


/* =========================================================
   4. INVESTMENT SETTINGS HANDLERS (DIRECT API POST)
   ========================================================= */

async function saveInvestmentSettings(cycle, threshold, frequency) {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
        await fetch(`${API_BASE_URL}/users/${userId}/investments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                investment_frequency: cycle,
                total_amount_to_invest: threshold,
                taxable_frequency: frequency
            })
        });
        showToast("Investment plan updated!", "success");
        await updateDashboard();
    } catch (e) {
        console.error("Error updating investment settings:", e);
        showToast("Failed to update investment plan.", "error");
    }
}

function setInvestmentCycle(cycle, button) {
    document.querySelectorAll(".cycle-btn").forEach(btn => btn.classList.remove("selected"));
    if (button) button.classList.add("selected");

    const currentThreshold = Number(document.getElementById("bigThreshold")?.textContent) || 100;
    const currentFreq = Number(document.getElementById("frequencyDisplay")?.textContent) || 5;
    saveInvestmentSettings(cycle.charAt(0).toUpperCase() + cycle.slice(1), currentThreshold, currentFreq);
}

function changeThreshold(amount, button) {
    document.querySelectorAll(".threshold-btn:not(.cycle-btn):not(.frequency-btn)").forEach(btn => btn.classList.remove("selected"));
    if (button) button.classList.add("selected");

    const currentCycle = document.getElementById("cycleDisplay")?.textContent || "Monthly";
    const currentFreq = Number(document.getElementById("frequencyDisplay")?.textContent) || 5;
    saveInvestmentSettings(currentCycle, Number(amount), currentFreq);
}

function setRoundOffFrequency(frequency, button) {
    document.querySelectorAll(".frequency-btn").forEach(btn => btn.classList.remove("selected"));
    if (button) button.classList.add("selected");

    const currentCycle = document.getElementById("cycleDisplay")?.textContent || "Monthly";
    const currentThreshold = Number(document.getElementById("bigThreshold")?.textContent) || 100;
    saveInvestmentSettings(currentCycle, currentThreshold, Number(frequency));
}

function updateSettingsButtonsUI(cycle, threshold, frequency) {
    // Cycle buttons
    document.querySelectorAll(".cycle-btn").forEach(btn => {
        const text = btn.textContent.trim().toLowerCase();
        if (text === cycle.toLowerCase()) btn.classList.add("selected");
        else btn.classList.remove("selected");
    });

    // Frequency buttons
    document.querySelectorAll(".frequency-btn").forEach(btn => {
        const text = btn.textContent.trim();
        if (text.startsWith(frequency.toString())) btn.classList.add("selected");
        else btn.classList.remove("selected");
    });
}


/* =========================================================
   5. ACCOUNT CONNECT HELPERS
   ========================================================= */

function connectAccount(type) {
    showToast(`${type} connected successfully!`, "success");
    setTimeout(() => { window.location.href = "Dashboard.html"; }, 600);
}

function skipConnection() {
    window.location.href = "Dashboard.html";
}


/* =========================================================
   6. DOM HELPERS & INITIALIZATION
   ========================================================= */

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setAllText(id, value) {
    document.querySelectorAll("#" + id).forEach(el => el.textContent = value);
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", function () {
    setupRegister();
    setupLogin();
    setupLogout();
    updateDashboard();

    const modal = document.getElementById("transactionModal");
    if (modal) {
        modal.addEventListener("click", function (e) {
            if (e.target === modal) closeTransactionModal();
        });
    }
});

// Expose functions globally for inline HTML event handlers
window.openTransactionModal = openTransactionModal;
window.closeTransactionModal = closeTransactionModal;
window.addTransaction = addTransaction;
window.setInvestmentCycle = setInvestmentCycle;
window.changeThreshold = changeThreshold;
window.setRoundOffFrequency = setRoundOffFrequency;
window.connectAccount = connectAccount;
window.skipConnection = skipConnection;