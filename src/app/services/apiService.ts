import axiosInstance from "../axiosInstance";

export interface Response {
    code: number;
    message: string;
    success: boolean;
    data: | string[]
    | { [key: string]: string[] }
    | null;
}

/**
 * Upload Img
 * @param postData 
 * @returns
 */
export const uploadImages = async (postData: FormData): Promise<Response> => {
    try {
        return await axiosInstance.post("problemFeedback/uploadImages", postData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

export const createQuestion = async (postData: {
    context: string,
    image: string,
    userAddress: string
}): Promise<Response> => {
    try {
        return await axiosInstance.post("problemFeedback/commit", postData);
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};