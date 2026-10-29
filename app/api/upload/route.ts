import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No image file provided" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    const backendUrl = `${
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api/v1"
    }/cms/upload`;

    // Forward multipart form data to backend
    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    console.error("API Upload error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Image upload failed" },
      { status: 500 }
    );
  }
}

