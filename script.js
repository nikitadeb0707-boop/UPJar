/* =========================================================
   UPJAR - FINAL JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. DEFAULT USER
   ========================================================= */

const defaultUser = {
    name: "",
    email: "",
    password: "",

    balance: 0,
    roundUpBalance: 0,
    totalSaved: 0,

    transactions: [],

    settings: {
        cycle: "monthly",
        threshold: 100,
        frequency: 5
    },

    lastTransactionDate: "",
    todayRoundOffCount: 0
};


/* =========================================================
   2. GET USER
   ========================================================= */

function getUser() {

    const savedUser = localStorage.getItem("roundupUser");

    if (!savedUser) {
        return JSON.parse(JSON.stringify(defaultUser));
    }

    try {

        const user = JSON.parse(savedUser);

        user.transactions = user.transactions || [];

        user.settings = user.settings || {};

        user.settings.cycle =
            user.settings.cycle || "monthly";

        user.settings.threshold =
            Number(user.settings.threshold) || 100;

        user.settings.frequency =
            Number(user.settings.frequency) || 5;

        user.balance =
            Number(user.balance) || 0;

        user.roundUpBalance =
            Number(user.roundUpBalance) || 0;

        user.totalSaved =
            Number(user.totalSaved) || 0;

        user.todayRoundOffCount =
            Number(user.todayRoundOffCount) || 0;

        return user;

    } catch (error) {

        return JSON.parse(
            JSON.stringify(defaultUser)
        );
    }
}


/* =========================================================
   3. SAVE USER
   ========================================================= */

function saveUser(user) {

    localStorage.setItem(
        "roundupUser",
        JSON.stringify(user)
    );

}


/* =========================================================
   4. REGISTER
   ========================================================= */

function setupRegister() {

    const form =
        document.getElementById("registerForm");

    if (!form) return;


    form.addEventListener("submit", function(event) {

        event.preventDefault();


        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        if (!name || !email || !password || !confirmPassword) {

            alert("Please fill all the fields.");
            return;

        }


        if (password !== confirmPassword) {

            alert("Passwords do not match.");
            return;

        }


        const existing =
            localStorage.getItem("registeredUser");


        if (existing) {

            const oldUser =
                JSON.parse(existing);

            if (
                oldUser.email &&
                oldUser.email.toLowerCase() ===
                email.toLowerCase()
            ) {

                alert(
                    "This email is already registered. Please login."
                );

                return;
            }
        }


        const newUser = {

            name: name,
            email: email,
            password: password,

            balance: 0,
            roundUpBalance: 0,
            totalSaved: 0,

            transactions: [],

            settings: {
                cycle: "monthly",
                threshold: 100,
                frequency: 5
            },

            lastTransactionDate: "",
            todayRoundOffCount: 0
        };


        localStorage.setItem(
            "registeredUser",
            JSON.stringify(newUser)
        );


        saveUser(newUser);


        localStorage.setItem(
            "isLoggedIn",
            "true"
        );


        alert("Account created successfully!");


        window.location.href =
            "dashboard.html";

    });

}


/* =========================================================
   5. LOGIN
   ========================================================= */

function setupLogin() {

    const form =
        document.getElementById("loginForm");

    if (!form) return;


    form.addEventListener("submit", function(event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        const savedAccount =
            localStorage.getItem("registeredUser");


        if (!savedAccount) {

            alert(
                "No account found. Please register first."
            );

            return;
        }


        let user;

        try {

            user =
                JSON.parse(savedAccount);

        } catch {

            alert(
                "Account data is corrupted. Please register again."
            );

            return;
        }


        if (
            email.toLowerCase() !==
            user.email.toLowerCase()
        ) {

            alert("Incorrect email or password.");
            return;

        }


        if (password !== user.password) {

            alert("Incorrect email or password.");
            return;

        }


        saveUser(user);


        localStorage.setItem(
            "isLoggedIn",
            "true"
        );


        alert("Login successful!");


        window.location.href =
            "dashboard.html";

    });

}


/* =========================================================
   6. LOGOUT
   ========================================================= */

function setupLogout() {

    const logout =
        document.querySelector(".logout");

    if (!logout) return;


    logout.addEventListener("click", function(event) {

        event.preventDefault();

        localStorage.setItem(
            "isLoggedIn",
            "false"
        );

        window.location.href =
            "index.html";

    });

}


/* =========================================================
   7. DASHBOARD
   ========================================================= */

function updateDashboard() {

    const dashboard =
        document.querySelector(".dashboard-body");

    if (!dashboard) return;


    const user = getUser();


    /* USER NAME */

    const userName =
        document.getElementById("userName");

    if (userName) {

        userName.textContent =
            user.name || "there";

    }


    /* BALANCE */

    setText(
        "balance",
        user.roundUpBalance.toFixed(2)
    );


    setText(
        "bigBalance",
        user.roundUpBalance.toFixed(2)
    );


    /* TOTAL INVESTED */

    setText(
        "invested",
        user.totalSaved.toFixed(2)
    );


    setText(
        "portfolioValue",
        user.totalSaved.toFixed(2)
    );


    /* THRESHOLD */

    setText(
        "bigThreshold",
        user.settings.threshold
    );


    setAllText(
        "thresholdDisplay",
        user.settings.threshold
    );


    /* REMAINING */

    const remaining =
        Math.max(
            user.settings.threshold -
            user.roundUpBalance,
            0
        );


    setText(
        "remaining",
        remaining.toFixed(2)
    );


    setText(
        "progressRemaining",
        remaining.toFixed(2)
    );


    /* PROGRESS */

    updateProgress();


    /* SETTINGS */

    updateSettingsUI();


    /* TRANSACTIONS */

    renderTransactions();

}


/* =========================================================
   8. HELPER - SET TEXT
   ========================================================= */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}


function setAllText(id, value) {

    const elements =
        document.querySelectorAll("#" + id);

    elements.forEach(function(element) {

        element.textContent = value;

    });

}


/* =========================================================
   9. TRANSACTION MODAL
   ========================================================= */

function openTransactionModal() {

    const modal =
        document.getElementById("transactionModal");

    if (!modal) return;

    modal.classList.add("show");

}


function closeTransactionModal() {

    const modal =
        document.getElementById("transactionModal");

    if (!modal) return;

    modal.classList.remove("show");

}


/* =========================================================
   10. ROUND-UP CALCULATION
   ========================================================= */

/*
   ₹47  → ₹50  → ₹3
   ₹94  → ₹100 → ₹6
   ₹101 → ₹110 → ₹9
*/

function calculateRoundUp(amount) {

    const roundedAmount =
        Math.ceil(amount / 10) * 10;

    return Number(
        (roundedAmount - amount).toFixed(2)
    );

}


/* =========================================================
   11. ADD TRANSACTION
   ========================================================= */

function addTransaction() {

    const merchantInput =
        document.getElementById("merchantName");

    const amountInput =
        document.getElementById("transactionAmount");


    if (!merchantInput || !amountInput) {
        return;
    }


    const merchant =
        merchantInput.value.trim();

    const amount =
        Number(amountInput.value);


    if (!merchant) {

        alert("Please enter a merchant name.");
        return;

    }


    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");
        return;

    }


    const user = getUser();


    /* DAILY FREQUENCY */

    const today =
        new Date().toLocaleDateString();


    if (user.lastTransactionDate !== today) {

        user.lastTransactionDate = today;
        user.todayRoundOffCount = 0;

    }


    const frequency =
        Number(user.settings.frequency) || 5;


    let roundUp = 0;


    if (
        user.todayRoundOffCount <
        frequency
    ) {

        roundUp =
            calculateRoundUp(amount);

        user.todayRoundOffCount++;

    }


    /* TRANSACTION */

    const transaction = {

        id: Date.now(),

        merchant: merchant,

        amount: amount,

        roundUp: roundUp,

        date: today

    };


    user.transactions.unshift(
        transaction
    );


    /* UPDATE BALANCE */

    user.balance += amount;


    user.roundUpBalance +=
        roundUp;


    user.roundUpBalance =
        Number(
            user.roundUpBalance.toFixed(2)
        );


    /* THRESHOLD */

    processThreshold(user);


    saveUser(user);


    merchantInput.value = "";
    amountInput.value = "";


    closeTransactionModal();


    updateDashboard();


    alert(
        "Transaction added!\n\n" +
        "Amount: ₹" +
        amount.toFixed(2) +
        "\nRound-up: ₹" +
        roundUp.toFixed(2)
    );

}


/* =========================================================
   12. THRESHOLD PROCESSING
   ========================================================= */

function processThreshold(user) {

    const threshold =
        Number(user.settings.threshold);


    if (!threshold || threshold <= 0) {
        return;
    }


    while (
        user.roundUpBalance >= threshold
    ) {

        user.roundUpBalance -= threshold;

        user.totalSaved += threshold;

    }


    user.roundUpBalance =
        Number(
            user.roundUpBalance.toFixed(2)
        );


    user.totalSaved =
        Number(
            user.totalSaved.toFixed(2)
        );

}


/* =========================================================
   13. DELETE TRANSACTION
   ========================================================= */

function deleteTransaction(id) {

    const user = getUser();


    const index =
        user.transactions.findIndex(
            function(transaction) {

                return transaction.id === id;

            }
        );


    if (index === -1) return;


    const transaction =
        user.transactions[index];


    user.balance -=
        transaction.amount;


    user.roundUpBalance -=
        transaction.roundUp;


    if (user.balance < 0) {
        user.balance = 0;
    }


    if (user.roundUpBalance < 0) {
        user.roundUpBalance = 0;
    }


    user.transactions.splice(
        index,
        1
    );


    saveUser(user);


    updateDashboard();

}


/* =========================================================
   14. RENDER TRANSACTIONS
   ========================================================= */

function renderTransactions() {

    const list =
        document.querySelector(".transaction-list");

    if (!list) return;


    const user = getUser();


    list.innerHTML = "";


    if (user.transactions.length === 0) {

        list.innerHTML = `
            <p style="
                color:#777b82;
                text-align:center;
                padding:25px;
            ">
                No transactions yet.
            </p>
        `;

        return;
    }


    user.transactions
        .slice(0, 10)
        .forEach(function(transaction) {


            const row =
                document.createElement("div");


            row.className =
                "transaction-row";


            row.innerHTML = `

                <div class="transaction-left">

                    <div class="transaction-icon">
                        💳
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(
                                transaction.merchant
                            )}
                        </strong>

                        <p>
                            ${transaction.date}
                        </p>

                    </div>

                </div>


                <div class="transaction-right">

                    <strong>
                        ₹${Number(
                            transaction.amount
                        ).toFixed(2)}
                    </strong>

                    <span>
                        +₹${Number(
                            transaction.roundUp
                        ).toFixed(2)}
                    </span>

                    <button
                        class="delete-transaction"
                        onclick="deleteTransaction(${transaction.id})"
                    >
                        Delete
                    </button>

                </div>

            `;


            list.appendChild(row);

        });

}


/* =========================================================
   15. ESCAPE HTML
   ========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================================
   16. UPDATE PROGRESS
   ========================================================= */

function updateProgress() {

    const user = getUser();


    const threshold =
        Number(user.settings.threshold) || 100;


    const pool =
        Number(user.roundUpBalance) || 0;


    let percentage =
        (pool / threshold) * 100;


    percentage =
        Math.min(percentage, 100);


    const progressFill =
        document.getElementById("progressFill");


    if (progressFill) {

        progressFill.style.width =
            percentage + "%";

    }


    setText(
        "progressPercent",
        Math.round(percentage)
    );


    const remaining =
        Math.max(
            threshold - pool,
            0
        );


    setText(
        "progressRemaining",
        remaining.toFixed(2)
    );


    setText(
        "bigThreshold",
        threshold
    );


    setAllText(
        "thresholdDisplay",
        threshold
    );

}


/* =========================================================
   17. INVESTMENT CYCLE
   ========================================================= */

function setInvestmentCycle(
    cycle,
    button
) {

    const buttons =
        document.querySelectorAll(
            ".cycle-btn"
        );


    /*
       IMPORTANT:
       Only cycle buttons are affected.
       Threshold/frequency stay selected.
    */

    buttons.forEach(function(btn) {

        btn.classList.remove(
            "selected"
        );

    });


    button.classList.add(
        "selected"
    );


    const user = getUser();


    user.settings.cycle =
        cycle;


    saveUser(user);


    updateSettingsUI();

}


/* =========================================================
   18. CHANGE THRESHOLD
   ========================================================= */

function changeThreshold(
    amount,
    button
) {

    const buttons =
        document.querySelectorAll(
            ".threshold-btn:not(.cycle-btn):not(.frequency-btn)"
        );


    /*
       IMPORTANT:
       Only threshold buttons are affected.
    */

    buttons.forEach(function(btn) {

        btn.classList.remove(
            "selected"
        );

    });


    button.classList.add(
        "selected"
    );


    const user = getUser();


    user.settings.threshold =
        Number(amount);


    saveUser(user);


    updateProgress();


    updateSettingsUI();

}


/* =========================================================
   19. DAILY ROUND-OFF FREQUENCY
   ========================================================= */

function setRoundOffFrequency(
    frequency,
    button
) {

    const buttons =
        document.querySelectorAll(
            ".frequency-btn"
        );


    /*
       IMPORTANT:
       Only frequency buttons are affected.
    */

    buttons.forEach(function(btn) {

        btn.classList.remove(
            "selected"
        );

    });


    button.classList.add(
        "selected"
    );


    const user = getUser();


    user.settings.frequency =
        Number(frequency);


    saveUser(user);


    updateSettingsUI();

}


/* =========================================================
   20. UPDATE SETTINGS UI
   ========================================================= */

function updateSettingsUI() {

    const user = getUser();


    /* CYCLE */

    document
        .querySelectorAll(".cycle-btn")
        .forEach(function(button) {

            const cycle =
                button.getAttribute(
                    "onclick"
                );

            button.classList.toggle(
                "selected",
                cycle &&
                cycle.includes(
                    "'" +
                    user.settings.cycle +
                    "'"
                )
            );

        });


    /* THRESHOLD */

    document
        .querySelectorAll(
            ".threshold-btn:not(.cycle-btn):not(.frequency-btn)"
        )
        .forEach(function(button) {

            const onclick =
                button.getAttribute(
                    "onclick"
                );


            const match =
                onclick &&
                onclick.match(
                    /changeThreshold\((\d+)/
                );


            const value =
                match
                    ? Number(match[1])
                    : 0;


            button.classList.toggle(
                "selected",
                value ===
                Number(
                    user.settings.threshold
                )
            );

        });


    /* FREQUENCY */

    document
        .querySelectorAll(
            ".frequency-btn"
        )
        .forEach(function(button) {

            const onclick =
                button.getAttribute(
                    "onclick"
                );


            const match =
                onclick &&
                onclick.match(
                    /setRoundOffFrequency\((\d+)/
                );


            const value =
                match
                    ? Number(match[1])
                    : 0;


            button.classList.toggle(
                "selected",
                value ===
                Number(
                    user.settings.frequency
                )
            );

        });


    /* CURRENT PLAN */

    setText(
        "cycleDisplay",
        capitalize(
            user.settings.cycle
        )
    );


    setAllText(
        "thresholdDisplay",
        user.settings.threshold
    );


    setText(
        "frequencyDisplay",
        user.settings.frequency
    );

}


/* =========================================================
   21. CAPITALIZE
   ========================================================= */

function capitalize(text) {

    if (!text) return "";

    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}


/* =========================================================
   22. SIDEBAR NAVIGATION
   ========================================================= */

function setupSidebar() {

    const navItems =
        document.querySelectorAll(
            ".dashboard-nav .nav-item"
        );


    const main =
        document.querySelector(
            ".dashboard-main"
        );


    if (!navItems.length || !main) {
        return;
    }


    navItems.forEach(function(item, index) {

        item.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                /*
                   Remove active from all
                */

                navItems.forEach(
                    function(nav) {

                        nav.classList.remove(
                            "active"
                        );

                    }
                );


                /*
                   Add active to clicked one
                */

                item.classList.add(
                    "active"
                );


                /*
                   Scroll to correct section
                */

                if (index === 0) {

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }


                if (index === 1) {

                    const transactions =
                        document.querySelector(
                            ".transactions-card"
                        );

                    if (transactions) {

                        transactions.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                }


                if (index === 2) {

                    const portfolio =
                        document.querySelector(
                            ".portfolio-card"
                        );

                    if (portfolio) {

                        portfolio.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                }


                if (index === 3) {

                    const settings =
                        document.querySelector(
                            ".investment-settings-card"
                        );

                    if (settings) {

                        settings.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                }

            }
        );

    });

}


/* =========================================================
   23. CLOSE MODAL WHEN CLICKING OUTSIDE
   ========================================================= */

function setupModalOutsideClick() {

    const modal =
        document.getElementById(
            "transactionModal"
        );


    if (!modal) return;


    modal.addEventListener(
        "click",
        function(event) {

            if (event.target === modal) {

                closeTransactionModal();

            }

        }
    );

}


/* =========================================================
   24. INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setupRegister();

        setupLogin();

        setupLogout();

        setupSidebar();

        setupModalOutsideClick();

        updateDashboard();

    }
);


/* =========================================================
   25. MAKE FUNCTIONS AVAILABLE TO HTML
   ========================================================= */

window.openTransactionModal =
    openTransactionModal;

window.closeTransactionModal =
    closeTransactionModal;

window.addTransaction =
    addTransaction;

window.deleteTransaction =
    deleteTransaction;

window.setInvestmentCycle =
    setInvestmentCycle;

window.changeThreshold =
    changeThreshold;

window.setRoundOffFrequency =
    setRoundOffFrequency;