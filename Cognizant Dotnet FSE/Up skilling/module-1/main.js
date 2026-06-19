class CommunityEvent {
    constructor(id, name, date, category, availableSeats, price) {
        this.id = id;
        this.name = name;
        this.date = date;
        this.category = category;
        this.availableSeats = availableSeats;
        this.price = price;
    }

    checkAvailability() {
        return this.availableSeats > 0;
    }
}
let masterEventsRegistry = [
    new CommunityEvent(1, "Summer Music Symphony", "2026-07-15", "music", 45, 12.50),
    new CommunityEvent(2, "Artisan Baking Workshop", "2026-08-02", "education", 0, 25.00),
    new CommunityEvent(3, "Jazz Under The Local Stars", "2026-07-29", "music", 12, 0.00),
    new CommunityEvent(4, "Intro to Web Design Principles", "2026-09-10", "education", 30, 5.00)
];
document.addEventListener("DOMContentLoaded", () => {
    console.log("Welcome to the Community Portal");
    alert("Portal system loaded successfully.");

    initializePortalEngine();
});

function initializePortalEngine() {
    renderEventGridCards(masterEventsRegistry);
    populateRegistrationDropdown(masterEventsRegistry);
    retrieveLocalStoragePreferences();
    setupNativeEventBindings();
} 
function renderEventGridCards(eventsList) {
    const targetGrid = document.getElementById("eventGrid");
    targetGrid.innerHTML = ""; 

    eventsList.forEach(item => {
        const isAvailable = item.checkAvailability();
        const cardHtml = `
            <div class="col event-card-container" data-category="${item.category}">
                <div class="card h-100 shadow-sm border-${isAvailable ? 'light' : 'warning'}">
                    <img src="https://picsum.photos/id/${item.id + 10}/400/200" class="card-img-top" alt="${item.name} image asset">
                    <div class="card-body d-flex flex-column justify-content-between">
                        <div>
                            <h5 class="card-title fw-bold">${item.name}</h5>
                            <p class="card-text text-muted mb-1">📅 Date: ${item.date}</p>
                            <p class="card-text mb-2"><span class="badge bg-${item.category === 'music' ? 'info' : 'secondary'}">${item.category}</span></p>
                        </div>
                        <div class="mt-3">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="small fw-bold ${isAvailable ? 'text-success' : 'text-danger'}">
                                    ${isAvailable ? `${item.availableSeats} Remaining Seats` : 'Sold Out entirely'}
                                </span>
                                <span class="badge bg-dark">${item.price === 0 ? 'FREE' : `$${item.price.toFixed(2)}`}</span>
                            </div>
                            <button class="btn btn-sm w-100 btn-action-trigger ${isAvailable ? 'btn-primary' : 'btn-secondary disabled'}" 
                                    onclick="quickRegisterTrigger('${item.name}', ${item.id})" ${!isAvailable ? 'disabled' : ''}>
                                ${isAvailable ? 'Register Now' : 'Closed'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        targetGrid.insertAdjacentHTML("beforeend", cardHtml);
    });
}

function populateRegistrationDropdown(list) {
    const selectDropdown = document.getElementById("regEventSelect");
    selectDropdown.innerHTML = '<option value="" disabled selected>Choose from active lineup...</option>';
    
    list.forEach(event => {
        if(event.checkAvailability()) {
            const opt = document.createElement("option");
            opt.value = event.id;
            opt.textContent = `${event.name} (${event.date})`;
            selectDropdown.appendChild(opt);
        }
    });
}
function setupNativeEventBindings() {
    const phoneInput = document.getElementById("regPhone");
    const selectDropdown = document.getElementById("regEventSelect");
    const messageTextarea = document.getElementById("regMessage");
    const promoVid = document.getElementById("promoVideo");
    const geoBtn = document.getElementById("geoBtn");
    phoneInput.addEventListener("blur", () => {
        const val = phoneInput.value.trim();
        const feedback = document.getElementById("phoneFeedback");
        if(val && !/^\d{10}$/.test(val)) {
            feedback.textContent = "⚠️ Invalid phone sequencing pattern. Use 10 digits.";
            feedback.className = "small mt-1 text-danger";
        } else if (val) {
            feedback.textContent = "✓ Formatting acceptable.";
            feedback.className = "small mt-1 text-success";
        } else {
            feedback.textContent = "";
        }
    });
    selectDropdown.addEventListener("change", (e) => {
        const found = masterEventsRegistry.find(item => item.id == e.target.value);
        const feeDisplay = document.getElementById("feeDisplay");
        if(found) {
            feeDisplay.textContent = `Calculated Admission Cost: $${found.price.toFixed(2)}`;
            localStorage.setItem("preferredEventSelectionCache", found.id); // Commit choice tracking preference state cache
        }
    });
    messageTextarea.addEventListener("keyup", () => {
        document.getElementById("charCount").textContent = messageTextarea.value.length;
    });
    promoVid.addEventListener("canplay", () => {
        document.getElementById("videoStatus").textContent = "✓ High Definition Media Assets Cached & Ready to Play";
    });
    geoBtn.addEventListener("click", () => {
        const out = document.getElementById("geoOutput");
        out.textContent = "Querying modern internal geolocation nodes...";

        if(!navigator.geolocation) {
            out.textContent = "System hardware does not support device geo-tracking features.";
            return;
        }

        const geoSettingsOptions = { enableHighAccuracy: true, timeout: 60000 };

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                out.textContent = `Coordinates Resolved: Lat ${pos.coords.latitude.toFixed(4)}°, Long ${pos.coords.longitude.toFixed(4)}°`;
            },
            (err) => {
                out.textContent = `Geo Error Code Status: ${err.message}. Access Denied.`;
            },
            geoSettingsOptions
        );
    });
    window.addEventListener("beforeunload", (e) => {
        const nameVal = document.getElementById("regName").value;
        if(nameVal.length > 0) {
            e.preventDefault();
            e.returnValue = "Unsaved configuration alterations found. Leave page?";
        }
    });
    const targetForm = document.getElementById("registrationForm");
    targetForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if(!targetForm.checkValidity()) {
            e.stopPropagation();
            targetForm.classList.add("was-validated");
            return;
        }

        executeAsynchronousRegistrationSubmit();
    });
}

async function executeAsynchronousRegistrationSubmit() {
    const out = document.getElementById("formOutput");
    out.className = "d-block mt-4 alert alert-info text-center fw-bold";
    out.textContent = "Transmitting entry secure credentials to local municipal cloud array servers...";

    const trackingDataPayload = {
        name: document.getElementById("regName").value,
        email: document.getElementById("regEmail").value,
        eventId: document.getElementById("regEventSelect").value
    };

    try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        const eventMatchIndex = masterEventsRegistry.findIndex(x => x.id == trackingDataPayload.eventId);
        if(eventMatchIndex !== -1 && masterEventsRegistry[eventMatchIndex].availableSeats > 0) {
            masterEventsRegistry[eventMatchIndex].availableSeats--;
        }

        out.className = "d-block mt-4 alert alert-success text-center fw-bold";
        out.textContent = `Registration Confirmed Successfully! Welcome onboard, ${trackingDataPayload.name}.`;
        
        renderEventGridCards(masterEventsRegistry);
        populateRegistrationDropdown(masterEventsRegistry);
        document.getElementById("registrationForm").reset();
        document.getElementById("registrationForm").classList.remove("was-validated");
        document.getElementById("feeDisplay").textContent = "";
    } catch (err) {
        out.className = "d-block mt-4 alert alert-danger text-center fw-bold";
        out.textContent = "Critical network failure state occurred processing requests.";
    }
}

function quickRegisterTrigger(name, id) {
    const selectorDrop = document.getElementById("regEventSelect");
    selectorDrop.value = id;
    selectorDrop.dispatchEvent(new Event('change'));
    document.getElementById("register").scrollIntoView({ behavior: 'smooth' });
}

function retrieveLocalStoragePreferences() {
    const historicalSelectionID = localStorage.getItem("preferredEventSelectionCache");
    if(historicalSelectionID) {
        const targetElementSelect = document.getElementById("regEventSelect");
        targetElementSelect.value = historicalSelectionID;
        targetElementSelect.dispatchEvent(new Event('change'));
    }
}

$(document).ready(function() {
    
    $('#bulletinImg').on('dblclick', function() {
        $(this).toggleClass('img-enlarged-transform');
        if ($(this).hasClass('img-enlarged-transform')) {
            $(this).animate({ width: "180px", height: "180px" }, 300);
        } else {
            $(this).animate({ width: "90px", height: "90px" }, 300);
        }
    });

    $('#categoryFilter').on('change', function() {
        const filterTargetValue = $(this).val();
        
        $('.event-card-container').each(function() {
            const currentItemCategory = $(this).data('category');
            if (filterTargetValue === 'all' || currentItemCategory === filterTargetValue) {
                $(this).fadeIn(400); 
            } else {
                $(this).fadeOut(400);
            }
        });
    });

    $('#searchInput').on('keyup', function() {
        const matchStringTerm = $(this).val().toLowerCase().trim();
        
        $('.event-card-container').each(function() {
            const specificCardTitleText = $(this).find('.card-title').text().toLowerCase();
            if (specificCardTitleText.includes(matchStringTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    $('#clearPrefBtn').on('click', function(e) {
        e.preventDefault();
        localStorage.clear();
        sessionStorage.clear();
        document.getElementById("regEventSelect").value = "";
        document.getElementById("feeDisplay").textContent = "";
        alert("Cache memory cleared safely.");
    });
});