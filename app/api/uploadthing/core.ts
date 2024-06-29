import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
 
const f = createUploadthing();
 
const handleAuth = () => {
    const { userId } = auth();
    if (!userId) {
        throw new UploadThingError("Unauthorized");
    }
    return { userId: userId };
};
 
export const ourFileRouter = {
    serverImage: f({ image: {maxFileSize: "4MB", maxFileCount: 1} })
        .middleware(handleAuth)
        .onUploadComplete(() => {
            console.log("Image upload successful!")
        }),
    messageFile: f(["image", "pdf"])
        .middleware(handleAuth)
        .onUploadComplete((data) => {
            console.log("Data", data)
            console.log("File upload successful!")
        })

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;