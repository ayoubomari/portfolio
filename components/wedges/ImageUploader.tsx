"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faCopy, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogPostImage } from "@/db/schema";

interface ImageUploaderProps {
  tableId: number;
  tableName: string;
  pathName: string;
}

async function addImages(pathName: string, formData: FormData) {
  const response = await fetch(`/api/dashboard/${pathName}/images`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Failed to upload images");
  }

  return response.json();
}

async function fetchImages(
  tableName: string,
  pathName: string,
  tableId: number,
) {
  const response = await fetch(
    `/api/dashboard/${pathName}/images?${tableName}Id=${tableId}`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Failed to fetch blog post images");
  }
  return response.json();
}

async function deleteImageFromServerById(
  tableName: string,
  pathName: string,
  id: number,
) {
  const response = await fetch(
    `/api/dashboard/${pathName}/images?imageId=${id}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || "Failed to delete image");
  }

  return response.json();
}

export default function ImageUploader({
  tableId,
  tableName,
  pathName,
}: ImageUploaderProps) {
  const [images, setImages] = useState<File[]>([]);
  const [blogPostImages, setBlogPostImages] = useState<
    (typeof blogPostImage.$inferInsert)[] | undefined
  >([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: fetchedBlogPostImages,
    isLoading: blogPostImagesLoading,
    error: blogPostImagesError,
  } = useQuery({
    queryKey: ["blogPostImages", tableId],
    queryFn: () => fetchImages(tableName, pathName, tableId),
  });

  useEffect(() => {
    if (fetchedBlogPostImages?.[0]?.id !== blogPostImages?.[0]?.id)
      setBlogPostImages(fetchedBlogPostImages);
  }, [fetchedBlogPostImages]);

  const addImagesMutation = useMutation({
    mutationFn: (formData: FormData) => addImages(pathName, formData),
    onSuccess: () => {
      setImages([]);
      toast({
        title: "Images uploaded",
        description: "The images have been uploaded successfully.",
        variant: "success",
        action: (
          <ToastAction altText="View blog post">View blog post</ToastAction>
        ),
      });
    },
    onError: () => {
      toast({
        title: "Error uploading images",
        description:
          "There was an error uploading the images. Please try again.",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (id: number) =>
      deleteImageFromServerById(tableName, pathName, id),
    onSuccess: (_, id) => {
      setBlogPostImages((prevImages) =>
        prevImages?.filter((image) => image.id !== id),
      );
      toast({
        title: "Image deleted",
        description: "The image has been deleted successfully.",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error deleting image",
        description: "There was an error deleting the image. Please try again.",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages((prevImages) => [
        ...prevImages,
        ...Array.from(e.target.files!),
      ]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append(`${tableName}Id`, tableId.toString());

    Array.from(images).forEach((image) => formData.append("images", image));

    addImagesMutation.mutate(formData);
  };

  const handleDelete = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleCopy = (src: string, alt: string) => {
    navigator.clipboard.writeText(`<img src="${src}" alt="${alt}">`);
    toast({
      title: "Image link copied",
      description: "The image link has been copied to your clipboard.",
    });
  };

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold">Add Images</h2>
      <div className="mb-4 flex items-center">
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className="mr-2 rounded-md bg-gray-200 px-4 py-2"
          accept="image/*"
        />
        <Button onClick={handleSubmit}>
          <FontAwesomeIcon icon={faUpload} className="mr-2" />
          Upload Images
        </Button>
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-md bg-white p-4 shadow-md"
            >
              <img
                src={URL.createObjectURL(image)}
                alt={`Blog Post Image ${index + 1}`}
                className="mb-2 h-48 w-48 w-full rounded-md object-cover"
              />
              <div className="flex w-full flex-wrap items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    handleCopy(
                      `/uploads/${pathName}-images/${image.name}`,
                      image.name.split(".")[0] || image.name,
                    )
                  }
                >
                  <FontAwesomeIcon icon={faCopy} className="mr-2" />
                  Copy Link
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(index)}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* From Server */}
      {blogPostImages && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blogPostImages.map((row, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-md bg-white p-4 shadow-md"
            >
              <img
                src={`/uploads/${pathName}-images/${row.src}`}
                alt={`Blog Post src ${index + 1}`}
                className="mb-2 h-48 w-48 rounded-md object-cover"
              />
              <div className="flex w-full flex-wrap items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    handleCopy(
                      `/uploads/${pathName}-images/${row.src}`,
                      row.alt,
                    )
                  }
                >
                  <FontAwesomeIcon icon={faCopy} className="mr-2" />
                  Copy Link
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteImageMutation.mutate(row.id!)}
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
