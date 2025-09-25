import S3Image from "@/app/types/S3Image";
import { useState, useEffect} from "react";
import Skeleton from "../skeleton/Skeleton";

export default function MasonryGrid() {
    const [latestImages, setLatestImages] = useState<Array<S3Image>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch(`/api/images/`, {
                    method: 'GET',
                    headers: {
                    "Content-Type": "application/json"
                    }
                });
                const result = await response.json();
                setLatestImages(result.flat());
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);


    return (
        <section className="columns-1 sm:columns-2 lg:columns-3 py-10 md:py-20 gap-4">
            {
                isLoading ? (<Skeleton/>) :
                    latestImages.map((image, index) => (
                        <div className="mb-4 break-inside-avoid" key={index} data-speed={`${(index+1) * 0.9}`}>
                            <img 
                            src={image.url} 
                            alt={image.key} 
                            loading="lazy"
                            className="w-full object-cover rounded-lg img"
                            />
                        </div>
                        )
                    )
            }
        </section>
    );
}