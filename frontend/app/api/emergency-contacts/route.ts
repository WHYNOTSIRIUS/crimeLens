import { NextResponse } from "next/server";
import { emergencyContacts } from "@/lib/emergency-contacts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const division = searchParams.get("division");
  const district = searchParams.get("district");

  if (!division || !district) {
    return NextResponse.json(
      { error: "Division and district are required" },
      { status: 400 }
    );
  }

  const filteredContacts = emergencyContacts.filter(
    (contact) =>
      contact.division.toLowerCase() === division.toLowerCase() &&
      contact.district.toLowerCase() === district.toLowerCase()
  );

  return NextResponse.json(filteredContacts);
}
