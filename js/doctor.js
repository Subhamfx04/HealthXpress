document.getElementById("physicalDoctor").onclick = function () {
    console.log("Physical Doctor selected");
    alert("Physical Doctor option selected.\n(Feature can connect to hospital later)");
};

document.getElementById("aiDoctor").onclick = function () {
    console.log("AI Doctor selected");
    window.location.href = "ai-doctor.html";
};
