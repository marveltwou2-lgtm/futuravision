const URL = "./model/";

let model, webcam;

async function init() {
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");

    webcam = new tmImage.Webcam(300, 300, true);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    let best = prediction.reduce((a, b) =>
        a.probability > b.probability ? a : b
    );

    const label = best.className;
    const confidence = (best.probability * 100).toFixed(1);

    document.getElementById("prediction").innerText =
        label + " (" + confidence + "%)";

    showImpact(label);
}

function showImpact(label) {
    let text = "";

    if (label === "Fast Food") {
        text = "⚠️ Risiko kesehatan meningkat";
    } else if (label === "Plastic") {
        text = "🌍 Sampah +18kg/tahun";
    } else if (label === "Book") {
        text = "📚 Pengetahuan meningkat";
    } else if (label === "Gadget") {
        text = "👀 Risiko kelelahan mata";
    } else if (label === "Healthy Food") {
        text = "❤️ Dampak kesehatan positif";
    }

    document.getElementById("impact").innerText = text;
}