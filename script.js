/* =========================================================
   ROUNDUP - COMPLETE JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. DEFAULT USER DATA
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
        threshold: 1000,
        frequency: 2
    },

    lastTransactionDate: ""
};


/* =========================================================
   2. GET CURRENT USER
   ========================================================= */

function getUser() {

    const savedUser =
        localStorage.getItem("roundupUser");

    if (!savedUser) {
        return JSON.parse(JSON.stringify(defaultUser));
    }

    try {

        const user = JSON.parse(savedUser);

        /* Make sure missing properties don't break app */

        if (!user.transactions) {
            user.transactions = [];
        }

        if (!user.settings) {

            user.settings = {
                cycle: "monthly",
                threshold: 1000,
                frequency: 2
            };

        }

        if (user.balance === undefined) {
            user.balance = 0;
        }

        if (user.roundUpBalance === undefined) {
            user.roundUpBalance = 0;
        }

        if (user.totalSaved === undefined) {
            user.totalSaved = 0;
        }

        return user;

    } catch (error) {

        console.log("Error reading user data.");

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

    const registerForm =
        document.getElementById("registerForm");

    /* Not on register page */

    if (!registerForm) {
        return;
    }


    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* Get inputs */

            const nameInput =
                document.getElementById("registerName");

            const emailInput =
                document.getElementById("registerEmail");

            const passwordInput =
                document.getElementById("registerPassword");

            const confirmPasswordInput =
                document.getElementById("confirmPassword");


            const name =
                nameInput.value.trim();

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;

            const confirmPassword =
                confirmPasswordInput.value;


            /* -----------------------------------------
               VALIDATION
            ----------------------------------------- */

            if (!name || !email || !password) {

                alert(
                    "Please fill all the fields."
                );

                return;
            }


            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                return;
            }


            /* -----------------------------------------
               CHECK EXISTING ACCOUNT
            ----------------------------------------- */

            const existingUser =
                localStorage.getItem(
                    "registeredUser"
                );


            if (existingUser) {

                const oldUser =
                    JSON.parse(existingUser);


                if (
                    oldUser.email.toLowerCase() ===
                    email.toLowerCase()
                ) {

                    alert(
                        "This email is already registered. Please login."
                    );

                    return;
                }
            }


            /* -----------------------------------------
               CREATE NEW USER
            ----------------------------------------- */

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

                    threshold: 1000,

                    frequency: 2

                },

                lastTransactionDate: ""

            };


            /* -----------------------------------------
               SAVE ACCOUNT
            ----------------------------------------- */

            localStorage.setItem(
                "registeredUser",
                JSON.stringify(newUser)
            );


            localStorage.setItem(
                "roundupUser",
                JSON.stringify(newUser)
            );


            localStorage.setItem(
                "isLoggedIn",
                "true"
            );


            alert(
                "Account created successfully!"
            );


            /* Go to dashboard */

            window.location.href =
                "dashboard.html";

        }
    );

}


/* =========================================================
   5. LOGIN
   ========================================================= */

function setupLogin() {

    const loginForm =
        document.getElementById("loginForm");

    /* Not on login page */

    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* Get inputs */

            const emailInput =
                document.getElementById("loginEmail");

            const passwordInput =
                document.getElementById("loginPassword");


            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            /* -----------------------------------------
               GET REGISTERED USER
            ----------------------------------------- */

            const savedAccount =
                localStorage.getItem(
                    "registeredUser"
                );


            if (!savedAccount) {

                alert(
                    "No account found. Please register first."
                );

                return;
            }


            const registeredUser =
                JSON.parse(savedAccount);


            /* -----------------------------------------
               CHECK EMAIL
            ----------------------------------------- */

            if (
                email.toLowerCase() !==
                registeredUser.email.toLowerCase()
            ) {

                alert(
                    "Incorrect email or password."
                );

                return;
            }


            /* -----------------------------------------
               CHECK PASSWORD
            ----------------------------------------- */

            if (
                password !==
                registeredUser.password
            ) {

                alert(
                    "Incorrect email or password."
                );

                return;
            }


            /* -----------------------------------------
               LOGIN SUCCESS
            ----------------------------------------- */

            localStorage.setItem(
                "roundupUser",
                JSON.stringify(registeredUser)
            );


            localStorage.setItem(
                "isLoggedIn",
                "true"
            );


            alert(
                "Login successful!"
            );


            window.location.href =
                "dashboard.html";

        }
    );

}


/* =========================================================
   6. LOGOUT
   ========================================================= */

function setupLogout() {

    const logoutButton =
        document.querySelector(".logout");

    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            localStorage.setItem(
                "isLoggedIn",
                "false"
            );


            window.location.href =
                "index.html";

        }
    );

}


/* =========================================================
   7. DASHBOARD
   ========================================================= */

function updateDashboard() {

    const dashboard =
        document.querySelector(".dashboard-body");

    if (!dashboard) {
        return;
    }


    const user = getUser();


    /* -----------------------------------------
       USER NAME
    ----------------------------------------- */

    const userName =
        document.getElementById("userName");

    if (userName) {

        userName.textContent =
            user.name || "User";

    }


    /* -----------------------------------------
       ROUND-UP BALANCE
    ----------------------------------------- */

    const roundUpBalance =
        document.getElementById(
            "roundUpBalance"
        );

    if (roundUpBalance) {

        roundUpBalance.textContent =
            Number(
                user.roundUpBalance || 0
            ).toFixed(2);

    }


    /* -----------------------------------------
       TOTAL SAVED
    ----------------------------------------- */

    const totalSaved =
        document.getElementById(
            "totalSaved"
        );

    if (totalSaved) {

        totalSaved.textContent =
            Number(
                user.totalSaved || 0
            ).toFixed(2);

    }


    /* -----------------------------------------
       BALANCE
    ----------------------------------------- */

    const balance =
        document.getElementById(
            "balance"
        );

    if (balance) {

        balance.textContent =
            Number(
                user.balance || 0
            ).toFixed(2);

    }


    /* -----------------------------------------
       TRANSACTIONS
    ----------------------------------------- */

    renderTransactions();


    /* -----------------------------------------
       PROGRESS
    ----------------------------------------- */

    updateProgress();


    /* -----------------------------------------
       SETTINGS
    ----------------------------------------- */

    updateSettingsUI();

}


/* =========================================================
   8. TRANSACTION MODAL
   ========================================================= */

function openTransactionModal() {

    const modal =
        document.getElementById(
            "transactionModal"
        );

    if (!modal) {
        return;
    }


    modal.classList.add("show");

}


function closeTransactionModal() {

    const modal =
        document.getElementById(
            "transactionModal"
        );

    if (!modal) {
        return;
    }


    modal.classList.remove("show");

}


/* =========================================================
   9. CALCULATE ROUND-UP
   ========================================================= */

function calculateRoundUp(amount) {

    /*
       Example:

       ₹99 → ₹100
       Round-up = ₹1

       ₹94 → ₹100
       Round-up = ₹6
    */


    const roundedAmount =
        Math.ceil(amount);

    const roundUp =
        roundedAmount - amount;


    return Number(
        roundUp.toFixed(2)
    );

}


/* =========================================================
   10. ADD TRANSACTION
   ========================================================= */

function addTransaction() {

    const merchantInput =
        document.getElementById(
            "merchantName"
        );

    const amountInput =
        document.getElementById(
            "transactionAmount"
        );


    if (!merchantInput || !amountInput) {
        return;
    }


    const merchant =
        merchantInput.value.trim();

    const amount =
        Number(amountInput.value);


    /* -----------------------------------------
       VALIDATION
    ----------------------------------------- */

    if (!merchant) {

        alert(
            "Please enter a merchant name."
        );

        return;
    }


    if (
        isNaN(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid transaction amount."
        );

        return;
    }


    const user = getUser();


    /* -----------------------------------------
       CALCULATE ROUND-UP
    ----------------------------------------- */

    let roundUp =
        calculateRoundUp(amount);


    /* -----------------------------------------
       DAILY FREQUENCY
    ----------------------------------------- */

    const today =
        new Date().toLocaleDateString();


    if (
        user.lastTransactionDate !== today
    ) {

        user.lastTransactionDate =
            today;

        user.todayRoundOffCount = 0;

    }


    if (
        user.todayRoundOffCount === undefined
    ) {

        user.todayRoundOffCount = 0;

    }


    const frequency =
        Number(
            user.settings.frequency
        ) || 2;


    /*
       Frequency means:

       2× = maximum 2 round-offs/day
       5× = maximum 5 round-offs/day
       10× = maximum 10 round-offs/day
    */


    if (
        user.todayRoundOffCount >=
        frequency
    ) {

        roundUp = 0;

    } else {

        user.todayRoundOffCount++;

    }


    /* -----------------------------------------
       ADD TRANSACTION
    ----------------------------------------- */

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


    /* -----------------------------------------
       UPDATE BALANCE
    ----------------------------------------- */

    user.balance += amount;


    /* -----------------------------------------
       ADD TO ROUND-UP POOL
    ----------------------------------------- */

    user.roundUpBalance +=
        roundUp;


    user.roundUpBalance =
        Number(
            user.roundUpBalance.toFixed(2)
        );


    /* -----------------------------------------
       CHECK THRESHOLD
    ----------------------------------------- */

    processThreshold(user);


    /* -----------------------------------------
       SAVE
    ----------------------------------------- */

    saveUser(user);


    /* Clear inputs */

    merchantInput.value = "";

    amountInput.value = "";


    /* Close modal */

    closeTransactionModal();


    /* Update dashboard */

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
   11. THRESHOLD
   ========================================================= */

function processThreshold(user) {

    const threshold =
        Number(
            user.settings.threshold
        );


    if (
        !threshold ||
        threshold <= 0
    ) {
        return;
    }


    /*
       Example:

       Threshold = ₹1000

       Pool = ₹999

       New round-up = ₹5

       Pool = ₹1004

       Investment = ₹1000

       Remaining pool = ₹4
    */


    while (
        user.roundUpBalance >=
        threshold
    ) {

        user.roundUpBalance -=
            threshold;


        user.totalSaved +=
            threshold;

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
   12. DELETE TRANSACTION
   ========================================================= */

function deleteTransaction(id) {

    const user = getUser();


    const index =
        user.transactions.findIndex(
            function (transaction) {

                return transaction.id === id;

            }
        );


    if (index === -1) {
        return;
    }


    const transaction =
        user.transactions[index];


    /* Remove transaction amount */

    user.balance -=
        transaction.amount;


    /* Remove its round-up */

    user.roundUpBalance -=
        transaction.roundUp;


    if (
        user.roundUpBalance < 0
    ) {

        user.roundUpBalance = 0;

    }


    /* Remove transaction */

    user.transactions.splice(
        index,
        1
    );


    saveUser(user);


    updateDashboard();

}


/* =========================================================
   13. RENDER TRANSACTIONS
   ========================================================= */

function renderTransactions() {

    const list =
        document.querySelector(
            ".transaction-list"
        );


    if (!list) {
        return;
    }


    const user = getUser();


    list.innerHTML = "";


    if (
        user.transactions.length === 0
    ) {

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
        .forEach(
            function (transaction) {


                const row =
                    document.createElement(
                        "div"
                    );


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
                            onclick="
                                deleteTransaction(
                                    ${transaction.id}
                                )
                            "
                        >
                            Delete
                        </button>

                    </div>

                `;


                list.appendChild(row);

            }
        );

}


/* =========================================================
   14. ESCAPE HTML
   ========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent = text;


    return div.innerHTML;

}


/* =========================================================
   15. UPDATE PROGRESS
   ========================================================= */

function updateProgress() {

    const user = getUser();


    const threshold =
        Number(
            user.settings.threshold
        ) || 1000;


    const pool =
        Number(
            user.roundUpBalance
        ) || 0;


    let percentage =
        (pool / threshold) * 100;


    if (percentage > 100) {
        percentage = 100;
    }


    /* Progress bar */

    const progressFill =
        document.getElementById(
            "progressFill"
        );


    if (progressFill) {

        progressFill.style.width =
            percentage + "%";

    }


    /* Percentage */

    const progressPercent =
        document.getElementById(
            "progressPercent"
        );


    if (progressPercent) {

        progressPercent.textContent =
            Math.round(percentage);

    }


    /* Remaining */

    const progressRemaining =
        document.getElementById(
            "progressRemaining"
        );


    if (progressRemaining) {

        const remaining =
            Math.max(
                threshold - pool,
                0
            );


        progressRemaining.textContent =
            remaining.toFixed(2);

    }


    /* Big threshold */

    const bigThreshold =
        document.getElementById(
            "bigThreshold"
        );


    if (bigThreshold) {

        bigThreshold.textContent =
            threshold;

    }

}


/* =========================================================
   16. INVESTMENT SETTINGS
   ========================================================= */

function setupInvestmentSettings() {

    /* -----------------------------------------
       MONTHLY / YEARLY
    ----------------------------------------- */

    const cycleButtons =
        document.querySelectorAll(
            ".cycle-btn"
        );


    cycleButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    cycleButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "selected"
                            );

                        }
                    );


                    button.classList.add(
                        "selected"
                    );


                    const user =
                        getUser();


                    user.settings.cycle =
                        button.dataset.cycle ||
                        button.textContent
                            .trim()
                            .toLowerCase();


                    saveUser(user);

                }
            );

        }
    );


    /* -----------------------------------------
       FREQUENCY
    ----------------------------------------- */

    const frequencyButtons =
        document.querySelectorAll(
            ".frequency-btn"
        );


    frequencyButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    frequencyButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "selected"
                            );

                        }
                    );


                    button.classList.add(
                        "selected"
                    );


                    const user =
                        getUser();


                    const frequency =
                        Number(
                            button.dataset.frequency
                        ) ||
                        parseInt(
                            button.textContent
                        );


                    user.settings.frequency =
                        frequency;


                    saveUser(user);

                }
            );

        }
    );


    /* -----------------------------------------
       THRESHOLD BUTTONS
    ----------------------------------------- */

    const thresholdButtons =
        document.querySelectorAll(
            ".threshold-btn"
        );


    thresholdButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    thresholdButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "selected"
                            );

                        }
                    );


                    button.classList.add(
                        "selected"
                    );


                    const user =
                        getUser();


                    const threshold =
                        Number(
                            button.dataset.threshold
                        );


                    if (
                        !isNaN(threshold)
                    ) {

                        user.settings.threshold =
                            threshold;

                    }


                    saveUser(user);

                    updateProgress();

                }
            );

        }
    );


    /* -----------------------------------------
       THRESHOLD INPUT
    ----------------------------------------- */

    const thresholdInput =
        document.querySelector(
            ".threshold-input input"
        );


    if (thresholdInput) {

        thresholdInput.addEventListener(
            "input",
            function () {

                const value =
                    Number(
                        thresholdInput.value
                    );


                if (
                    value > 0
                ) {

                    const user =
                        getUser();


                    user.settings.threshold =
                        value;


                    saveUser(user);

                    updateProgress();

                }

            }
        );

    }


    /* -----------------------------------------
       SAVE PLAN
    ----------------------------------------- */

    const saveButton =
        document.querySelector(
            ".save-plan-btn"
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            function () {

                const user =
                    getUser();


                saveUser(user);

                updateSettingsUI();

                alert(
                    "Investment plan saved!"
                );

            }
        );

    }

}


/* =========================================================
   17. UPDATE SETTINGS UI
   ========================================================= */

function updateSettingsUI() {

    const user = getUser();


    /* -----------------------------------------
       CYCLE
    ----------------------------------------- */

    const cycleButtons =
        document.querySelectorAll(
            ".cycle-btn"
        );


    cycleButtons.forEach(
        function (button) {

            const value =
                button.dataset.cycle ||
                button.textContent
                    .trim()
                    .toLowerCase();


            button.classList.toggle(
                "selected",
                value ===
                user.settings.cycle
            );

        }
    );


    /* -----------------------------------------
       FREQUENCY
    ----------------------------------------- */

    const frequencyButtons =
        document.querySelectorAll(
            ".frequency-btn"
        );


    frequencyButtons.forEach(
        function (button) {

            const value =
                Number(
                    button.dataset.frequency
                ) ||
                parseInt(
                    button.textContent
                );


            button.classList.toggle(
                "selected",
                value ===
                Number(
                    user.settings.frequency
                )
            );

        }
    );


    /* -----------------------------------------
       THRESHOLD
    ----------------------------------------- */

    const thresholdButtons =
        document.querySelectorAll(
            ".threshold-btn"
        );


    thresholdButtons.forEach(
        function (button) {

            const value =
                Number(
                    button.dataset.threshold
                );


            button.classList.toggle(
                "selected",
                value ===
                Number(
                    user.settings.threshold
                )
            );

        }
    );


    /* Threshold input */

    const thresholdInput =
        document.querySelector(
            ".threshold-input input"
        );


    if (thresholdInput) {

        thresholdInput.value =
            user.settings.threshold;

    }


    /* Current plan */

    const currentCycle =
        document.querySelector(
            "[data-current-cycle]"
        );


    if (currentCycle) {

        currentCycle.textContent =
            capitalize(
                user.settings.cycle
            );

    }


    const currentThreshold =
        document.querySelector(
            "[data-current-threshold]"
        );


    if (currentThreshold) {

        currentThreshold.textContent =
            "₹" +
            user.settings.threshold;

    }


    const currentFrequency =
        document.querySelector(
            "[data-current-frequency]"
        );


    if (currentFrequency) {

        currentFrequency.textContent =
            user.settings.frequency +
            "×";

    }

}


/* =========================================================
   18. CAPITALIZE
   ========================================================= */

function capitalize(text) {

    if (!text) {
        return "";
    }


    return (
        text.charAt(0).toUpperCase() +
        text.slice(1)
    );

}


/* =========================================================
   19. INITIALIZE EVERYTHING
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupRegister();

        setupLogin();

        setupLogout();

        setupInvestmentSettings();

        updateDashboard();

    }
);


/* =========================================================
   20. MAKE FUNCTIONS AVAILABLE TO HTML
   ========================================================= */

window.openTransactionModal =
    openTransactionModal;

window.closeTransactionModal =
    closeTransactionModal;

window.addTransaction =
    addTransaction;

window.deleteTransaction =
    deleteTransaction;
