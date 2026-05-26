// ─── Certificate database ────────────────────────────────────────────────────
// Each entry: regNo (6-digit/YYYY/domain), name, fatherName, rollNo,
//             totalHours, duration, internshipIn
const CERTIFICATES = [
  {
    regNo: "118470/2026/WD",
    name: "Pari Jain",
    fatherName: "Ashok Patodi",
    rollNo: "118470",
    totalHours: "120",
    duration: "12th April 2026 to 27th May 2026",
    internshipIn: "Web Design & Development",
  },
  {
    regNo: "118492/2026/WD",
    name: "Sakshi Agrawal",
    fatherName: "Amit Kumar",
    rollNo: "118492",
    totalHours: "120",
    duration: "12th April 2026 to 27th May 2026",
    internshipIn: "Web Design & Development",
  },
  {
    regNo: "118511/2026/WD",
    name: "Urvashi Jain",
    fatherName: "Neeraj Jain",
    rollNo: "118511",
    totalHours: "120",
    duration: "12th April 2026 to 27th May 2026",
    internshipIn: "Web Design & Development",
  },
  {
    regNo: "118420/2026/WD",
    name: "Arjun Trehan",
    fatherName: "Pankaj Trehan",
    rollNo: "118420",
    totalHours: "120",
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
