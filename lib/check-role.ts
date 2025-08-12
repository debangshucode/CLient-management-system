// lib/checkRole.ts
import { NextResponse } from "next/server"

export function checkRole(user: any, allowedRoles: string[]) {
  if (!user || !allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  return null // means allowed
}
