import ImageController from "@/app/utilities/ImageController";

export async function GET(request: Request) {
  const controller: ImageController = new ImageController();
  try {
    // access pageSize parameter
    // const { searchParams } = new URL(request.url);
    // const pageSize = searchParams.get('pagesize');
    const images = await controller.getFileList("3");
    const jsonImages: string = JSON.stringify(images);
    if (process.env.ENV === "DEV") console.log(images);
    return new Response(jsonImages, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {

    console.log(error);
    return new Response(`Error handling images request`,{
      status: 400,
      headers: { "Content-Type": "application/json" }
    });

  }

}

export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;

  const newUser = { id: Date.now(), name };

  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
