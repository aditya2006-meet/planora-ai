"use client";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import {
  Sparkles,
  Globe,
  Plane,
  MapPinned,
  Compass,
} from "lucide-react";

import ParticlesBackground from "@/components/ParticlesBackground";
import { useState, useEffect } from "react";
export default function Home() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [mood, setMood] = useState("Adventure");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [tripHistory, setTripHistory] = useState<any[]>([]);
  const saveTripToHistory = (tripData: any) => {
  const existingTrips = JSON.parse(
  localStorage.getItem("tripHistory") || "[]"
  );

  const updatedTrips = [tripData, ...existingTrips].slice(0, 10);

  localStorage.setItem(
  "tripHistory",
  JSON.stringify(updatedTrips)
  );

  setTripHistory(updatedTrips);
  };

  useEffect(() => {
    const savedTrips = JSON.parse(
      localStorage.getItem("tripHistory") || "[]"
    );
    setTripHistory(savedTrips);
  }, []);

  const deleteTrip = (index: number) => {
    const updatedTrips = tripHistory.filter((_, i) => i !== index);
    setTripHistory(updatedTrips);
    localStorage.setItem("tripHistory", JSON.stringify(updatedTrips));
  };

  const handleMouseMove = (e: any) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

const generateTrip = async () => {
  console.log("Button clicked");

  try {
    setLoading(true);

    const response = await fetch("/api/generate-trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destination,
        budget,
        days,
        mood,
      }),
    });

    const data = await response.json();

    console.log(data);

    if (!data.result) {
      console.error("API Error:", data);
      alert(data.error || "Failed to generate trip");
      return;
    }

    const cleaned = data.result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

setResult(parsed);

// SAVE TO HISTORY
const history = JSON.parse(
  localStorage.getItem("tripHistory") || "[]"
);

history.unshift(parsed);

localStorage.setItem(
  "tripHistory",
  JSON.stringify(history)
);

setTimeout(() => {
  document
    .getElementById("trip-result")
    ?.scrollIntoView({ behavior: "smooth" });
}, 300);
  } catch (err) {
    console.error("JSON Parse Error:", err);

    setResult({
      title: "Unable to parse itinerary",
      budget: "",
      days: [],
      food: [],
      hiddenGems: [],
      tips: [],
    });
  } finally {
    setLoading(false);
  }
};

const downloadPDF = () => {
if (!result) return;

const doc = new jsPDF();

let y = 20;

doc.setFontSize(20);
doc.text(result.title || "Travel Itinerary", 10, y);

y += 15;

doc.setFontSize(12);
doc.text(`Budget: ${result.budget}`, 10, y);

y += 15;

result.days?.forEach((day: any) => {
doc.setFontSize(14);
doc.text(`Day ${day.day}`, 10, y);


y += 8;

doc.setFontSize(11);

day.activities?.forEach((activity: any) => {
  const activityText =
    typeof activity === "string"
      ? activity
      : `${activity.time || ""} - ${activity.description || ""}`;

  const lines = doc.splitTextToSize(
  `• ${activityText}`,
  170
);

doc.text(lines, 15, y);

y += lines.length * 7;

  y += 7;

  if (y > 270) {
    doc.addPage();
    y = 20;
  }
});

y += 8;


});
y += 15;

doc.setFontSize(18);
doc.setFont("helvetica", "bold");
doc.text("Food", 10, y);
y += 10;

doc.setFont("helvetica", "normal");
result.food?.forEach((item: string) => {
  const lines = doc.splitTextToSize(`• ${item}`, 170);
	if (y > 260) {
    doc.addPage();
    y = 20;
  }

  doc.text(lines, 15, y);
  y  +=  lines.length  *  10;
});

y += 15;

doc.setFontSize(18);
doc.setFont("helvetica", "bold");
doc.text("Hidden Gems", 10, y);

y += 10;

doc.setFont("helvetica", "normal");

result.hiddenGems?.forEach((item: string) => {
  const lines = doc.splitTextToSize(`• ${item}`, 170);

  if (y > 260) {
    doc.addPage();
    y = 20;
  }

  doc.text(lines, 15, y);
  y  +=  lines.length  *  10;
});

y += 15;

doc.setFontSize(18);
doc.setFont("helvetica", "bold");
doc.text("Travel Tips", 10, y);

y += 10;

doc.setFont("helvetica", "normal");

result.tips?.forEach((item: string) => {
  const lines = doc.splitTextToSize(`• ${item}`, 170);

  if (y > 260) {
    doc.addPage();
    y = 20;
  }

  doc.text(lines, 15, y);
  y  +=  lines.length  *  10;
});

doc.save(`${destination}-itinerary.pdf`);
};


  return (
    <main
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-[#eef2f7] text-slate-800"
    >
      {/* Particles */}
      <ParticlesBackground />

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-sky-200/40 blur-3xl"></div>

        <div className="absolute top-[20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-200/40 blur-3xl"></div>

        <div className="absolute bottom-[-20%] left-[20%] h-[700px] w-[700px] rounded-full bg-blue-100/50 blur-3xl"></div>
      </div>

      {/* Mouse Glow */}
      <div
        className="pointer-events-none absolute z-0 h-[400px] w-[400px] rounded-full bg-sky-300/20 blur-3xl transition duration-300"
        style={{
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
        }}
      ></div>

      {/* Floating Icons */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute left-[8%] top-[20%] z-10 rounded-full bg-white/70 p-5 shadow-xl backdrop-blur-2xl"
      >
        <Plane className="text-sky-400" size={28} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
        className="absolute right-[10%] top-[55%] z-10 rounded-full bg-white/70 p-5 shadow-xl backdrop-blur-2xl"
      >
        <MapPinned className="text-violet-400" size={28} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="absolute bottom-[15%] left-[15%] z-10 rounded-full bg-white/70 p-5 shadow-xl backdrop-blur-2xl"
      >
        <Compass className="text-fuchsia-300" size={28} />
      </motion.div>

      {/* Navbar */}
      <nav className="fixed left-1/2 top-6 z-50 w-[90%] max-w-7xl -translate-x-1/2 rounded-full border border-white/20 bg-white/80 px-8 py-5 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-sky-300 to-violet-400 bg-clip-text text-3xl font-black tracking-[0.2em] text-transparent"
          >
            PLANORA
          </motion.h1>

          <div className="hidden items-center gap-8 text-sm font-medium text-gray-800 md:flex">
            <a href="#" className="transition hover:text-violet-500">
              Features
            </a>

            <a href="#" className="transition hover:text-violet-500">
              AI Planner
            </a>

            <a href="#" className="transition hover:text-violet-500">
              Experience
            </a>
          </div>

          <button className="rounded-full border border-sky-300/40 bg-white/70 px-6 py-3 text-sky-500 transition hover:bg-sky-100">
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pt-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex items-center gap-2 rounded-full border border-sky-300/40 bg-white/70 px-5 py-2 text-sky-500 backdrop-blur-xl"
        >
          <Sparkles size={16} />
          AI-Powered Travel Experience
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl text-6xl font-black leading-[0.95] tracking-[-0.04em] md:text-[7rem]"
        >
          PLAN THE
          <br />

          <span className="bg-gradient-to-r from-[#4facfe] via-[#6a8dff] to-[#b06cff] bg-clip-text text-transparent">
            FUTURE
          </span>

          <br />

          OF TRAVEL
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 max-w-4xl text-xl leading-relaxed tracking-wide text-gray-600 md:text-2xl"
        >
          Generate cinematic AI-powered itineraries, discover hidden gems,
          optimize your budget, and experience futuristic trip planning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 flex flex-wrap gap-5"
        >
          <button className="rounded-2xl bg-gradient-to-r from-sky-400 to-violet-400 px-10 py-5 text-lg font-bold text-white shadow-2xl transition hover:scale-105">
            Start Exploring
          </button>

          <button className="rounded-2xl border border-white/20 bg-white/80 px-10 py-5 text-lg transition hover:bg-white">
            Watch Demo
          </button>
        </motion.div>
      </section>

      {/* AI Trip Generator */}
      <section className="relative z-10 px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-5xl rounded-[40px] border border-white/20 bg-white/70 p-10 shadow-2xl backdrop-blur-3xl"
        >
          <h2 className="text-center text-5xl font-black text-slate-800">
            Generate Your AI Journey
          </h2>

          <p className="mt-5 text-center text-slate-500">
            Let Planora AI create your dream itinerary instantly.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-slate-600">
                Destination
              </label>

              <input
                type="text"
                placeholder="Tokyo"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-white/80 px-5 py-4 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-slate-600">
                Budget
              </label>

              <input
                type="text"
                placeholder="₹50,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-white/80 px-5 py-4 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-slate-600">
                Days
              </label>

              <input
                type="text"
                placeholder="5"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-white/80 px-5 py-4 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-slate-600">
                Travel Mood
              </label>

              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full rounded-2xl border border-white/20 bg-white/80 px-5 py-4 outline-none"
              >
                <option>Adventure</option>
                <option>Luxury</option>
                <option>Relax</option>
                <option>Romantic</option>
                <option>Cyberpunk</option>
              </select>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={generateTrip}
              className="rounded-2xl bg-gradient-to-r from-sky-400 to-violet-400 px-10 py-5 text-lg font-bold text-white shadow-2xl transition hover:scale-105"
            >
              {loading ? "Generating..." : "Generate AI Trip"}
            </button>
          </div>

          {tripHistory.length > 0 && (
            <div className="mt-10 border-t pt-10">
              <h3 className="mb-4 text-xl font-bold text-slate-700">🕒 Recent Trips</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {tripHistory.slice(0, 6).map((trip, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setResult(trip)}
                    className="group cursor-pointer rounded-xl border border-slate-200 bg-gradient-to-r from-sky-50 to-violet-50 p-4 transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 group-hover:text-violet-600 truncate">
                          {trip.title}
                        </h4>
                        <p className="text-sm text-slate-500">{trip.budget}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTrip(index);
                        }}
                        className="ml-2 text-red-400 hover:text-red-600 text-lg"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {result && (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-12 rounded-3xl bg-white/80 overflow-hidden shadow-2xl"
  >
    <div className="relative h-80 w-full overflow-hidden rounded-t-3xl">
      <img
        src={`https://source.unsplash.com/1200x500/?${destination},travel,landscape`}
        alt={destination}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>
    
    <div className="p-8 text-left">
      <h2 className="mb-6 text-4xl font-black text-slate-800">
        {result.title}
      </h2>
	<div className="mb-6">
 	 <button
   	 onClick={downloadPDF}
    	className="rounded-xl bg-green-500 px-5 py-3 font-bold text-	white hover:bg-green-600"
  	>
    	📄 Download PDF
  	</button>
	</div>

    <div className="mb-8 rounded-2xl bg-sky-50 p-5">
      <h3 className="font-bold text-sky-700">
        💰 Budget
      </h3>

      <p>{result.budget}</p>
    </div>

    <div className="space-y-6">
      {result.days?.map((day: any, index: number) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 p-5"
        >
          <h3 className="mb-3 text-2xl font-bold">
            📅 Day {day.day}
          </h3>

          <ul className="list-disc pl-6 space-y-2">
		{day.activities?.map((activity: any, i: number) => (
  		   <li key={i}>
    		     {typeof activity === "string"
      			? activity
		        : `${activity.time || ""} - ${activity.description || ""}`}
  	    </li>
		))}
          </ul>
        </div>
      ))}
    </div>

    <div className="mt-8 grid gap-6 md:grid-cols-3">
      <div className="rounded-2xl bg-orange-50 p-5">
        <h3 className="mb-3 font-bold">
          🍜 Food
        </h3>

        <ul className="space-y-2">
          {result.food?.map(
            (item: string, i: number) => (
              <li key={i}>{item}</li>
            )
          )}
        </ul>
      </div>

      <div className="rounded-2xl bg-violet-50 p-5">
        <h3 className="mb-3 font-bold">
          💎 Hidden Gems
        </h3>

        <ul className="space-y-2">
          {result.hiddenGems?.map(
            (item: string, i: number) => (
              <li key={i}>{item}</li>
            )
          )}
        </ul>
      </div>

      <div className="rounded-2xl bg-green-50 p-5">
        <h3 className="mb-3 font-bold">
          ✈️ Travel Tips
        </h3>

        <ul className="space-y-2">
          {result.tips?.map(
            (item: string, i: number) => (
              <li key={i}>{item}</li>
            )
          )}
        </ul>
      </div>
       </div>
       </div>
  </motion.div>
)}

        </motion.div>
      </section>
    </main>
  );
}