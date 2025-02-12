export interface EmergencyContact {
  stationName: string;
  phoneNumbers: string[];
  address: string;
  division: string;
  district: string;
  lastVerified: string;
}

export const emergencyContacts: EmergencyContact[] = [
  {
    stationName: "Dhaka Metropolitan Police HQ",
    phoneNumbers: ["999", "+880-2-9551188"],
    address: "36 Phoenix Rd, Dhaka 1000",
    division: "Dhaka",
    district: "Dhaka",
    lastVerified: "2025-02-01"
  },
  {
    stationName: "Uttara East Police Station",
    phoneNumbers: ["999", "+880-2-8932188"],
    address: "Sector 4, Uttara, Dhaka",
    division: "Dhaka",
    district: "Dhaka",
    lastVerified: "2025-02-01"
  },
  {
    stationName: "Chittagong Metropolitan Police HQ",
    phoneNumbers: ["999", "+880-31-630888"],
    address: "Police Line, Chittagong",
    division: "Chittagong",
    district: "Chittagong",
    lastVerified: "2025-02-01"
  },
  // Add more emergency contacts as needed
];

export function getEmergencyContacts(division: string, district: string): EmergencyContact[] {
  return emergencyContacts.filter(
    contact => 
      contact.division.toLowerCase() === division.toLowerCase() &&
      contact.district.toLowerCase() === district.toLowerCase()
  );
}
