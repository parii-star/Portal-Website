// ─── Certificate database ────────────────────────────────────────────────────
// Each entry: regNo (6-digit/YYYY/domain), name, fatherName, rollNo,
//             totalHours, duration, internshipIn
const HOURS_PER_DAY = 120 / 25;
const TOTAL_HOURS_FOR_45_DAYS = String(45 * HOURS_PER_DAY);

const CERTIFICATES = [
  {
    regNo: "128470/2026/WD",
    name: "Pari Patodi",
    fatherName: "Ashok Patodi",
    rollNo: "118470",
    totalHours: TOTAL_HOURS_FOR_45_DAYS,
    duration: "12th April 2026 to 27th May 2026",
    internshipIn: "Web Design & Development",
  },
  {
    regNo: "128492/2026/WD",
    name: "Sakshi Agrawal",
    fatherName: "Amit Kumar",
    rollNo: "118492",
    totalHours: TOTAL_HOURS_FOR_45_DAYS,
    duration: "12th April 2026 to 27th May 2026",
    internshipIn: "Web Design & Development",
  },
  {
    regNo: "128511/2026/WD",
    name: "Urvashi Jain",
    fatherName: "Neeraj Jain",
    rollNo: "118511",
    totalHours: TOTAL_HOURS_FOR_45_DAYS,
    duration: "12th April 2026 to 27th May 2026",
    internshipIn: "Web Design & Development",
  },
  {
    regNo: "128420/2026/WD",
    name: "Arjun Trehan",
    fatherName: "Pankaj Trehan",
    rollNo: "118420",
    totalHours: TOTAL_HOURS_FOR_45_DAYS,
    duration: "12th April 2026 to 27th May 2026",
    internshipIn: "Web Design & Development",
  },
];

function normalize(str) {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

export default function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { regNo, name } = req.body;

  // Basic input validation
  if (
    typeof regNo !== "string" ||
    typeof name !== "string" ||
    regNo.trim().length === 0 ||
    name.trim().length === 0
  ) {
    return res.status(400).json({ error: "Invalid input" });
  }

  // Truncate input to prevent abuse
  const safeRegNo = regNo.trim().slice(0, 30);
  const safeName = name.trim().slice(0, 100);

  const cert = CERTIFICATES.find(
    (c) =>
      normalize(c.regNo) === normalize(safeRegNo) &&
      normalize(c.name) === normalize(safeName)
  );

  if (cert) {
    return res.status(200).json({ found: true, certificate: cert });
  }

  return res.status(200).json({ found: false });
}
