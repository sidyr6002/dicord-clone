"use client";
import React from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import Image from "next/image";
import PuffLoader from "react-spinners/PuffLoader";
import { File, XCircle } from "lucide-react";

interface FileUploaderProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "serverImage" | "messageFile";
}

const FileUploader = ({ onChange, value, endpoint }: FileUploaderProps) => {
    const [imageLoading, setImageLoading] = React.useState(true);
    const fileType = value?.split(".").pop();

    if (value && fileType !== "pdf") {
        return (
            <div className="flex justify-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-stone-400/50 rounded-full">
                            <PuffLoader
                                aria-label="Loading Spinner"
                                data-testid="loader"
                                cssOverride={{ display: "block", scale: "1.5" }}
                                color="#3b82f6"
                            />
                        </div>
                    )}

                    <Image
                        fill
                        src={value}
                        priority={true}
                        sizes="100%"
                        alt="Image File"
                        className="rounded-full"
                        onLoad={() => setImageLoading(false)}
                    />
                    {!imageLoading && <button
                        type="button"
                        className="m-0 p-0 absolute top-0 right-0 text-stone-100"
                        onClick={() => {
                            onChange("");
                            setImageLoading(true);
                        }}
                    >
                        <XCircle
                            aria-label="Remove image"
                            className="bg-stone-600 hover:bg-blue-800 border-0 rounded-full w-4 h-4 sm:w-5 sm:h-5"
                        />
                    </button>}
                </div>
            </div>
        );
    }

    if (value && fileType === "pdf") {
        return (
            <div className="flex items-center p-2 rounded-md bg-zinc-300 relative">
                <File className="w-9 h-9 text-blue-800" />
                <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-900 hover:underline">{value}</a>
                <button
                        type="button"
                        className="m-0 p-0 absolute top-[-5px] right-[-5px] text-stone-100"
                        onClick={() => {
                            onChange("");
                        }}
                    >
                        <XCircle
                            aria-label="Remove image"
                            className="bg-stone-600 hover:bg-blue-800 border-0 rounded-full w-4 h-4 sm:w-5 sm:h-5"
                        />
                    </button>
            </div>
        )
    }

    return (
        <UploadDropzone 
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                console.log("Upload Completed:", res);
                onChange(res?.[0].url);
            }}
            onUploadError={(error) => {
                alert(`ERROR! ${error.message}`);
            }}
        />
    );
};

export default FileUploader;
