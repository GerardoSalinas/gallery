import ImageController from "@/app/utilities/ImageController";
import { getMimeType } from "@/app/utilities/Utilities";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const objectKey = searchParams.get("key") ?? '';
    const controller: ImageController = new ImageController();
    const imageBytes = await controller.getFile(objectKey);
    if (!imageBytes) {
      return new Response('Image not found', { status: 404 });
    }
    const mimeType = getMimeType(objectKey);
    const imageBlob = new Blob([imageBytes!], {type: mimeType});
    return new Response(imageBlob, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600',
      }
    });
}

export async function POST(request: Request) {
  // Parse the request body
  const body = await request.json();
  const { name } = body;

  // e.g. Insert new user into your DB
  const newUser = { id: Date.now(), name };

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}